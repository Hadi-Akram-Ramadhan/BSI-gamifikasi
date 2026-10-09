package httpadapter_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	httpadapter "bsi-gamifikasi/server/internal/adapters/http"
	"bsi-gamifikasi/server/internal/adapters/ws"
	"bsi-gamifikasi/server/internal/domain"
	"bsi-gamifikasi/server/internal/repository"
	"bsi-gamifikasi/server/internal/service"
)

func setupTestServer() (*http.ServeMux, *httpadapter.Handler) {
	engine := service.NewGameEngine()
	repo := repository.NewQuestionRepository()
	hub := ws.NewHub(engine)
	go hub.Run()

	h := httpadapter.NewHandler(engine, repo, hub)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	return mux, h
}

func TestHealthCheck(t *testing.T) {
	mux, _ := setupTestServer()

	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Ekspektasi status 200, dapat: %d", rr.Code)
	}

	var res map[string]any
	if err := json.Unmarshal(rr.Body.Bytes(), &res); err != nil {
		t.Fatalf("Gagal unmarshal response: %v", err)
	}

	if res["status"] != "ok" {
		t.Errorf("Ekspektasi status ok, dapat: %v", res["status"])
	}
}

func TestGetModules(t *testing.T) {
	mux, _ := setupTestServer()

	req := httptest.NewRequest(http.MethodGet, "/api/modules", nil)
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Ekspektasi status 200, dapat: %d", rr.Code)
	}

	var modules []httpadapter.ModuleInfo
	if err := json.Unmarshal(rr.Body.Bytes(), &modules); err != nil {
		t.Fatalf("Gagal unmarshal modules: %v", err)
	}

	if len(modules) != 8 {
		t.Errorf("Ekspektasi 8 modul literasi, dapat: %d", len(modules))
	}
}

func TestCreateAndGetRoom(t *testing.T) {
	mux, _ := setupTestServer()

	// 1. Create Room
	body, _ := json.Marshal(httpadapter.CreateRoomRequest{
		Mode:          domain.Mode1v1,
		ModuleID:      1,
		QuestionCount: 2,
	})

	req := httptest.NewRequest(http.MethodPost, "/api/rooms", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("Ekspektasi status 201 Created, dapat: %d, body: %s", rr.Code, rr.Body.String())
	}

	var createdRoom domain.Room
	if err := json.Unmarshal(rr.Body.Bytes(), &createdRoom); err != nil {
		t.Fatalf("Gagal unmarshal room: %v", err)
	}

	if createdRoom.Code == "" || createdRoom.Mode != domain.Mode1v1 {
		t.Errorf("Data room tidak valid: %+v", createdRoom)
	}

	// 2. Get Room
	getReq := httptest.NewRequest(http.MethodGet, "/api/rooms/"+createdRoom.Code, nil)
	getRr := httptest.NewRecorder()
	mux.ServeHTTP(getRr, getReq)

	if getRr.Code != http.StatusOK {
		t.Fatalf("Ekspektasi status 200 saat get room, dapat: %d", getRr.Code)
	}

	var fetchedRoom domain.Room
	_ = json.Unmarshal(getRr.Body.Bytes(), &fetchedRoom)
	if fetchedRoom.Code != createdRoom.Code {
		t.Errorf("Kode room fetched (%s) != created (%s)", fetchedRoom.Code, createdRoom.Code)
	}
}
