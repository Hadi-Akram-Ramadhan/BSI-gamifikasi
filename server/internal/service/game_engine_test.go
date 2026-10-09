package service_test

import (
	"fmt"
	"sync"
	"testing"
	"time"

	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/service"
)

func sampleQuestions() []domain.Question {
	return []domain.Question{
		{
			ID:               "q1",
			ModuleID:         1,
			QuestionText:     "Punya uang Rp10.000, beli buku Rp3.500. Berapa uang kembalianmu?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Rp6.500"},
				{Key: domain.OptionB, Text: "Rp7.000"},
				{Key: domain.OptionC, Text: "Rp5.500"},
				{Key: domain.OptionD, Text: "Rp6.000"},
			},
			CorrectOption:    domain.OptionA,
			TimeLimitSeconds: 15,
			Explanation:      "Rp10.000 dikurangi Rp3.500 sama dengan Rp6.500.",
		},
		{
			ID:               "q2",
			ModuleID:         2,
			QuestionText:     "Uang sakumu tinggal Rp15.000. Mana yang wajib didahulukan?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Membeli mainan viral"},
				{Key: domain.OptionB, Text: "Membeli buku tulis sekolah"},
				{Key: domain.OptionC, Text: "Membeli stiker hiasan"},
				{Key: domain.OptionD, Text: "Beli kuota game online"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "Buku tulis adalah kebutuhan pokok (hajat), sedangkan mainan adalah keinginan (syahwat).",
		},
	}
}

func TestCreateRoom(t *testing.T) {
	engine := service.NewGameEngine()
	questions := sampleQuestions()

	// 1. Sukses buat room
	room, err := engine.CreateRoom("BSI123", domain.Mode1v1, 1, "Kenali Uang", questions)
	if err != nil {
		t.Fatalf("Gagal membuat room: %v", err)
	}
	if room.Code != "BSI123" || room.State != domain.StateWaiting {
		t.Errorf("Kondisi room tidak sesuai: %+v", room)
	}

	// 2. Cegah duplikasi kode room
	_, err = engine.CreateRoom("BSI123", domain.Mode1v1, 1, "Kenali Uang", questions)
	if err != domain.ErrRoomAlreadyExists {
		t.Errorf("Ekspektasi ErrRoomAlreadyExists, dapat: %v", err)
	}

	// 3. Cegah room tanpa soal
	_, err = engine.CreateRoom("EMPTY", domain.Mode1v1, 1, "Kenali Uang", []domain.Question{})
	if err == nil {
		t.Errorf("Ekspektasi error saat membuat room tanpa soal")
	}
}

func TestJoinRoom_1v1(t *testing.T) {
	engine := service.NewGameEngine()
	_, _ = engine.CreateRoom("DUEL01", domain.Mode1v1, 1, "Kenali Uang", sampleQuestions())

	// Pemain 1 join
	p1, err := engine.JoinRoom("DUEL01", "user-1", "Ahmad", "avatar1", domain.TeamNone)
	if err != nil {
		t.Fatalf("Pemain 1 gagal join: %v", err)
	}
	if p1.Name != "Ahmad" {
		t.Errorf("Nama pemain 1 salah: %s", p1.Name)
	}

	// Pemain 2 join
	_, err = engine.JoinRoom("DUEL01", "user-2", "Siti", "avatar2", domain.TeamNone)
	if err != nil {
		t.Fatalf("Pemain 2 gagal join: %v", err)
	}

	// Pemain 3 join -> Tolak karena Mode 1v1 maksimal 2 pemain
	_, err = engine.JoinRoom("DUEL01", "user-3", "Budi", "avatar3", domain.TeamNone)
	if err != domain.ErrRoomFull {
		t.Errorf("Ekspektasi ErrRoomFull untuk pemain ke-3 di mode 1v1, dapat: %v", err)
	}
}

func TestJoinRoom_TeamMode(t *testing.T) {
	engine := service.NewGameEngine()
	_, _ = engine.CreateRoom("TEAM01", domain.ModeTeam, 1, "Kenali Uang", sampleQuestions())

	// Join Tim Hijau
	p1, err := engine.JoinRoom("TEAM01", "u1", "Ahmad", "avatar1", domain.TeamGreen)
	if err != nil || p1.Team != domain.TeamGreen {
		t.Fatalf("Gagal join Tim Hijau: %v", err)
	}

	// Join Tim Oranye
	p2, err := engine.JoinRoom("TEAM01", "u2", "Fajar", "avatar2", domain.TeamOrange)
	if err != nil || p2.Team != domain.TeamOrange {
		t.Fatalf("Gagal join Tim Oranye: %v", err)
	}

	// Join Tim Invalid
	_, err = engine.JoinRoom("TEAM01", "u3", "Budi", "avatar3", domain.TeamNone)
	if err != domain.ErrInvalidTeam {
		t.Errorf("Ekspektasi ErrInvalidTeam, dapat: %v", err)
	}
}

func TestStartGame(t *testing.T) {
	engine := service.NewGameEngine()
	_, _ = engine.CreateRoom("START01", domain.Mode1v1, 1, "Kenali Uang", sampleQuestions())

	// Start saat belum cukup pemain
	err := engine.StartGame("START01")
	if err == nil {
		t.Errorf("Ekspektasi error start game saat pemain < 2 di 1v1")
	}

	_, _ = engine.JoinRoom("START01", "p1", "Ahmad", "av1", domain.TeamNone)
	_, _ = engine.JoinRoom("START01", "p2", "Siti", "av2", domain.TeamNone)

	// Start sukses
	err = engine.StartGame("START01")
	if err != nil {
		t.Fatalf("Gagal memulai permainan: %v", err)
	}

	room, _ := engine.GetRoom("START01")
	if room.State != domain.StateInProgress {
		t.Errorf("State room harus in_progress, dapat: %s", room.State)
	}
}

func TestSubmitAnswer_ScoringStreakAndSpeedBonus(t *testing.T) {
	engine := service.NewGameEngine()
	_, _ = engine.CreateRoom("SCORE01", domain.Mode1v1, 1, "Kenali Uang", sampleQuestions())
	_, _ = engine.JoinRoom("SCORE01", "p1", "Ahmad", "av1", domain.TeamNone)
	_, _ = engine.JoinRoom("SCORE01", "p2", "Siti", "av2", domain.TeamNone)
	_ = engine.StartGame("SCORE01")

	room, _ := engine.GetRoom("SCORE01")
	startTime := room.QuestionStartTime

	// Soal 1: Ahmad jawab benar super cepat (2 detik dari 15 detik batas waktu)
	// Base: 100 + Speed Bonus: 20 = 120 poin. Streak = 1 (Multiplier 1.0) -> 120 poin
	ans1, _, err := engine.SubmitAnswer("SCORE01", "p1", domain.OptionA, startTime.Add(2*time.Second))
	if err != nil {
		t.Fatalf("Gagal submit jawaban: %v", err)
	}
	if !ans1.IsCorrect || ans1.PointsEarned != 120 {
		t.Errorf("Ekspektasi benar dengan 120 poin (100 + 20 speed bonus), dapat: %d", ans1.PointsEarned)
	}

	// Cegah jawab ulang soal yang sama
	_, _, err = engine.SubmitAnswer("SCORE01", "p1", domain.OptionA, startTime.Add(3*time.Second))
	if err != domain.ErrPlayerAlreadyAnswered {
		t.Errorf("Ekspektasi ErrPlayerAlreadyAnswered, dapat: %v", err)
	}

	// Pindah ke Soal 2
	_, isOver, err := engine.NextQuestion("SCORE01")
	if err != nil || isOver {
		t.Fatalf("NextQuestion gagal: %v", err)
	}

	room, _ = engine.GetRoom("SCORE01")
	startTimeQ2 := room.QuestionStartTime

	// Soal 2: Ahmad jawab benar lagi tapi agak lambat (10 detik, no speed bonus)
	// Base: 100. Streak = 2 (Multiplier 1.2x) -> 100 * 1.2 = 120 poin. Total score: 120 + 120 = 240
	ans2, _, err := engine.SubmitAnswer("SCORE01", "p1", domain.OptionB, startTimeQ2.Add(10*time.Second))
	if err != nil {
		t.Fatalf("Gagal submit jawaban Q2: %v", err)
	}
	if !ans2.IsCorrect || ans2.PointsEarned != 120 {
		t.Errorf("Ekspektasi 120 poin (Streak 2x multiplier 1.2), dapat: %d", ans2.PointsEarned)
	}

	p1 := room.Players["p1"]
	if p1.Score != 240 {
		t.Errorf("Ekspektasi total skor 240, dapat: %d", p1.Score)
	}
	if p1.Streak != 2 {
		t.Errorf("Ekspektasi streak 2, dapat: %d", p1.Streak)
	}
}

func TestGameOverCycle(t *testing.T) {
	engine := service.NewGameEngine()
	_, _ = engine.CreateRoom("CYCLE01", domain.Mode1v1, 1, "Kenali Uang", sampleQuestions())
	_, _ = engine.JoinRoom("CYCLE01", "p1", "Ahmad", "av1", domain.TeamNone)
	_, _ = engine.JoinRoom("CYCLE01", "p2", "Siti", "av2", domain.TeamNone)
	_ = engine.StartGame("CYCLE01")

	// Next ke soal 2
	_, isOver, _ := engine.NextQuestion("CYCLE01")
	if isOver {
		t.Errorf("Belum game over di soal ke-2")
	}

	// Next setelah soal 2 -> Game Over!
	room, isOver, err := engine.NextQuestion("CYCLE01")
	if err != nil {
		t.Fatalf("Error saat menyelesaikan game: %v", err)
	}
	if !isOver {
		t.Errorf("Harusnya sudah game over setelah melewati soal terakhir")
	}
	if room.State != domain.StateFinished || room.FinishedAt == nil {
		t.Errorf("State room harus finished dan memiliki timestamp FinishedAt")
	}
}

func TestConcurrentAccess_ThreadSafe(t *testing.T) {
	// Stress test untuk mensimulasikan ratusan request serentak tanpa race condition
	engine := service.NewGameEngine()
	roomCode := "CONCURRENT_ROOM"
	_, _ = engine.CreateRoom(roomCode, domain.ModeTeam, 1, "Kenali Uang", sampleQuestions())

	var wg sync.WaitGroup
	numPlayers := 50

	// 50 pemain join serentak
	for i := range numPlayers {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			team := domain.TeamGreen
			if idx%2 == 1 {
				team = domain.TeamOrange
			}
			playerID := fmt.Sprintf("player-%d", idx)
			_, _ = engine.JoinRoom(roomCode, playerID, fmt.Sprintf("Anak-%d", idx), "avatar", team)
		}(i)
	}
	wg.Wait()

	room, _ := engine.GetRoom(roomCode)
	if len(room.Players) != numPlayers {
		t.Fatalf("Ekspektasi %d pemain berhasil join secara konkruen, dapat: %d", numPlayers, len(room.Players))
	}

	_ = engine.StartGame(roomCode)
	startTime := time.Now()

	// 50 pemain submit jawaban serentak di milidetik yang sama
	for i := range numPlayers {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			playerID := fmt.Sprintf("player-%d", idx)
			opt := domain.OptionA
			if idx%3 == 0 {
				opt = domain.OptionB
			}
			_, _, _ = engine.SubmitAnswer(roomCode, playerID, opt, startTime.Add(time.Duration(idx*10)*time.Millisecond))
		}(i)
	}
	wg.Wait()

	greenScore, orangeScore := engine.GetTeamScores(room)
	if greenScore == 0 && orangeScore == 0 {
		t.Errorf("Skor tim tidak boleh kosong setelah submit konkruen")
	}
}
