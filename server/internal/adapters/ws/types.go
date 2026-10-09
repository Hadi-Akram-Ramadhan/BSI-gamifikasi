package ws

import (
	"encoding/json"
	"time"

	"bsi-gamifikasi/server/internal/domain"
)

// WSEventType tipe event WebSocket
type WSEventType string

const (
	// Inbound Events (dari Browser Client ke Server)
	EventJoinRoom     WSEventType = "join_room"
	EventStartGame    WSEventType = "start_game"
	EventSubmitAnswer WSEventType = "submit_answer"
	EventNextQuestion WSEventType = "next_question"

	// Outbound Events (dari Server ke Browser Client)
	EventRoomState      WSEventType = "room_state"
	EventPlayerJoined   WSEventType = "player_joined"
	EventGameStarted    WSEventType = "game_started"
	EventAnswerResult   WSEventType = "answer_result"
	EventQuestionChange WSEventType = "question_change"
	EventGameOver       WSEventType = "game_over"
	EventError          WSEventType = "error"
)

// WSMessage struktur pesan JSON protokol WebSocket
type WSMessage struct {
	Type     WSEventType     `json:"type"`
	RoomCode string          `json:"room_code,omitempty"`
	Payload  json.RawMessage `json:"payload,omitempty"`
}

// Inbound Payload Structures
type JoinPayload struct {
	PlayerID string          `json:"player_id"`
	Name     string          `json:"name"`
	Avatar   string          `json:"avatar"`
	Team     domain.TeamType `json:"team"`
	IsHost   bool            `json:"is_host"` // TV Screen / Teacher Display
}

type SubmitAnswerPayload struct {
	PlayerID string           `json:"player_id"`
	Option   domain.OptionKey `json:"option"`
}

// Outbound Payload Structures
type GameStartedPayload struct {
	Question       domain.Question `json:"question"`
	QuestionIndex  int             `json:"question_index"`
	TotalQuestions int             `json:"total_questions"`
	StartTime      time.Time       `json:"start_time"`
}

type AnswerResultPayload struct {
	PlayerID       string           `json:"player_id"`
	SelectedOption domain.OptionKey `json:"selected_option"`
	IsCorrect      bool             `json:"is_correct"`
	PointsEarned   int              `json:"points_earned"`
	Streak         int              `json:"streak"`
	GreenScore     int              `json:"green_score,omitempty"`
	OrangeScore    int              `json:"orange_score,omitempty"`
}

type GameOverPayload struct {
	WinnerTeam  domain.TeamType   `json:"winner_team,omitempty"`
	GreenScore  int               `json:"green_score"`
	OrangeScore int               `json:"orange_score"`
	Leaderboard []*domain.Player  `json:"leaderboard"`
}

type ErrorPayload struct {
	Message string `json:"message"`
}
