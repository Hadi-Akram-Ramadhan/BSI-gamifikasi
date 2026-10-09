package ws

import (
	"encoding/json"
	"log"
	"sort"
	"sync"
	"time"

	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/service"
)

type RoomBroadcast struct {
	RoomCode string
	Message  WSMessage
}

type Hub struct {
	gameEngine  *service.GameEngine
	roomClients map[string]map[*Client]bool
	mu          sync.RWMutex
	broadcast   chan RoomBroadcast
	unregister  chan *Client
}

func NewHub(engine *service.GameEngine) *Hub {
	return &Hub{
		gameEngine:  engine,
		roomClients: make(map[string]map[*Client]bool),
		broadcast:   make(chan RoomBroadcast, 256),
		unregister:  make(chan *Client, 64),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case req := <-h.broadcast:
			h.mu.RLock()
			clients := h.roomClients[req.RoomCode]
			if clients != nil {
				data, err := json.Marshal(req.Message)
				if err == nil {
					for client := range clients {
						select {
						case client.send <- data:
						default:
							// Client lambat / buffer penuh
						}
					}
				}
			}
			h.mu.RUnlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if client.roomCode != "" {
				if clients, ok := h.roomClients[client.roomCode]; ok {
					delete(clients, client)
					if len(clients) == 0 {
						delete(h.roomClients, client.roomCode)
					}
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) UnregisterClient(c *Client) {
	h.unregister <- c
}

func (h *Hub) BroadcastToRoom(roomCode string, msg WSMessage) {
	h.broadcast <- RoomBroadcast{
		RoomCode: roomCode,
		Message:  msg,
	}
}

func (h *Hub) HandleMessage(c *Client, msg WSMessage) {
	switch msg.Type {
	case EventJoinRoom:
		var p JoinPayload
		if err := json.Unmarshal(msg.Payload, &p); err != nil {
			c.SendError("Data join room tidak valid")
			return
		}

		roomCode := msg.RoomCode
		if roomCode == "" {
			c.SendError("Kode room harus diisi")
			return
		}

		_, err := h.gameEngine.GetRoom(roomCode)
		if err != nil {
			c.SendError(err.Error())
			return
		}

		// Daftarkan koneksi client ke room
		h.mu.Lock()
		if _, ok := h.roomClients[roomCode]; !ok {
			h.roomClients[roomCode] = make(map[*Client]bool)
		}
		h.roomClients[roomCode][c] = true
		c.roomCode = roomCode
		c.playerID = p.PlayerID
		c.isHost = p.IsHost
		h.mu.Unlock()

		// Jika bukan host TV, tambahkan ke data engine pemain
		if !p.IsHost {
			_, err := h.gameEngine.JoinRoom(roomCode, p.PlayerID, p.Name, p.Avatar, p.Team)
			if err != nil && err != domain.ErrRoomFull {
				// Abaikan jika sudah pernah join (reconnect)
				log.Printf("Join room notice: %v", err)
			}
		}

		// Ambil data room terbaru dan kirim broadcast
		updatedRoom, _ := h.gameEngine.GetRoom(roomCode)
		roomData, _ := json.Marshal(updatedRoom)
		h.BroadcastToRoom(roomCode, WSMessage{
			Type:     EventRoomState,
			RoomCode: roomCode,
			Payload:  roomData,
		})

	case EventStartGame:
		roomCode := msg.RoomCode
		if err := h.gameEngine.StartGame(roomCode); err != nil {
			c.SendError(err.Error())
			return
		}

		room, err := h.gameEngine.GetRoom(roomCode)
		if err != nil {
			c.SendError(err.Error())
			return
		}

		currentQ := room.Questions[room.CurrentQuestionIdx]
		payload, _ := json.Marshal(GameStartedPayload{
			Question:       currentQ,
			QuestionIndex:  room.CurrentQuestionIdx,
			TotalQuestions: len(room.Questions),
			StartTime:      room.QuestionStartTime,
		})

		h.BroadcastToRoom(roomCode, WSMessage{
			Type:     EventGameStarted,
			RoomCode: roomCode,
			Payload:  payload,
		})

	case EventSubmitAnswer:
		var p SubmitAnswerPayload
		if err := json.Unmarshal(msg.Payload, &p); err != nil {
			c.SendError("Data jawaban tidak valid")
			return
		}

		ans, room, err := h.gameEngine.SubmitAnswer(msg.RoomCode, p.PlayerID, p.Option, time.Now())
		if err != nil {
			c.SendError(err.Error())
			return
		}

		greenScore, orangeScore := h.gameEngine.GetTeamScores(room)
		player := room.Players[p.PlayerID]

		resPayload, _ := json.Marshal(AnswerResultPayload{
			PlayerID:       p.PlayerID,
			SelectedOption: p.Option,
			IsCorrect:      ans.IsCorrect,
			PointsEarned:   ans.PointsEarned,
			Streak:         player.Streak,
			GreenScore:     greenScore,
			OrangeScore:    orangeScore,
		})

		h.BroadcastToRoom(msg.RoomCode, WSMessage{
			Type:     EventAnswerResult,
			RoomCode: msg.RoomCode,
			Payload:  resPayload,
		})

	case EventNextQuestion:
		room, isOver, err := h.gameEngine.NextQuestion(msg.RoomCode)
		if err != nil {
			c.SendError(err.Error())
			return
		}

		if isOver {
			// Hitung pemenang dan leaderboard
			greenScore, orangeScore := h.gameEngine.GetTeamScores(room)
			var winnerTeam domain.TeamType = domain.TeamNone
			if greenScore > orangeScore {
				winnerTeam = domain.TeamGreen
			} else if orangeScore > greenScore {
				winnerTeam = domain.TeamOrange
			}

			// Urutkan leaderboard
			leaderboard := make([]*domain.Player, 0, len(room.Players))
			for _, p := range room.Players {
				leaderboard = append(leaderboard, p)
			}
			sort.Slice(leaderboard, func(i, j int) bool {
				return leaderboard[i].Score > leaderboard[j].Score
			})

			overPayload, _ := json.Marshal(GameOverPayload{
				WinnerTeam:  winnerTeam,
				GreenScore:  greenScore,
				OrangeScore: orangeScore,
				Leaderboard: leaderboard,
			})

			h.BroadcastToRoom(msg.RoomCode, WSMessage{
				Type:     EventGameOver,
				RoomCode: msg.RoomCode,
				Payload:  overPayload,
			})
			return
		}

		// Soal berikutnya
		nextQ := room.Questions[room.CurrentQuestionIdx]
		changePayload, _ := json.Marshal(GameStartedPayload{
			Question:       nextQ,
			QuestionIndex:  room.CurrentQuestionIdx,
			TotalQuestions: len(room.Questions),
			StartTime:      room.QuestionStartTime,
		})

		h.BroadcastToRoom(msg.RoomCode, WSMessage{
			Type:     EventQuestionChange,
			RoomCode: msg.RoomCode,
			Payload:  changePayload,
		})
	}
}
