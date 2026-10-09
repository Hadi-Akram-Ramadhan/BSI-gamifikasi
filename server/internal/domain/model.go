package domain

import "time"

type GameMode string

const (
	Mode1v1  GameMode = "1v1"
	ModeTeam GameMode = "team"
)

type TeamType string

const (
	TeamNone   TeamType = "none"
	TeamGreen  TeamType = "hijau"  // Tim Hijau (BSI Green)
	TeamOrange TeamType = "oranye" // Tim Oranye (Maslahat Orange)
)

type RoomState string

const (
	StateWaiting    RoomState = "waiting"
	StateInProgress RoomState = "in_progress"
	StateFinished   RoomState = "finished"
)

type OptionKey string

const (
	OptionA OptionKey = "A"
	OptionB OptionKey = "B"
	OptionC OptionKey = "C"
	OptionD OptionKey = "D"
)

type Question struct {
	ID               string      `json:"id"`
	ModuleID         int         `json:"module_id"`
	QuestionText     string      `json:"question_text"`
	Options          []Option    `json:"options"`
	CorrectOption    OptionKey   `json:"correct_option"`
	TimeLimitSeconds int         `json:"time_limit_seconds"`
	Explanation      string      `json:"explanation"`
}

type Option struct {
	Key  OptionKey `json:"key"`
	Text string    `json:"text"`
}

type PlayerAnswer struct {
	QuestionID  string    `json:"question_id"`
	SelectedKey OptionKey `json:"selected_key"`
	IsCorrect   bool      `json:"is_correct"`
	PointsEarned int      `json:"points_earned"`
	AnsweredAt  time.Time `json:"answered_at"`
	ResponseTimeMs int64  `json:"response_time_ms"`
}

type Player struct {
	ID        string         `json:"id"`
	Name      string         `json:"name"`
	Avatar    string         `json:"avatar"`
	Team      TeamType       `json:"team"`
	Score     int            `json:"score"`
	Streak    int            `json:"streak"`
	MaxStreak int            `json:"max_streak"`
	Answers   []PlayerAnswer `json:"answers"`
	IsReady   bool           `json:"is_ready"`
}

type Room struct {
	Code               string            `json:"code"`
	Mode               GameMode          `json:"mode"`
	ModuleID           int               `json:"module_id"`
	ModuleName         string            `json:"module_name"`
	State              RoomState         `json:"state"`
	Questions          []Question        `json:"questions"`
	CurrentQuestionIdx int               `json:"current_question_idx"`
	QuestionStartTime  time.Time         `json:"question_start_time"`
	Players            map[string]*Player `json:"players"`
	CreatedAt          time.Time         `json:"created_at"`
	FinishedAt         *time.Time        `json:"finished_at,omitempty"`
}

type ScoreBreakdown struct {
	BasePoints    int  `json:"base_points"`
	SpeedBonus    int  `json:"speed_bonus"`
	StreakMultiplier float64 `json:"streak_multiplier"`
	TotalPoints   int  `json:"total_points"`
}
