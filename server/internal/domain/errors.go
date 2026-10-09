package domain

import "errors"

var (
	ErrRoomNotFound         = errors.New("room tidak ditemukan")
	ErrRoomAlreadyExists     = errors.New("kode room sudah digunakan")
	ErrRoomFull             = errors.New("room sudah penuh")
	ErrGameAlreadyStarted   = errors.New("permainan sudah dimulai")
	ErrGameNotStarted       = errors.New("permainan belum dimulai")
	ErrGameOver             = errors.New("permainan sudah selesai")
	ErrPlayerNotFound       = errors.New("pemain tidak ditemukan dalam room")
	ErrPlayerAlreadyAnswered = errors.New("pemain sudah menjawab soal ini")
	ErrInvalidQuestionIndex = errors.New("indeks soal tidak valid")
	ErrInvalidTeam          = errors.New("tim tidak valid, pilih Tim Hijau atau Tim Oranye")
)
