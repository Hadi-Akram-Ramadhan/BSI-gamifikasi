package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	httpadapter "bsi-gamifikasi/server/internal/adapters/http"
	"bsi-gamifikasi/server/internal/adapters/ws"
	"bsi-gamifikasi/server/internal/repository"
	"bsi-gamifikasi/server/internal/service"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("==================================================")
	log.Println(" BSI DUEL CERDAS - REALTIME GAME ENGINE (GOLANG) ")
	log.Println(" Target: 1,000 Concurrent Users | Phygital Literacy")
	log.Println("==================================================")

	// 1. Inisialisasi Domain Service & Repository
	gameEngine := service.NewGameEngine()
	questionRepo := repository.NewQuestionRepository()

	// 2. Inisialisasi WebSocket Hub
	hub := ws.NewHub(gameEngine)
	go hub.Run()

	// 3. Inisialisasi HTTP Handler & Router
	handler := httpadapter.NewHandler(gameEngine, questionRepo, hub)
	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	// 4. Konfigurasi HTTP Server dengan Timeout Ketat (Anti-503 & Anti-Memory Leak)
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 5. Jalankan Server di Background Goroutine
	go func() {
		log.Printf("Server siap melayani di http://localhost:%s", port)
		log.Printf("WebSocket endpoint: ws://localhost:%s/ws", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server gagal berjalan: %v", err)
		}
	}()

	// 6. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Menerima sinyal shutdown, membersihkan sesi aktif...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}

	log.Println("Server berhasil dimatikan secara bersih (graceful).")
}
