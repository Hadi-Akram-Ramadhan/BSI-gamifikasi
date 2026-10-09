package repository_test

import (
	"testing"

	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/repository"
)

func TestQuestionRepository_SeedAndFetch(t *testing.T) {
	repo := repository.NewQuestionRepository()

	// Modul 1
	qList, err := repo.GetQuestionsByModule(1, 0)
	if err != nil {
		t.Fatalf("Gagal mengambil soal modul 1: %v", err)
	}
	if len(qList) < 2 {
		t.Errorf("Ekspektasi minimal 2 soal di modul 1, dapat: %d", len(qList))
	}

	// Cek struktur soal & opsi
	for _, q := range qList {
		if q.QuestionText == "" {
			t.Errorf("QuestionText tidak boleh kosong: %+v", q)
		}
		if len(q.Options) != 4 {
			t.Errorf("Opsi soal harus 4 butir (A, B, C, D), dapat: %d", len(q.Options))
		}
		if q.CorrectOption != domain.OptionA && q.CorrectOption != domain.OptionB &&
			q.CorrectOption != domain.OptionC && q.CorrectOption != domain.OptionD {
			t.Errorf("CorrectOption tidak valid: %s", q.CorrectOption)
		}
		if q.TimeLimitSeconds <= 0 {
			t.Errorf("TimeLimitSeconds harus positif, dapat: %d", q.TimeLimitSeconds)
		}
	}

	// Limit test
	limited, err := repo.GetQuestionsByModule(1, 1)
	if err != nil {
		t.Fatalf("Gagal mengambil soal dengan limit: %v", err)
	}
	if len(limited) != 1 {
		t.Errorf("Ekspektasi 1 soal saat limit 1, dapat: %d", len(limited))
	}

	// Modul tidak ditemukan
	_, err = repo.GetQuestionsByModule(999, 0)
	if err == nil {
		t.Errorf("Ekspektasi error untuk modul yang tidak ada")
	}
}
