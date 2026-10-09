package repository

import (
	"fmt"
	"math/rand"
	"time"

	"bsi-gamifikasi/server/internal/domain"
)

type QuestionRepository struct {
	modules map[int][]domain.Question
}

func NewQuestionRepository() *QuestionRepository {
	repo := &QuestionRepository{
		modules: make(map[int][]domain.Question),
	}
	repo.seedQuestions()
	return repo
}

func (r *QuestionRepository) seedQuestions() {
	// Modul 1: Kenali Uang dan Nilainya
	r.modules[1] = []domain.Question{
		{
			ID:               "m1_q1",
			ModuleID:         1,
			QuestionText:     "Kamu punya uang Rp10.000 dan membeli buku tulis seharga Rp3.500. Berapa uang kembalianmu?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Rp6.500"},
				{Key: domain.OptionB, Text: "Rp7.000"},
				{Key: domain.OptionC, Text: "Rp5.500"},
				{Key: domain.OptionD, Text: "Rp6.000"},
			},
			CorrectOption:    domain.OptionA,
			TimeLimitSeconds: 15,
			Explanation:      "Uang Rp10.000 dikurangi harga buku Rp3.500 menghasilkan uang kembalian Rp6.500.",
		},
		{
			ID:               "m1_q2",
			ModuleID:         1,
			QuestionText:     "Pecahan uang kertas rupiah resmi yang memiliki nominal paling kecil saat ini adalah ...",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Rp500"},
				{Key: domain.OptionB, Text: "Rp1.000"},
				{Key: domain.OptionC, Text: "Rp2.000"},
				{Key: domain.OptionD, Text: "Rp5.000"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "Uang kertas rupiah dengan nominal terkecil emisi Bank Indonesia saat ini adalah Rp1.000.",
		},
	}

	// Modul 2: Kebutuhan vs Keinginan
	r.modules[2] = []domain.Question{
		{
			ID:               "m2_q1",
			ModuleID:         2,
			QuestionText:     "Uang sakumu tersisa Rp15.000. Pensilmu hilang untuk ujian besok, tetapi kamu juga ingin beli mainan viral. Mana yang wajib kamu dahulukan?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Membeli mainan viral mumpung ada teman"},
				{Key: domain.OptionB, Text: "Membeli pensil baru untuk ujian"},
				{Key: domain.OptionC, Text: "Menghabiskan uang untuk jajan es krim"},
				{Key: domain.OptionD, Text: "Meminjam uang teman untuk beli keduanya"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "Pensil untuk ujian adalah kebutuhan pokok (hajat/dharuriyyat) yang harus didahulukan dari keinginan (syahwat).",
		},
		{
			ID:               "m2_q2",
			ModuleID:         2,
			QuestionText:     "Dalam prinsip keuangan syariah, hal yang harus kita utamakan sebelum membelanjakan harta adalah ...",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Mengikuti tren terbaru teman sekelas"},
				{Key: domain.OptionB, Text: "Membeli barang diskon sebanyak-banyaknya"},
				{Key: domain.OptionC, Text: "Memenuhi kebutuhan pokok yang bermanfaat dan halal"},
				{Key: domain.OptionD, Text: "Memamerkan barang mahal di media sosial"},
			},
			CorrectOption:    domain.OptionC,
			TimeLimitSeconds: 15,
			Explanation:      "Syariah mengajarkan sifat qana'ah dan mendahulukan kebutuhan yang halal serta bermanfaat.",
		},
	}

	// Modul 3: Menabung dan Dana Impian
	r.modules[3] = []domain.Question{
		{
			ID:               "m3_q1",
			ModuleID:         3,
			QuestionText:     "Kamu ingin membeli tas sekolah seharga Rp60.000. Jika kamu menabung Rp5.000 setiap hari di Saku Impian, berapa hari targetmu tercapai?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "10 hari"},
				{Key: domain.OptionB, Text: "12 hari"},
				{Key: domain.OptionC, Text: "15 hari"},
				{Key: domain.OptionD, Text: "20 hari"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "Rp60.000 dibagi tabungan harian Rp5.000 menghasilkan waktu 12 hari.",
		},
		{
			ID:               "m3_q2",
			ModuleID:         3,
			QuestionText:     "Kapan waktu terbaik untuk menyisihkan uang tabungan dari uang saku?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Di awal saat baru menerima uang saku"},
				{Key: domain.OptionB, Text: "Hanya jika ada sisa belanja jajan"},
				{Key: domain.OptionC, Text: "Saat sudah ingin membeli mainan saja"},
				{Key: domain.OptionD, Text: "Ketika disuruh oleh teman sekelas"},
			},
			CorrectOption:    domain.OptionA,
			TimeLimitSeconds: 15,
			Explanation:      "Menabung yang efektif dilakukan dengan menyisihkan uang di awal, bukan menunggu sisa jajan.",
		},
	}

	// Modul 4: Berbagi dengan Bijak (ZISWAF)
	r.modules[4] = []domain.Question{
		{
			ID:               "m4_q1",
			ModuleID:         4,
			QuestionText:     "Rasulullah SAW mengajarkan bahwa sedekah dan infak tidak akan ...",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Menambah pahala kita"},
				{Key: domain.OptionB, Text: "Mengurangi harta yang berkah"},
				{Key: domain.OptionC, Text: "Membantu orang yang membutuhkan"},
				{Key: domain.OptionD, Text: "Menumbuhkan rasa empati"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "Hadits Nabi menegaskan bahwa sedekah tidak akan mengurangi harta, melainkan menambah keberkahan.",
		},
	}

	// Modul 7: Mengenal Bank Syariah dan BSI
	r.modules[7] = []domain.Question{
		{
			ID:               "m7_q1",
			ModuleID:         7,
			QuestionText:     "Salah satu produk tabungan resmi Bank Syariah Indonesia (BSI) khusus untuk pelajar adalah ...",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Tabungan SimPel (Simpanan Pelajar) BSI iB"},
				{Key: domain.OptionB, Text: "Tabungan Korporasi Bisnis"},
				{Key: domain.OptionC, Text: "Deposito Luar Negeri"},
				{Key: domain.OptionD, Text: "Kartu Kredit Belanja"},
			},
			CorrectOption:    domain.OptionA,
			TimeLimitSeconds: 15,
			Explanation:      "Tabungan SimPel (Simpanan Pelajar) BSI iB adalah produk tabungan BSI dengan persyaratan mudah untuk siswa.",
		},
	}

	// Modul 8: Keamanan Uang dan Literasi Finansial Digital
	r.modules[8] = []domain.Question{
		{
			ID:               "m8_q1",
			ModuleID:         8,
			QuestionText:     "Seseorang di game online meminta nomor PIN rekening orang tuamu dengan janji memberi koin gratis. Apa yang wajib kamu lakukan?",
			Options: []domain.Option{
				{Key: domain.OptionA, Text: "Memberikan PIN karena ingin dapat koin"},
				{Key: domain.OptionB, Text: "Menolak tegas dan segera melapor ke orang tua/guru"},
				{Key: domain.OptionC, Text: "Membagikan PIN tersebut ke teman sekelas"},
				{Key: domain.OptionD, Text: "Mencoba memberikan PIN yang salah"},
			},
			CorrectOption:    domain.OptionB,
			TimeLimitSeconds: 15,
			Explanation:      "PIN dan OTP adalah rahasia pribadi yang tidak boleh dibagikan kepada siapapun untuk mencegah penipuan.",
		},
	}
}

// GetQuestionsByModule mengambil soal berdasarkan modul dengan opsi pengacakan
func (r *QuestionRepository) GetQuestionsByModule(moduleID int, limit int) ([]domain.Question, error) {
	questions, exists := r.modules[moduleID]
	if !exists || len(questions) == 0 {
		return nil, fmt.Errorf("modul %d tidak memiliki butir soal", moduleID)
	}

	// Buat salinan agar tidak memodifikasi slice internal
	shuffled := make([]domain.Question, len(questions))
	copy(shuffled, questions)

	// Acak soal
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	rng.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})

	if limit > 0 && limit < len(shuffled) {
		return shuffled[:limit], nil
	}
	return shuffled, nil
}
