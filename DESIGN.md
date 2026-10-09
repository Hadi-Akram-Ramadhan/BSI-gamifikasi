---
name: BSI Sahabat Kecil - Duel Cerdas Design System
version: 1.1.0
format: designmd-alpha
author: Hadi & Tim BSI SYLS 2026
tags: [gamified, fintech-syariah, educational, smart-tv, playful, kids-friendly, accessible, antislop-certified]
antislop-dials:
  energy: 3
  rhythm: 2
  motion: 2
colors:
  primary:
    bsi-teal: "#00A39E"
    bsi-teal-dark: "#007D79"
    bsi-teal-deep: "#0B3835"
    bsi-teal-light: "#E0F5F4"
    bsi-teal-soft: "#F0FAF9"
  secondary:
    bsi-gold: "#F39C12"
    bsi-gold-hover: "#D68910"
    bsi-gold-light: "#FEF9E7"
    bsi-gold-glow: "#FAD7A0"
  team:
    green-team: "#10B981"
    green-team-dark: "#059669"
    green-team-light: "#D1FAE5"
    orange-team: "#F97316"
    orange-team-dark: "#EA580C"
    orange-team-light: "#FFEDD5"
  state:
    success: "#22C55E"
    error: "#EF4444"
    warning: "#F59E0B"
    info: "#3B82F6"
  background:
    canvas: "#F4FBF9"
    card: "#FFFFFF"
    elevated: "#FFFFFF"
    overlay: "rgba(11, 56, 53, 0.70)"
  text:
    heading: "#0B3835"
    body: "#1E293B"
    muted: "#475569"
    inverted: "#FFFFFF"
    gold-contrast: "#0B3835"
typography:
  font-family-display: "Fredoka, 'Plus Jakarta Sans', system-ui, sans-serif"
  font-family-body: "'Plus Jakarta Sans', system-ui, sans-serif"
  scale:
    tv-hero:
      fontSize: "52px"
      lineHeight: "1.15"
      fontWeight: "800"
    tv-title:
      fontSize: "40px"
      lineHeight: "1.2"
      fontWeight: "700"
    tv-body:
      fontSize: "24px"
      lineHeight: "1.4"
      fontWeight: "600"
    h1:
      fontSize: "32px"
      lineHeight: "1.25"
      fontWeight: "800"
    h2:
      fontSize: "24px"
      lineHeight: "1.3"
      fontWeight: "700"
    h3:
      fontSize: "20px"
      lineHeight: "1.4"
      fontWeight: "600"
    body-lg:
      fontSize: "18px"
      lineHeight: "1.5"
      fontWeight: "500"
    body-md:
      fontSize: "16px"
      lineHeight: "1.5"
      fontWeight: "400"
    body-sm:
      fontSize: "14px"
      lineHeight: "1.4"
      fontWeight: "500"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
shapes:
  radius-xs: "6px"
  radius-sm: "12px"
  radius-md: "18px"
  radius-lg: "28px"
  radius-pill: "9999px"
elevation:
  card: "0 10px 25px -5px rgba(0, 163, 158, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
  card-interactive: "0 14px 30px -5px rgba(0, 163, 158, 0.15), 0 10px 12px -5px rgba(0, 0, 0, 0.05)"
  button-3d-teal: "0 6px 0px #005E5B, 0 12px 18px rgba(0, 94, 91, 0.25)"
  button-3d-gold: "0 6px 0px #B7791F, 0 12px 18px rgba(183, 121, 31, 0.30)"
  modal: "0 25px 50px -12px rgba(11, 56, 53, 0.40)"
components:
  card-quiz:
    backgroundColor: "{colors.background.card}"
    borderRadius: "{shapes.radius-lg}"
    padding: "{spacing.xl}"
    border: "3px solid {colors.primary.bsi-teal-light}"
  button-action:
    fontFamily: "{typography.font-family-display}"
    borderRadius: "{shapes.radius-pill}"
    padding: "16px 36px"
    fontWeight: "700"
---

# BSI Sahabat Kecil: Duel Cerdas Design System

Spec-compliant design system markdown for AI-native Next.js & Smart TV game UI development.
Standardized according to [designmd.ai](https://designmd.ai/) Google Stitch specification and hardened against `/antislop:antislop` guidelines.

---

## 1. Overview & Anti-Slop Design Philosophy

### 1.1 The Visual Persona
**"Joyful, Islamic Modern, and Heroic Indonesian Childhood."**
Antarmuka menggabungkan kredibilitas resmi **Bank Syariah Indonesia (BSI)** dengan keceriaan panggung game show edukatif di ruang kelas sekolah dasar. 

Bukan website korporat kaku, bukan aplikasi Web3 gelap, dan bukan template generik AI yang penuh efek kaca transparan tak bertujuan.

### 1.2 Anti-Slop Dials Declaration
* **ENERGY: 3 (Bold / Playful Game Show)**
  * *Alasan:* Layar utama adalah Smart TV 55-65 inci yang ditonton 30 murid dari jarak 3 sampai 5 meter. Membutuhkan kontras warna tinggi, tipografi ekstra tebal, dan tombol taktil 3D tegas.
* **RHYTHM: 2 (Structured Arena with Duel Breaks)**
  * *Alasan:* Layout kuis harus teratur dan konsisten agar siswa tidak bingung saat membaca soal hitungan keuangan dalam waktu 15 detik, dengan jeda visual dramatis saat layar versus dan penyerahan piala.
* **MOTION: 2 (Purposeful Micro-Interactions)**
  * *Alasan:* Gerakan hanya terjadi saat ada aksi nyata (angka skor bergulir, tombol amblas ditekan, denting koin emas). Dilarang partikel debu mengambang liar yang membebani browser Smart TV.

### 1.3 Pembantaian Aset AI Slop (Cultural & Aesthetic Fix)
* **Pembersihan Celengan Babi:** Dilarang keras menggunakan ikon atau ilustrasi celengan babi pada Modul 3 (Menabung) karena bertentangan dengan konteks syariah dan siswa madrasah/SD muslim.
* **Pengganti Otentik:** Menggunakan celengan kaleng seng barakah, kantong tali serut koin dinar emas, dan replika fisik kompartemen binder Saku Barakah.
* **Bebas Em Dash:** Dilarang menggunakan karakter em dash di seluruh antarmuka. Pemisah teks menggunakan tanda titik dua, tanda kurung, atau koma.
* **Bebas Buzzword AI:** Dilarang menuliskan label "AI-Powered", "Next-Gen", atau "Seamless".

---

## 2. Color Palette Tokens & Contrast Rules (WCAG AA Strict)

### 2.1 Brand Identity & Primaries
* **BSI Teal (`#00A39E`):** Pondasi visual amanah dan pertumbuhan syariah.
* **BSI Teal Dark (`#007D79`):** Latar tombol dengan teks putih (rasio kontras 4.99:1, lolos WCAG AA).
* **BSI Teal Deep (`#0B3835`):** Teks heading utama dan teks kontras di atas tombol kuning (rasio kontras 5.87:1, lolos WCAG AA).
* **BSI Teal Soft (`#F0FAF9`):** Latar belakang card modul dan badge.
* **BSI Gold (`#F39C12`):** Aksen energi, koin reward, dan tombol aksi utama.
  * *Aturan Kritis Kontras:* Teks di atas warna BSI Gold **wajib memakai `#0B3835` (BSI Teal Deep)**. Dilarang teks putih di atas kuning karena gagal kontras (2.19:1).

### 2.2 Duel Team Distinction
* **Tim Hijau (BSI Green):**
  * Utama: `#10B981` | Bevel 3D: `#059669` | Badge Soft: `#D1FAE5`
* **Tim Oranye (Maslahat Orange):**
  * Utama: `#F97316` | Bevel 3D: `#EA580C` | Badge Soft: `#FFEDD5`

---

## 3. Typography Scale & Readability Guidelines

### 3.1 Font Family Pairing
* **Display / Game Show Font:** `Fredoka` (Google Fonts) — Tebal, membulat, ramah anak, dan terbaca tajam dari jarak 5 meter di Smart TV.
* **Body / Content Font:** `Plus Jakarta Sans` (Google Fonts) — Modern, proporsional, dan nyaman dibaca untuk pemahaman materi literasi keuangan.

### 3.2 Type Scale

| Token | Ukuran | Line Height | Weight | Penggunaan Utama |
| :--- | :--- | :--- | :--- | :--- |
| `tv-hero` | 52px | 1.15 | 800 | Headline Utama Smart TV, Countdown Timer, Papan Skor Duel |
| `tv-title` | 40px | 1.2 | 700 | Pertanyaan Kuis di Smart TV, Banner Kemenangan |
| `tv-body` | 24px | 1.4 | 600 | Teks Opsi Jawaban di Smart TV |
| `h1` | 32px | 1.25 | 800 | Judul Halaman di HP / Tablet Siswa |
| `h2` | 24px | 1.3 | 700 | Header Modul Kurikulum & Card Kategori |
| `body-lg` | 18px | 1.5 | 500 | Teks Soal di Layar Siswa (Mobile View) |
| `body-md` | 16px | 1.5 | 400 | Penjelasan Materi & Refleksi Keuangan |

---

## 4. Dual-Screen Ergonomics (Smart TV vs Mobile Pad)

```
┌─────────────────────────────────────────────────────────────┐
│          SMART TV (10-FOOT HOST ARENA / SPECTATOR)           │
│  • Resolusi 1920x1080 Landscape                             │
│  • Teks soal 40px, Split-Screen Tim Hijau vs Tim Oranye     │
│  • Timer Melingkar di Bagian Tengah Atas                    │
└─────────────────────────────────────────────────────────────┘
                               ▲
                       Sinkronisasi WebSocket
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  MOBILE BUZZER PAD (TIM A)   │ │  MOBILE BUZZER PAD (TIM B)   │
│  • Thumb-Zone 4 Tombol       │ │  • Thumb-Zone 4 Tombol       │
│  • Tombol Ekstra Besar (>72px│ │  • Tombol Ekstra Besar (>72px│
│  • Simbol: ▲, ■, ●, ★        │ │  • Simbol: ▲, ■, ●, ★        │
└──────────────────────────────┘ └──────────────────────────────┘
```

1. **Smart TV Classroom View:**
   * Ditonton 30 murid secara bersamaan.
   * Format split-screen: Tim Hijau (Kiri: 45%) vs Indikator VS & Timer (Tengah: 10%) vs Tim Oranye (Kanan: 45%).
   * Tanpa interaksi sentuh mouse; menerima update real-time via WebSocket.
2. **Mobile Controller View:**
   * Dipegang siswa di baris meja kelas.
   * Tidak menampilkan teks soal panjang agar fokus anak tidak terpecah.
   * Menampilkan 4 tombol geometri raksasa ramah jempol (*Thumb-Zone*) dengan kode bentuk untuk siswa buta warna:
     * ▲ Tombol Biru (`#3B82F6`)
     * ■ Tombol Hijau (`#10B981`)
     * ● Tombol Oranye (`#F97316`)
     * ★ Tombol Ungu (`#8B5CF6`)

---

## 5. Component Specifications & Micro-Interactions

### 5.1 Tactile 3D Buttons (`button-buzzer`)
Tombol menggunakan ketebalan bayangan padat tanpa blur untuk sensasi bel fisik:

```css
.btn-buzzer-teal {
  background-color: #007D79;
  color: #FFFFFF;
  border-radius: 20px;
  border: 2px solid #005E5B;
  box-shadow: 0 6px 0px #005E5B, 0 10px 14px rgba(0, 94, 91, 0.25);
  font-family: 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  touch-action: manipulation;
  transition: transform 0.05s ease-out, box-shadow 0.05s ease-out;
}
.btn-buzzer-teal:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0px #005E5B, 0 4px 6px rgba(0, 94, 91, 0.2);
}
```

### 5.2 Sound Engine Berbasis Web Audio API (Zero Asset Download)
Menghindari kegagalan audio akibat koneksi Wi-Fi lambat di sekolah dengan generator audio prosedural sintetis:
* **Pop Klik:** Gelombang sinus menurun 600Hz ke 180Hz (durasi 0.06 detik).
* **Denting Koin Emas Barakah:** Harmoni segitiga ganda pada frekuensi 987.77Hz dan 1318.51Hz.
* **Sentuhan Kurang Tepat:** Nada kartun lembut 260Hz ke 130Hz yang ramah anak (bukan suara buzzer bising).
* **Detik Kritis Timer:** Nada persegi 880Hz berdetak di 5 detik terakhir.

---

## 6. Copywriting & Tone of Voice

| Situasi | Kalimat Terpilih (Otentik & Ramah Anak) | Catatan Desain |
| :--- | :--- | :--- |
| **Lobby Masuk** | Ayo kawan-kawan, scan kode QR di Smart TV dan siapkan jurus hematmu! | Akrab dan menyalakan semangat kebersamaan. |
| **Jawaban Tepat** | Alhamdulillah, Tepat Sekali! Koin Barakah +100 untuk timmu! | Mengaitkan prestasi dengan nilai syukur. |
| **Jawaban Keliru** | Hampir tepat! Ingat ya: Dahulukan kebutuhan pokok sebelum jajan mainan. | Mendidik tanpa menjatuhkan semangat anak. |
| **Combo Berturut** | Masya Allah! Kombo 3x Beruntun! Tim Hijau Makin Tak Terbendung! | Kompetisi positif dan sportif. |
| **Panggung Juara** | Kalian Luar Biasa! Hari ini kita belajar jadi pahlawan keuangan yang amanah. | Penanaman karakter jangka panjang. |

---

## 7. Delivery Gate Verification Summary

* [x] **R-02 (Copywriting):** Nol karakter em dash di seluruh antarmuka.
* [x] **R-04 (Icons):** Celengan babi dibasmi total; diganti kantong koin syariah dan celengan kaleng barakah.
* [x] **R-08 (Buttons):** Tanpa panah panah dekoratif generik; tombol menggunakan label tindakan langsung.
* [x] **R-10 (Glassmorphism):** Dihapus dari komponen utama untuk menjaga ketajaman baca di Smart TV.
* [x] **R-15 & R-16 (CTA & Buzzwords):** Bebas dari istilah AI marketing kosong.
* [x] **R-21 & R-25 (Theme & Contrast):** Light mode kelas siang hari dengan kontras teks memenuhi standar WCAG AA.
* [x] **R-29 (Color Palette):** Terbatas pada 2 warna brand inti (BSI Teal `#00A39E`, BSI Gold `#F39C12`) + 2 warna tim (Hijau `#10B981`, Oranye `#F97316`).
* [x] **R-31 (Every Decision Has a Reason):** Setiap token warna, bentuk tombol, dan tipografi memiliki tujuan fungsional tertulis.
