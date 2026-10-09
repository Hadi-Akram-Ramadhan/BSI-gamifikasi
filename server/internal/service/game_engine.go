package service

import (
	"fmt"
	"math"
	"sync"
	"time"

	"bsi-gamifikasi/server/internal/domain"
)

type GameEngine struct {
	mu    sync.RWMutex
	rooms map[string]*domain.Room
}

func NewGameEngine() *GameEngine {
	return &GameEngine{
		rooms: make(map[string]*domain.Room),
	}
}

// CreateRoom membuat room duel baru dengan kode unik
func (e *GameEngine) CreateRoom(code string, mode domain.GameMode, moduleID int, moduleName string, questions []domain.Question) (*domain.Room, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	if _, exists := e.rooms[code]; exists {
		return nil, domain.ErrRoomAlreadyExists
	}

	if len(questions) == 0 {
		return nil, fmt.Errorf("room harus memiliki minimal 1 soal")
	}

	room := &domain.Room{
		Code:               code,
		Mode:               mode,
		ModuleID:           moduleID,
		ModuleName:         moduleName,
		State:              domain.StateWaiting,
		Questions:          questions,
		CurrentQuestionIdx: 0,
		Players:            make(map[string]*domain.Player),
		CreatedAt:          time.Now(),
	}

	e.rooms[code] = room
	return room, nil
}

// GetRoom mengambil data room secara thread-safe (read lock)
func (e *GameEngine) GetRoom(code string) (*domain.Room, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	room, exists := e.rooms[code]
	if !exists {
		return nil, domain.ErrRoomNotFound
	}
	return room, nil
}

// JoinRoom menambahkan pemain ke dalam room
func (e *GameEngine) JoinRoom(code string, playerID string, name string, avatar string, team domain.TeamType) (*domain.Player, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	room, exists := e.rooms[code]
	if !exists {
		return nil, domain.ErrRoomNotFound
	}

	if room.State != domain.StateWaiting {
		return nil, domain.ErrGameAlreadyStarted
	}

	switch room.Mode {
	case domain.Mode1v1:
		if len(room.Players) >= 2 {
			// Periksa jika playerID adalah reconnect
			if _, isExisting := room.Players[playerID]; !isExisting {
				return nil, domain.ErrRoomFull
			}
		}
		team = domain.TeamNone
	case domain.ModeTeam:
		if team != domain.TeamGreen && team != domain.TeamOrange {
			return nil, domain.ErrInvalidTeam
		}
	}

	player := &domain.Player{
		ID:        playerID,
		Name:      name,
		Avatar:    avatar,
		Team:      team,
		Score:     0,
		Streak:    0,
		MaxStreak: 0,
		Answers:   make([]domain.PlayerAnswer, 0),
		IsReady:   true,
	}

	room.Players[playerID] = player
	return player, nil
}

// StartGame memulai permainan jika syarat pemain terpenuhi
func (e *GameEngine) StartGame(code string) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	room, exists := e.rooms[code]
	if !exists {
		return domain.ErrRoomNotFound
	}

	if room.State != domain.StateWaiting {
		return domain.ErrGameAlreadyStarted
	}

	if room.Mode == domain.Mode1v1 && len(room.Players) < 2 {
		return fmt.Errorf("mode 1v1 membutuhkan minimal 2 pemain")
	}

	if room.Mode == domain.ModeTeam {
		hasGreen := false
		hasOrange := false
		for _, p := range room.Players {
			if p.Team == domain.TeamGreen {
				hasGreen = true
			}
			if p.Team == domain.TeamOrange {
				hasOrange = true
			}
		}
		if !hasGreen || !hasOrange {
			return fmt.Errorf("mode tim membutuhkan minimal 1 pemain di Tim Hijau dan 1 di Tim Oranye")
		}
	}

	room.State = domain.StateInProgress
	room.CurrentQuestionIdx = 0
	room.QuestionStartTime = time.Now()
	return nil
}

// SubmitAnswer memproses jawaban pemain, menghitung skor, streak, dan bonus kecepatan
func (e *GameEngine) SubmitAnswer(code string, playerID string, optionKey domain.OptionKey, answerTime time.Time) (*domain.PlayerAnswer, *domain.Room, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	room, exists := e.rooms[code]
	if !exists {
		return nil, nil, domain.ErrRoomNotFound
	}

	if room.State != domain.StateInProgress {
		return nil, nil, domain.ErrGameNotStarted
	}

	if room.CurrentQuestionIdx >= len(room.Questions) {
		return nil, nil, domain.ErrGameOver
	}

	player, exists := room.Players[playerID]
	if !exists {
		return nil, nil, domain.ErrPlayerNotFound
	}

	currentQ := room.Questions[room.CurrentQuestionIdx]

	// Cek apakah pemain sudah menjawab soal ini
	for _, ans := range player.Answers {
		if ans.QuestionID == currentQ.ID {
			return nil, nil, domain.ErrPlayerAlreadyAnswered
		}
	}

	// Hitung waktu respon
	responseTimeMs := max(0, answerTime.Sub(room.QuestionStartTime).Milliseconds())

	isCorrect := (optionKey == currentQ.CorrectOption)
	pointsEarned := 0

	if isCorrect {
		basePoints := 100
		speedBonus := 0

		// Bonus kecepatan: jika menjawab dalam separuh pertama batas waktu
		timeLimitMs := int64(currentQ.TimeLimitSeconds * 1000)
		if responseTimeMs <= timeLimitMs/2 {
			speedBonus = 20
		}

		player.Streak++
		player.MaxStreak = max(player.MaxStreak, player.Streak)

		// Multiplier streak
		var multiplier float64 = 1.0
		if player.Streak == 2 {
			multiplier = 1.2
		} else if player.Streak >= 3 {
			multiplier = 1.5 // Sultan mode
		}

		rawPoints := float64(basePoints+speedBonus) * multiplier
		pointsEarned = int(math.Round(rawPoints))
	} else {
		// Reset streak jika salah (anti-minus points untuk psikologis anak SD)
		player.Streak = 0
		pointsEarned = 0
	}

	player.Score += pointsEarned

	record := domain.PlayerAnswer{
		QuestionID:     currentQ.ID,
		SelectedKey:    optionKey,
		IsCorrect:      isCorrect,
		PointsEarned:   pointsEarned,
		AnsweredAt:     answerTime,
		ResponseTimeMs: responseTimeMs,
	}

	player.Answers = append(player.Answers, record)
	return &record, room, nil
}

// NextQuestion memajukan ke soal berikutnya atau menyelesaikan permainan
func (e *GameEngine) NextQuestion(code string) (*domain.Room, bool, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	room, exists := e.rooms[code]
	if !exists {
		return nil, false, domain.ErrRoomNotFound
	}

	if room.State != domain.StateInProgress {
		return nil, false, domain.ErrGameNotStarted
	}

	room.CurrentQuestionIdx++
	if room.CurrentQuestionIdx >= len(room.Questions) {
		room.State = domain.StateFinished
		now := time.Now()
		room.FinishedAt = &now
		return room, true, nil // isGameOver = true
	}

	room.QuestionStartTime = time.Now()
	return room, false, nil // isGameOver = false
}

// GetTeamScores menghitung total skor per tim
func (e *GameEngine) GetTeamScores(room *domain.Room) (int, int) {
	greenScore := 0
	orangeScore := 0

	for _, p := range room.Players {
		switch p.Team {
		case domain.TeamGreen:
			greenScore += p.Score
		case domain.TeamOrange:
			orangeScore += p.Score
		}
	}

	return greenScore, orangeScore
}
