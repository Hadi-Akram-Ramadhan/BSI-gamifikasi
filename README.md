# SAHABAT KECIL BSI — Duel Cerdas: Jago Atur Uang
> **Ekosistem Phygital Literasi Finansial Syariah untuk Generasi Emas Indonesia**  
> *Karya Inovasi Social Project Sharia Young Leader Summit (SYLS) 2026 — PT Bank Syariah Indonesia (Persero) Tbk & BSI Maslahat*

---

## 🌟 Tentang Inisiatif

**SAHABAT KECIL BSI** adalah program pemberdayaan literasi keuangan syariah untuk siswa Sekolah Dasar (Kelas 4–6) yang mengintegrasikan media fisik dan teknologi interaktif kelas (*Phygital Integration*). Program ini dirancang untuk menjawab rendahnya pemahaman keuangan syariah sejak dini melalui pembiasaan tabungan nyata dan kompetisi edukatif yang menyenangkan.

### Tiga Pilar Beyond Banking BSI:
1. **Sahabat Finansial:** Mengajarkan manajemen uang saku harian, skala prioritas kebutuhan vs keinginan, dan pengenalan Tabungan SimPel BSI iB.
2. **Sahabat Sosial:** Menumbuhkan empati berbagi sejak dini melalui alokasi rutin infak Jum'at dan sedekah.
3. **Sahabat Spiritual:** Menanamkan adab pengelolaan harta yang halal, berkah, dan bersyukur.

---

## 📦 Komponen Ekosistem (Phygital Architecture)

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│     KOMPONEN FISIK (OFFLINE HABIT)   │       │     KOMPONEN DIGITAL (GAMIFIKASI)    │
│  Smart Workbook "Saku Barakah"       │  QR   │  Web App "Duel Cerdas"               │
│  • Binder 3 Kantong Tabungan Mika    │ ────> │  • Tampilan Smart TV Kelas (1080p)   │
│  • Target Rp100.000 (Rp2.000/hari)   │       │  • Mobile Buzzer Pad Siswa           │
│  • Dynamic QR Code per Modul         │       │  • Mode 1v1 & Tim Hijau vs Tim Oranye│
└──────────────────────────────────────┘       └──────────────────────────────────────┘
```

1. **Smart Workbook Fisik ("Saku Barakah"):**
   * Binder berpenjilid spiral dengan 3 kompartemen kantong plastik uang: *Saku Kebutuhan*, *Saku Impian (Target Rp100k)*, dan *Saku Sedekah*.
   * Lembar tantangan harian dengan Dynamic QR Code yang terhubung langsung ke arena duel web.
2. **Web Gamifikasi Kelas ("Duel Cerdas"):**
   * **Smart TV Host Screen:** Arena pertarungan kuis cerdas cermat 1080p yang membagi kelas menjadi **Tim Hijau (BSI)** vs **Tim Oranye (Maslahat)**.
   * **Mobile Player Pad:** Pengendali cepat di HP siswa dengan 4 tombol geometri raksasa ramah jempol.
   * **Zero Audio Asset Download:** Synthesizer Web Audio API bawaan browser untuk efek suara kuis seketika tanpa membebani jaringan sekolah.

---

## 📚 Kurikulum 8 Modul Literasi Finansial Syariah

| No | Modul | Kategori | Inti Pembelajaran |
| :---: | :--- | :--- | :--- |
| 1 | **Kenali Uang dan Nilainya** | Dasar | Nilai pecahan rupiah, belanja cerdas, dan menghitung uang kembalian. |
| 2 | **Kebutuhan vs Keinginan** | Dasar | Membedakan kebutuhan mendesak (*dharuriyyat*) dengan keinginan (*tahsiniyyat*). |
| 3 | **Menabung dan Dana Impian** | Dasar | Menyisihkan uang di awal, target terukur Rp100k dengan milestone Rp2.000/hari. |
| 4 | **Berbagi dengan Bijak** | Syariah | Menumbuhkan kepedulian melalui infak Jum'at, sedekah, dan zakat. |
| 5 | **Rencana Keuangan dan Target** | Penerapan | Anggaran mingguan sederhana formula 50-30-20 versi ramah anak. |
| 6 | **Belanja Cerdas dan Anti-Boros** | Penerapan | Menghitung harga per unit, cek tanggal kedaluwarsa, menghindari diskon semu. |
| 7 | **Mengenal Bank Syariah dan BSI** | Syariah | Manfaat tabungan wadiah/mudharabah, Tabungan SimPel BSI iB, dan fungsi ATM. |
| 8 | **Keamanan Uang & Literasi Digital** | Penting | Menjaga kerahasiaan PIN/OTP, waspada penipuan game online dan phising. |

---

## 🏗️ Arsitektur Teknologi (Didesain untuk 1.000 CCU)

Aplikasi dibangun dengan arsitektur **Dual-Engine Pragmatis**:
* **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS, Framer Motion) untuk tampilan Smart TV dan mobile buzzer pad.
* **Backend:** Go 1.22+ (`gorilla/websocket`, In-Memory State Mutex, single static binary ~20MB) untuk WebSocket real-time sub-10ms.
* **Database & Caching:** Redis 7 (Live Score & Pub/Sub) + PostgreSQL 16 (Durable Data).
* **Anti-503:** In-memory game state + write-behind batch SQL insertion (database hanya diakses 2x per pertandingan).
* **Anti-403:** Token-bucket rate limiting berbasis session room, bukan per IP publik (aman untuk 1.000 siswa di 1 Wi-Fi sekolah).

---

## 🚀 Panduan Menjalankan Projek (Local Development)

### 1. Prasyarat
* Docker & Docker Compose
* Node.js v20+ & pnpm / npm
* Go v1.22+

### 2. Menjalankan Infrastruktur Database
```bash
docker compose up -d
```
Layanan PostgreSQL (port `5432`) dan Redis (port `6379`) akan berjalan di background.

### 3. Menjalankan Backend Game Engine (Go)
```bash
cd server
go run cmd/server/main.go
```
Server WebSocket & REST API akan aktif di `http://localhost:8080`.

### 4. Menjalankan Frontend Next.js
```bash
cd web
npm install
npm run dev
```
Buka browser di:
* `http://localhost:3000` — Portal Siswa & Kurikulum Modul
* `http://localhost:3000/tv/[roomCode]` — Tampilan Smart TV Kelas
* `http://localhost:3000/play/[roomCode]` — Pengendali HP Siswa (Buzzer Pad)

---

## 📄 Dokumen Spesifikasi Projek

* `PRD.md` — Product Requirement Document komprehensif, metrik SROI, dan alur kompetisi SYLS 2026.
* `DESIGN.md` — Spesifikasi token desain berstandar designmd.ai dan aturan anti-slop.
* `AGENTS.md` — Panduan operasional dan batasan teknis bagi developer dan agen AI.

---

## 👥 Tim Pengembang
* **Ketua & Fullstack Engineer:** Hadi Akram Ramadhan
* **Regional:** Perguruan Tinggi Regional 4 (Jawa Timur / Jember Target Pilot)
* **Kategori:** Social Project Competition — Sharia Young Leader Summit (SYLS) 2026
