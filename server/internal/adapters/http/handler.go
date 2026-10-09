package httpadapter

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"

	"bsi-gamifikasi/server/internal/adapters/ws"
	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/repository"
	"bsi-gamifikasi/server/internal/service"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Izinkan koneksi browser lokal maupun production Next.js
		return true
	},
}

type ModuleInfo struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Pillar      string `json:"pillar"`
}

type CreateRoomRequest struct {
	Mode          domain.GameMode `json:"mode"`
	ModuleID      int             `json:"module_id"`
	QuestionCount int             `json:"question_count"`
}

type Handler struct {
	engine   *service.GameEngine
	repo     *repository.QuestionRepository
	hub      *ws.Hub
	modules  []ModuleInfo
}

func NewHandler(engine *service.GameEngine, repo *repository.QuestionRepository, hub *ws.Hub) *Handler {
	return &Handler{
		engine: engine,
		repo:   repo,
		hub:    hub,
		modules: []ModuleInfo{
			{ID: 1, Title: "Kenali Uang dan Nilainya", Description: "Mengenal nominal uang rupiah dan nilai tukar barang", Icon: "coins", Pillar: "Finansial"},
			{ID: 2, Title: "Kebutuhan vs Keinginan", Description: "Membedakan hajat pokok dengan syahwat konsumtif", Icon: "balance-scale", Pillar: "Finansial"},
			{ID: 3, Title: "Menabung dan Dana Impian", Description: "Menyisihkan uang di awal untuk target masa depan", Icon: "piggy-bank", Pillar: "Finansial"},
			{ID: 4, Title: "Berbagi dengan Bijak (ZISWAF)", Description: "Keutamaan sedekah, infak, dan zakat yang berkah", Icon: "hand-heart", Pillar: "Sosial & Spiritual"},
			{ID: 5, Title: "Rencana Keuangan Sederhana", Description: "Alokasi saku barakah 50-30-20 ramah anak", Icon: "clipboard-list", Pillar: "Finansial"},
			{ID: 6, Title: "Belanja Cerdas dan Halal", Description: "Mengecek kehalalan produk dan etika jual-beli Islam", Icon: "shopping-bag", Pillar: "Spiritual"},
			{ID: 7, Title: "Mengenal Bank Syariah dan BSI", Description: "Prinsip bagi hasil tanpa riba dan Tabungan SimPel BSI", Icon: "landmark", Pillar: "Beyond Banking"},
			{ID: 8, Title: "Keamanan Digital dan Anti-Tipu", Description: "Menjaga kerahasiaan PIN/password di era digital", Icon: "shield-check", Pillar: "Finansial"},
		},
	}
}

func (h *Handler) enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	h.enableCORS(w)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"status":  "ok",
		"service": "bsi-duel-cerdas-engine",
		"version": "1.0.0",
	})
}

func (h *Handler) GetModules(w http.ResponseWriter, r *http.Request) {
	h.enableCORS(w)
	if r.Method == http.MethodOptions {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(h.modules)
}

func generateRoomCode() string {
	bytes := make([]byte, 2)
	_, _ = rand.Read(bytes)
	hexStr := hex.EncodeToString(bytes)
	return fmt.Sprintf("BSI-%s", strings.ToUpper(hexStr))
}

func (h *Handler) CreateRoom(w http.ResponseWriter, r *http.Request) {
	h.enableCORS(w)
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Metode HTTP harus POST", http.StatusMethodNotAllowed)
		return
	}

	var req CreateRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Request body tidak valid", http.StatusBadRequest)
		return
	}

	if req.ModuleID < 1 || req.ModuleID > 8 {
		http.Error(w, "ModuleID harus antara 1 sampai 8", http.StatusBadRequest)
		return
	}

	if req.Mode != domain.Mode1v1 && req.Mode != domain.ModeTeam {
		req.Mode = domain.Mode1v1
	}

	questionLimit := req.QuestionCount
	if questionLimit <= 0 {
		questionLimit = 5
	}

	questions, err := h.repo.GetQuestionsByModule(req.ModuleID, questionLimit)
	if err != nil {
		http.Error(w, fmt.Sprintf("Gagal memuat soal: %v", err), http.StatusInternalServerError)
		return
	}

	moduleTitle := fmt.Sprintf("Modul %d", req.ModuleID)
	for _, m := range h.modules {
		if m.ID == req.ModuleID {
			moduleTitle = m.Title
			break
		}
	}

	roomCode := generateRoomCode()
	room, err := h.engine.CreateRoom(roomCode, req.Mode, req.ModuleID, moduleTitle, questions)
	if err != nil {
		http.Error(w, fmt.Sprintf("Gagal membuat room: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(room)
}

func (h *Handler) GetRoom(w http.ResponseWriter, r *http.Request) {
	h.enableCORS(w)
	if r.Method == http.MethodOptions {
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 {
		http.Error(w, "Kode room tidak ditemukan dalam URL", http.StatusBadRequest)
		return
	}
	roomCode := pathParts[2]

	room, err := h.engine.GetRoom(roomCode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(room)
}

func (h *Handler) ServeWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := ws.NewClient(h.hub, conn)
	go client.WritePump()
	go client.ReadPump()
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/health", h.HealthCheck)
	mux.HandleFunc("/api/modules", h.GetModules)
	mux.HandleFunc("/api/rooms", h.CreateRoom)
	mux.HandleFunc("/api/rooms/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			h.GetRoom(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/ws", h.ServeWS)
}

// ModuleByID helper untuk mengambil detail modul
func (h *Handler) ModuleByID(id int) (ModuleInfo, bool) {
	for _, m := range h.modules {
		if m.ID == id {
			return m, true
		}
	}
	return ModuleInfo{}, false
}

// ParseIntQuery helper utilitas query param
func ParseIntQuery(r *http.Request, key string, fallback int) int {
	valStr := r.URL.Query().Get(key)
	if valStr == "" {
		return fallback
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		return fallback
	}
	return val
}
