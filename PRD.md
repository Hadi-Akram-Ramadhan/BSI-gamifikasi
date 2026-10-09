# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Project: SAHABAT KECIL BSI — "Duel Cerdas: Jago Atur Uang"
### Inisiatif: Phygital Financial Literacy Ecosystem for Islamic Elementary Education
**Kompetisi:** Sharia Young Leader Summit (SYLS) 2026 — PT Bank Syariah Indonesia (Persero) Tbk & BSI Maslahat  
**Regional:** Regional 4 (Jawa Timur, Jember Target Pilot)  
**Dokumen Versi:** 1.0.0 (Final Draft for Implementation)

---

## 1. Executive Summary & Problem Context

### 1.1 Latar Belakang Masalah
1. **Rendahnya Indeks Literasi Keuangan Syariah Usia Dini:**
   Meskipun Indonesia memiliki populasi muslim terbesar di dunia, indeks literasi keuangan syariah nasional masih berada di kisaran ~9-11% (OJK). Anak usia sekolah dasar (SD kelas 4-6) di daerah seperti Jember umumnya belum diajarkan membedakan kebutuhan (*hajat*) vs keinginan (*syahwat*), konsep uang berkah, atau bahaya perilaku konsumtif dan pinjol/judi online terselubung di game mobile.
2. **Keterbatasan Metode Edukasi Konvensional:**
   Pendidikan keuangan saat ini masih berbasis ceramah membosankan atau buku teks kaku tanpa *habit-building* nyata dan tanpa keterikatan emosional.
3. **Underutilized Smart TV di Kelas Sekolah Dasar:**
   Banyak sekolah dasar mitra (SD di Jember dan Jawa Timur) telah memiliki fasilitas Smart TV di ruang kelas, namun perangkat ini hanya digunakan pasif (memutar video ceramah YouTube).

### 1.2 Solusi Inovatif: Pendekatan Phygital (Physical + Digital)
Projek ini memadukan dua pilar terintegrasi:
- **Komponen Fisik (Offline Habit):** **Smart Workbook "Saku Barakah"** berpenjilid binder yang memiliki kantong plastik kompartemen tabungan harian (target tabungan Rp100.000 dengan milestone harian Rp2.000) yang dibagi menjadi: *Saku Kebutuhan*, *Saku Impian*, dan *Saku Sedekah*. Setiap bab materi dilengkapi **Dynamic QR Code**.
- **Komponen Digital (Classroom Gamification):** Web App **"Duel Cerdas: Jago Atur Uang"** yang dimainkan di Smart TV kelas dan mobile browser. Siswa melakukan scan QR dari workbook untuk bertanding cerdas cermat 1v1 atau Tim vs Tim dengan visual ceria, animasi koin, dan countdown seru.
- **Penyelarasan 3 Nilai Beyond Banking BSI:**
  - *Sahabat Finansial:* Manajemen uang saku, tabungan terencana, literasi Bank Syariah & Tabungan SimPel BSI iB.
  - *Sahabat Sosial:* Menumbuhkan kepedulian berbagi melalui infak dan sedekah Jum'at.
  - *Sahabat Spiritual:* Menanamkan adab harta halal, barakah, dan sifat qana'ah.

---

## 2. Target Pengguna & Personas

| Persona | Peran | Kebutuhan Utama | Touchpoint |
| :--- | :--- | :--- | :--- |
| **Ahmad (10 th, Siswa SD Kelas 4)** | Pemain / Learner | Suka game interaktif, visual warna-warni, pengen nabung beli tas sekolah, suka kompetisi beregu. | Smart TV kelas, Smartphone via QR Workbook, Buku Saku Barakah. |
| **Ibu Fatimah (Guru Wali Kelas)** | Fasilitator / Host | Butuh media ajar interaktif yang gampang disetel di Smart TV kelas (<2 menit), gamifikasi otomatis, evaluasi nilai siswa. | Laptop / Browser Smart TV (`/tv/[roomCode]`), Dashboard Guru. |
| **Dewan Juri BSI / BSI Maslahat** | Evaluator Program | Menilai dampak sosial nyata (*impact metrics*), orisinalitas, kelayakan implementasi di lapangan, dan keberlanjutan. | Presentation Deck, Live Demo Duel, Laporan Metrik SROI. |

---

## 3. Kurikulum & Modul Literasi Finansial Syariah (8 Modul)

| Modul | Kategori | Fokus Pembelajaran | Contoh Tantangan Kuis / Soal |
| :---: | :--- | :--- | :--- |
| **1** | Dasar | **Kenali Uang dan Nilainya:** Mengenal uang kertas dan logam rupiah, pecahan nominal, serta cara menghitung belanja & uang kembalian. | "Punya uang Rp10.000, beli buku tulis Rp3.500. Berapa uang kembalian yang harus kamu terima?" |
| **2** | Dasar | **Kebutuhan vs Keinginan:** Membedakan kebutuhan pokok (*dharuriyyat*) dengan keinginan impulsif (*tahsiniyyat*). | "Uang saku tinggal Rp15.000. Kamu butuh pensil gambar tapi ingin beli mainan viral. Mana yang wajib didahulukan?" |
| **3** | Dasar | **Menabung dan Dana Impian:** Manfaat menabung, target waktu realistis, kebiasaan menyisihkan uang di awal bukan sisa. | "Ingin beli tas sekolah Rp60.000. Jika menabung Rp5.000 setiap hari di kantong binder, berapa hari target tercapai?" |
| **4** | Finansial Islami | **Berbagi dengan Bijak (ZISWAF):** Mengenal infak, sedekah, dan zakat; melatih empati dan keyakinan bahwa harta tidak berkurang karena sedekah. | "Dari uang saku mingguan Rp20.000, bagaimana cara bijak membaginya untuk jajan, tabungan, dan infak Jum'at?" |
| **5** | Penerapan | **Rencana Keuangan dan Target:** Menyusun anggaran mingguan sederhana, mencatat pemasukan & pengeluaran. | "Uang sakumu Rp50.000 seminggu. Buat rencana alokasi prioritas 50-30-20 versi ramah anak." |
| **6** | Penerapan | **Belanja Cerdas dan Anti-Boros:** Membandingkan harga per kuantitas, memeriksa tanggal kedaluwarsa, tidak mudah tergiur diskon semu. | "Toko A jual 3 pensil Rp6.000. Toko B jual 1 pensil Rp2.500. Toko mana yang lebih hemat per batang pensil?" |
| **7** | Finansial Islami | **Mengenal Bank Syariah dan BSI:** Fungsi bank, tabungan wadiah/mudharabah ramah anak, Tabungan SimPel BSI iB, kartu ATM. | "Apa beda menabung di bawah kasur dengan menabung di Bank Syariah Indonesia (BSI)?" |
| **8** | Penting | **Keamanan Uang & Literasi Digital:** Menjaga kerahasiaan PIN/password, waspada phishing, keamanan transaksi digital. | "Seseorang di game online meminta PIN rekening orang tuamu dengan iming-iming top-up gratis. Apa tindakanmu?" |

---

## 4. Mekanisme Gamifikasi & Fitur Inti

### 4.1 Mode Permainan
1. **Mode 1 vs 1 (Duel Kilat Individu):**
   - Dua siswa bertanding langsung (bisa maju ke Smart TV layar sentuh atau memakai 2 tablet/HP).
   - Durasi: 10 soal acak, 15-30 detik per soal.
   - Poin dinamis: Kecepatan menjawab + Akurasi + Combo Streak (x1.2, x1.5).
2. **Mode Tim vs Tim (Duel Antar Kelompok Kelas):**
   - Kelas dibagi menjadi **Tim Hijau (BSI)** vs **Tim Oranye (Maslahat)**.
   - Smart TV menampilkan papan pertandingan split-screen (Total Skor Tim Hijau vs Tim Oranye).
   - Siswa bergantian menjawab per giliran atau submit bersamaan dengan poin agregat tim.
3. **Smart TV Classroom View (`/tv/[roomCode]`):**
   - Layar proyektor/TV menampilkan host screen: QR Code gabung room, avatar pemain, countdown audio-visual, live progress bar, confetti, dan panggung juara.

### 4.2 Sistem Reward & Level
- **XP & Level Progression:** Level 1 (Penjelajah Koin) hingga Level 10 (Sultan Barakah BSI).
- **Lencana Karakter (Badges):**
  - 🏅 *Ahli Uang:* Sempurna di Modul 1 & 2.
  - 🐖 *Pintar Menabung:* Menyelesaikan target tabungan di Workbook fisik + kuis Modul 3.
  - ❤️ *Pahlawan Sedekah:* Rutin mengisi Saku Infaq dan tuntas Modul 4.
  - 🛡️ *Penjaga Rahasia:* Nilai 100 di modul keamanan digital.

---

## 5. Non-Functional Requirements & Standar Reliabilitas (1.000 CCU)

### 5.1 Concurrency & Latency Target
- **Target Concurrency:** 1.000 Concurrent Connected Users (CCU) tanpa degradasi performa di server 2 vCPU / 4GB RAM.
- **WebSocket Broadcast Latency:** Sub-20ms dari aksi siswa di HP ke pembaruan skor di layar Smart TV kelas.
- **HTTP Response Time:** p95 < 80ms untuk REST API queries.

### 5.2 Anti-Error 503 & 403 Strategy
1. **Pencegahan Error 503 (Service Unavailable):**
   - *In-Memory Active Game State:* Seluruh kalkulasi duel dan room state disimpan di RAM (Go Memory Struct dengan `sync.RWMutex` / Redis 7).
   - *PostgreSQL Write-Behind Batching:* Database SQL tidak disentuh saat kuis berjalan. Hasil pertandingan di-flush secara asinkron dalam batch setelah pertandingan selesai.
   - *Connection Limits Tuning:* Nginx `worker_connections 4096;`, Linux OS `nofile 65535;`, database connection pool (`pgxpool`) dibatasi pada 25 koneksi persisten.
2. **Pencegahan Error 403 (Forbidden & False Rate-Limiting):**
   - *Session Token-Bucket Rate Limiter:* Rate limiting diterapkan berbasis `RoomSessionToken`, **BUKAN IP Publik**. Hal ini krusial karena 1000 siswa di sekolah terhubung melalui 1 NAT Public IP WiFi sekolah yang sama.
   - *Permissive Handshake Origin Validator:* Header WebSocket Upgrader mengizinkan origin terdaftar termasuk browser bawaan Smart TV (Tizen OS / WebOS).

---

## 6. Social Impact Metrics & Pengukuran SROI (BSI SYLS Evaluation)

Untuk memenuhi kriteria booklet SYLS (Keberlanjutan & Community Engagement):
1. **Peningkatan Literasi Finansial (N-Gain Score):**
   - Dilakukan Pre-Test (sebelum modul) dan Post-Test (setelah workbook & duel game selesai).
   - Target: Peningkatan pemahaman minimal **45% (N-Gain > 0.4)**.
2. **Realisasi Tabungan Nyata (Physical Saving Habit):**
   - Target akumulasi tabungan mandiri siswa minimal Rp50.000 - Rp100.000 per anak selama program pendampingan 30 hari.
3. **Aktivasi Tabungan SimPel BSI iB:**
   - Rekening tabungan SimPel anak yang dibuka melalui kerja sama dengan kantor cabang BSI Jember setempat.
4. **SROI (Social Return on Investment):**
   - Pengukuran rasio modal hibah BSI Maslahat terhadap nilai tabungan dan dampak pencegahan perilaku konsumtif siswa.

---

## 7. Deliverables & Roadmap Lomba

- **Tahap Penyisihan (Deadline 18 Oktober 2026):**
  - Deck Social Project (PPTX & PDF) sesuai sistematika Booklet SYLS 2026.
  - Working Prototype Web App "Duel Cerdas" (Next.js + Go).
  - Mockup & Spesifikasi Fisik Workbook "Saku Barakah".
- **Tahap Semifinal (14-16 November 2026):**
  - Workshop daring & video simulasi implementasi Smart TV di kelas SD.
- **Tahap Grand Final Jakarta (12-14 Desember 2026):**
  - Sharia Camp, Live Pitching & Interactive Demonstration di depan juri BSI Maslahat.
