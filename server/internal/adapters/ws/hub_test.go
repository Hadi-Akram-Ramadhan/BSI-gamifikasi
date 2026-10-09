package ws_test

import (
	"encoding/json"
	"testing"
	"time"

	"bsi-gamifikasi/server/internal/adapters/ws"
	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/service"
)

func TestTokenBucketLimiter(t *testing.T) {
	// Limiter dengan kapasitas 3 token, refill 10/detik
	lim := ws.NewTokenBucketLimiter(3, 10)

	// 3 request pertama harus diizinkan (burst)
	for range 3 {
		if !lim.Allow() {
			t.Errorf("Request dalam batas burst harus diizinkan")
		}
	}

	// Request ke-4 langsung harus ditolak karena token habis
	if lim.Allow() {
		t.Errorf("Request ke-4 harus ditolak karena token habis")
	}

	// Tunggu 150ms agar token terisi kembali (150ms * 10 = 1.5 token)
	time.Sleep(150 * time.Millisecond)
	if !lim.Allow() {
		t.Errorf("Request setelah refill harus diizinkan")
	}
}

func TestHub_LifecycleAndEvents(t *testing.T) {
	engine := service.NewGameEngine()
	hub := ws.NewHub(engine)
	go hub.Run()

	questions := []domain.Question{
		{
			ID:               "q1",
			ModuleID:         1,
			QuestionText:     "Berapa 5 + 5?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "10"},
				{Key: domain.OptionB, Text: "11"},
				{Key: domain.OptionC, Text: "12"},
				{Key: domain.OptionD, Text: "13"},
			},
			CorrectOption:    domain.OptionA,
			TimeLimitSeconds: 15,
		},
	}

	room, err := engine.CreateRoom("TESTROOM", domain.Mode1v1, 1, "Kenali Uang", questions)
	if err != nil {
		t.Fatalf("Gagal buat room: %v", err)
	}

	// Verifikasi room exists di engine
	if room.Code != "TESTROOM" {
		t.Errorf("Kode room salah: %s", room.Code)
	}

	// Broadcast test tidak panic
	hub.BroadcastToRoom("TESTROOM", ws.WSMessage{
		Type:     ws.EventRoomState,
		RoomCode: "TESTROOM",
		Payload:  json.RawMessage(`{"status":"ok"}`),
	})
}
