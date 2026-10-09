# AGENTS.md — Agent & Engineering Guidelines
## Project: SAHABAT KECIL BSI — "Duel Cerdas: Jago Atur Uang"
### Inisiatif: Phygital Financial Literacy Ecosystem for Islamic Elementary Education
**Target Kompetisi:** Sharia Young Leader Summit (SYLS) 2026 — PT Bank Syariah Indonesia (Persero) Tbk & BSI Maslahat  
**Owner:** Hadi Akram Ramadhan (Call him: Hadi)

---

## 1. Golden Rules for All Agents (Mandatory)

1. **JANGAN ASAL COMMIT / PUSH / MERGE KE GIT:**
   - Dilarang keras melakukan `git commit`, `git push`, atau `git merge` secara otomatis tanpa konfirmasi eksplisit dari Hadi.
   - Semua perubahan kode harus diverifikasi secara lokal terlebih dahulu.
2. **Kapasitas 1.000 Concurrent Users (CCU) Tanpa Beban Server:**
   - Setiap endpoint, websocket handler, dan alur database wajib dirancang kuat menampung 1.000 koneksi serentak pada spesifikasi server hemat (2 vCPU / 4GB RAM).
   - Bebas dari error 503 (Service Unavailable) dan error 403 (Forbidden).
3. **Clean Code & Unit Testing Wajib:**
   - Setiap fitur atau fungsi non-trivial yang dibuat WAJIB disertai unit test.
   - Dilarang menggunakan fungsi `refreshdatabase` di testing tanpa konfirmasi ke Hadi.
   - File testing sementara wajib dihapus setelah verifikasi selesai (kecuali unit test permanen).
4. **Fokus Bertahap (Satu Fitur Selesai & Teruji Sebelum Pindah):**
   - Kerjakan fitur satu per satu secara tuntas, verifikasi, baru lanjut ke fitur berikutnya.
5. **Debat Arsitektur via Subagent:**
   - Bila ada keputusan teknologi, arsitektur, atau trade-off kompleks: jangan berdebat dengan Hadi.
   - Bertindaklah sebagai moderator independen, dispatch subagents di background untuk berdebat, dan sajikan sintesis terbaik yang matang ke Hadi.

---

## 2. Arsitektur Sistem & Tech Stack

Sistem menggunakan pola **"Dual-Engine Pragmatis"**:

```
[ Siswa HP (Buzzer Pad) ]     [ Smart TV Kelas (Host 1080p) ]     [ Guru / Juri ]
            │                               │                            │
            └───────────────────────────────┼────────────────────────────┘
                                            │
                                ┌───────────┴───────────┐
                                │      Nginx Proxy      │
                                └───────────┬───────────┘
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                ▼                                                       ▼
      ┌───────────────────┐                                   ┌───────────────────┐
      │   GO GAME ENGINE  │ (Port :8080)                      │ NEXT.JS APP (WEB) │ (Port :3000)
      │ - Realtime WS Hub │                                   │ - Smart TV Screen │
      │ - In-Memory State │                                   │ - Player Pad (HP) │
      │ - Room Duel 1v1/Tim│                                  │ - Audio Synth SFX │
      └─────────┬─────────┘                                   │ - Bank Soal Table │
                │                                             └───────────────────┘
        ┌───────┴─────────────────┐
        ▼                         ▼
┌───────────────┐        ┌───────────────────┐
│    REDIS 7    │        │   POSTGRESQL 16   │
│ - Live Score  │        │ - Bank Soal 8 Modul│
│ - Pub/Sub Hub │        │ - Batch Score Save│
└───────────────┘        └───────────────────┘
```

### 2.1 Backend Engine (Folder `server/` - Go 1.22+)
* **Framework:** Go standard library + Router ringan (`chi` atau `fiber`) + `gorilla/websocket`.
* **State Management:** In-memory Go Struct dengan `sync.RWMutex` per room untuk kecepatan sub-5ms dan RAM hemat (<35MB pada 1.000 CCU).
* **Database Persistensi:** PostgreSQL 16 via `pgxpool` (Max 25 koneksi).
* **Aturan I/O:** Database SQL hanya disentuh 2 kali per pertandingan (load 10 soal di awal, dan *write-behind batch insert* saat game over).
* **Anti-503:** Buffered channels worker pool untuk menampung lonjakan submit jawaban.
* **Anti-403:** Token-bucket rate limiting dihitung **per session token / room ID**, bukan per IP publik (karena seluruh murid sekolah berbagi 1 IP publik via Wi-Fi sekolah).

### 2.2 Frontend Display (Folder `web/` - Next.js 14/15 App Router)
* **Framework:** Next.js (TypeScript, Tailwind CSS, Framer Motion).
* **Tiga Tampilan Utama:**
  1. `/tv/[roomCode]` — Tampilan Smart TV kelas (1080p landscape split screen Tim Hijau vs Tim Oranye).
  2. `/play/[roomCode]` — Tampilan mobile buzzer pad siswa (4 tombol raksasa geometri kontras tinggi).
  3. `/` & `/modul` — Portal kurikulum 8 modul dan aktivasi workbook fisik.

---

## 3. Standar Desain & Anti-Slop (R-01 s/d R-38)

Semua agen wajib mematuhi aturan ketat dalam `DESIGN.md` dan filter `/antislop:antislop`:

### 3.1 Dials Resmi
* **ENERGY: 3 (Bold / Playful Game Show)**
* **RHYTHM: 2 (Structured Arena with Duel Breaks)**
* **MOTION: 2 (Purposeful Micro-Interactions)**

### 3.2 Larangan Keras (Anti-Slop Hard Gates)
1. **Dilarang Em Dash (`—`):** Semua teks copy wajib menggunakan tanda titik dua `:`, tanda kurung `()`, atau koma `,`.
2. **Dilarang Ikon Celengan Babi:** Modul 3 (Menabung) wajib menggunakan ikon celengan kaleng barakah, kantong tali serut koin dinar, atau visual kompartemen binder Saku Barakah.
3. **Dilarang Teks Putih di Atas BSI Gold:** Seluruh elemen berlatar belakang `#F39C12` (BSI Gold) wajib menggunakan teks berwarna **`#0B3835` (BSI Deep Teal)** agar memenuhi rasio kontras WCAG AA (5.87:1).
4. **Dilarang Dark Mode Cyberpunk:** Gunakan tema *Daylight Classroom* (Canvas sejuk mint-putih `#F4FBF9`, kartu putih salju) agar terbaca jelas di bawah pencahayaan kelas sekolah dasar.
5. **Dilarang Buzzword Kosong:** Bebas dari istilah "AI-Powered", "Next-Gen", "Revolutionary", atau tombol generik "Get Started".
6. **Procedural Web Audio API:** Gunakan synthesizer Web Audio API bawaan browser (<1KB kode) untuk efek suara pop klik, denting koin, dan detak timer. Dilarang mengunduh file aset MP3 berat yang rentan gagal di jaringan Wi-Fi sekolah.

---

## 4. Kurikulum Literasi Finansial Syariah (8 Modul)

Setiap agen yang memanipulasi bank soal harus merujuk pada 8 modul kurikulum resmi:
1. **Kenali Uang dan Nilainya:** Mengenal pecahan rupiah, belanja cerdas, dan uang kembalian.
2. **Kebutuhan vs Keinginan:** Membedakan hajat pokok (*dharuriyyat*) dengan keinginan impulsif (*tahsiniyyat*).
3. **Menabung dan Dana Impian:** Manfaat menabung di saku binder, target realistis Rp100.000 dengan milestone Rp2.000/hari.
4. **Berbagi dengan Bijak:** Nilai infak Jum'at, sedekah, dan zakat (harta berkah tidak berkurang).
5. **Rencana Keuangan dan Target:** Budgeting 50-30-20 ramah anak untuk uang saku sekolah.
6. **Belanja Cerdas dan Anti-Boros:** Membandingkan harga satuan, cek kualitas, anti diskon semu.
7. **Mengenal Bank Syariah dan BSI:** Tabungan SimPel BSI iB, fungsi kartu ATM, dan akad wadiah.
8. **Keamanan Uang & Literasi Digital:** Menjaga kerahasiaan PIN/OTP, waspada penipuan game online.

---

## 5. Delivery Checklist Sebelum Menyatakan Tugas Selesai

Sebelum melapor ke Hadi:
- [ ] Kode bersih, modular, dan mengikuti prinsip Clean/Hexagonal Architecture.
- [ ] Unit test lulus tanpa eror.
- [ ] Tidak ada dead buttons atau link yang mengarah ke antah-berantah.
- [ ] Tidak ada em dash (`—`) di seluruh teks antarmuka.
- [ ] Kontras warna memenuhi standar WCAG AA.
- [ ] State lengkap: Empty state, Loading state, dan Graceful Reconnect state tersedia.
- [ ] Belum ada commit/push otomatis ke repositori Git.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `DESIGN.md` and `PRD.md` first, then apply `antislop.md` as the filter:
- UI / visual: `antislop-ui`
- Copy & text: `antislop-copywriting`
- People: `antislop-human`
- Mobile / responsive: `antislop-layoutmobile`
- Code comments: `antislop-code`
<!-- antislop:end -->
