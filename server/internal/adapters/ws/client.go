package ws

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 4096 // 4 KB per frame cukup untuk event gamifikasi
)

// TokenBucketLimiter pencegah spam/DDoS per-koneksi tanpa memblokir IP NAT sekolah
type TokenBucketLimiter struct {
	mu         sync.Mutex
	tokens     float64
	capacity   float64
	refillRate float64 // token per detik
	lastRefill time.Time
}

func NewTokenBucketLimiter(capacity, refillRate float64) *TokenBucketLimiter {
	return &TokenBucketLimiter{
		tokens:     capacity,
		capacity:   capacity,
		refillRate: refillRate,
		lastRefill: time.Now(),
	}
}

func (lim *TokenBucketLimiter) Allow() bool {
	lim.mu.Lock()
	defer lim.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(lim.lastRefill).Seconds()
	lim.tokens = min(lim.capacity, lim.tokens+elapsed*lim.refillRate)
	lim.lastRefill = now

	if lim.tokens >= 1.0 {
		lim.tokens -= 1.0
		return true
	}
	return false
}

type Client struct {
	hub         *Hub
	conn        *websocket.Conn
	send        chan []byte
	roomCode    string
	playerID    string
	isHost      bool
	rateLimiter *TokenBucketLimiter
}

func NewClient(hub *Hub, conn *websocket.Conn) *Client {
	return &Client{
		hub:         hub,
		conn:        conn,
		send:        make(chan []byte, 64),
		rateLimiter: NewTokenBucketLimiter(15, 5), // Kapasitas burst 15, isi 5/detik
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.hub.UnregisterClient(c)
		_ = c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WS Read Error: %v", err)
			}
			break
		}

		// Periksa rate limiter per sesi browser
		if !c.rateLimiter.Allow() {
			c.SendError("Terlalu banyak permintaan cepat. Mohon tunggu sejenak.")
			continue
		}

		var wsMsg WSMessage
		if err := json.Unmarshal(message, &wsMsg); err != nil {
			c.SendError("Format pesan tidak valid")
			continue
		}

		c.hub.HandleMessage(c, wsMsg)
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Hub menutup channel
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, _ = w.Write(message)

			// Drain antrean pengiriman sekaligus
			n := len(c.send)
			for range n {
				_, _ = w.Write([]byte{'\n'})
				_, _ = w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) SendJSON(v any) {
	data, err := json.Marshal(v)
	if err != nil {
		return
	}
	select {
	case c.send <- data:
	default:
		// Jika buffer penuh, drop untuk mencegah goroutine hang
	}
}

func (c *Client) SendError(msg string) {
	errPayload, _ := json.Marshal(ErrorPayload{Message: msg})
	c.SendJSON(WSMessage{
		Type:     EventError,
		RoomCode: c.roomCode,
		Payload:  errPayload,
	})
}
