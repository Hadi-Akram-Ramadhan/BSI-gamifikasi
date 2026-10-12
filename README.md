# Duel Cerdas — Jago Atur Uang

Prototipe interaktif literasi finansial untuk kelas 4–6 SD. Dibangun dengan Next.js 16.4 App Router, TypeScript, Tailwind CSS, Motion, Lucide, Radix Dialog, dan ilustrasi SVG orisinal Koini. Semua identitas, poin, dan tabungan adalah data simulasi.

## Menjalankan

```powershell
npm install
npm run dev
```

Buka alamat yang ditampilkan terminal. Pada sesi pengembangan ini server yang sudah ada menggunakan **http://localhost:3001**. Preview build produksi tersedia di **http://127.0.0.1:3002** selama proses preview berjalan.

```powershell
npm run lint
npx tsc --noEmit
npm run build
npm start
```

## Demo 5 menit

1. Buka `/`, pilih **Mulai Petualangan** → dunia **Kebutuhan & Keinginan**.
2. Selesaikan cerita, jawab aktivitas, lalu lanjut kuis. Kuis berisi 8 soal dengan pembahasan. Penyelesaian pertama memberi 50 XP dan 3 bintang; mengulang tetap diperbolehkan.
3. Buka **Tabunganku**. Klik **Catat Tabungan +Rp2.000**. Jumlah berubah dari Rp14.000 menjadi Rp16.000 dan tetap tersimpan setelah refresh.
4. Buka `/duel`, pilih **Duel Tim**. Buat room dengan cara menjawab **Guru memilih jawaban tim**.
5. Di `/guru/game/[code]`, klik **Isi Pemain Demo**, lalu **Buka Smart TV**. TV terbuka pada tab kedua di `/tv/[code]`.
6. Klik **Mulai Pertandingan** pada kontrol guru. Setelah hitung mundur, pilih A/B/C/D untuk Tim Hijau dan Tim Oranye. Jawaban benar menambah 100 poin. Jawaban salah atau kosong mendapat 0 poin.
7. Buka pertanyaan berikutnya sampai **Lihat Hasil**. TV mengikuti perpindahan lobby → arena → hasil. **Jeda** menghentikan timer soal dan pertandingan; **Lanjutkan permainan** memulihkannya.
8. Lihat papan juara, pembahasan, atau pilih **Main Lagi**.

## Dua pemain / dua tim digital

Buat room dengan **Pemain menjawab di tab sendiri**. Buka `/join?code=KODE` pada dua tab dalam browser yang sama. Isi nama panggilan, pilih sisi Hijau pada tab pertama dan Oranye pada tab kedua. Mulai lewat kontrol guru. Untuk demo cepat, **Isi Pemain Demo** lalu gunakan tautan **Buka tab Tim Hijau/Oranye** di kontrol guru.

- Guru: `/guru/game/[code]`
- TV lobby: `/tv/[code]`
- TV arena: `/tv/[code]/arena`
- Hasil: `/tv/[code]/hasil`
- Pemain Hijau: `/play/[code]?team=0`
- Pemain Oranye: `/play/[code]?team=1`

**Gunakan origin yang sama persis**, termasuk protokol, hostname, dan port. `localhost:3001` berbeda dari `127.0.0.1:3001`. BroadcastChannel dan storage events menyinkronkan tab dalam profil browser yang sama; tidak menyambungkan laptop dan ponsel yang terpisah. QR hanyalah tautan ke halaman. Tidak ada backend realtime atau autentikasi produksi.

## Halaman dan cakupan

| Halaman                                                         | Implementasi                                                                     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `/`                                                             | Hero pulau Koini, profil ringkas, enam dunia, misi, pilihan duel                 |
| `/materi` atau `/belajar`                                       | Enam dunia terbuka dengan progres dan bintang                                    |
| `/materi/[slug]`                                                | Intro, penjelasan, contoh, aktivitas, hadiah, tautan kuis                        |
| `/kuis/[slug]`                                                  | 8 soal per topik, 48 total, penilaian dan pembahasan                             |
| `/mini-games` dan `/mini-games/[slug]`                          | Hitung Koin, Kebutuhan/Keinginan (drag atau tap), Menabung, Misi Berbagi         |
| `/tabunganku`                                                   | Deposit simulasi, 50 kotak progres, riwayat, ubah target                         |
| `/profil`, `/pencapaian`                                        | Nama panggilan, avatar, XP, bintang, lencana, reset dengan konfirmasi            |
| `/leaderboard`                                                  | Profil kelas contoh dan hasil duel lokal                                         |
| `/duel`, `/guru/game/buat`, `/join`                             | Pilihan mode, pengaturan room, bergabung                                         |
| `/tv/[code]`, `/play/[code]`, `/guru/game/[code]`               | Lobby, timer, skor, jawaban, jeda, pembahasan, hasil dan replay                  |
| `/workbook`                                                     | QR untuk enam materi dan tautan langsung                                         |
| `/guru/dashboard`, `/guru/kelas`, `/guru/laporan`, `/guru/soal` | Ringkasan demo, pemilihan kelas, progres profil, filter dan pembahasan bank soal |
| `/admin`                                                        | Ikhtisar materi, jumlah soal, dan bank soal yang dapat difilter                  |
| `/tentang`                                                      | Penjelasan produk, pendampingan, dan privasi demo                                |

Slug materi: `kenal-uang`, `kebutuhan-keinginan`, `menabung`, `berbagi`, `rencana-target`, `refleksi`.

**Selesai:** alur inti belajar → latihan → kuis → duel → hasil; empat mini-game; tabungan; profil; reward; sinkronisasi demo antar-tab; QR dan tampilan pendamping.

**Parsial:** pengelolaan kelas dan admin merupakan tampilan demo yang dapat dinavigasi dan difilter, belum CRUD. Laporan menampilkan progres profil lokal dan riwayat pertandingan, belum analitik kelas/pre-test/post-test. Audio baru menyediakan pratinjau nada opt-in, belum paket efek suara permainan. Maskot memiliki delapan varian, tetapi tidak semua varian dipakai di setiap alur. XP menggunakan notifikasi dan progres; belum animasi koin terbang ke header.

**Belum diimplementasikan / di luar fase:** multiplayer antarperangkat, akun, database, integrasi bank, transaksi uang, validasi workbook fisik, mini-game opsional Belanja Cerdas dan Petualangan Refleksi.

## Arsitektur

- `src/data/content.ts`: enam materi dan 48 pertanyaan bertipe.
- `src/lib/store.ts`: state profil, tabungan, reward dan room; persistensi `localStorage`; BroadcastChannel dengan fallback storage event; Web Locks menserialkan jawaban bersamaan pada browser yang mendukungnya.
- State permainan: `waiting → countdown → question → reveal → question / finished`, dengan `paused` untuk jeda. Deadline berupa timestamp absolut; skor dihitung oleh logika bersama, tidak diambil dari nilai yang dikirim pemain.
- `src/components/art.tsx`: `Mascot`, `TopicArt`, `AdventureArt`; SVG lokal tanpa layanan gambar eksternal.
- Komponen reusable: `Logo`, `Shell`, `Progress`, `TopicCard`, `DuelCards`, `Answers`, `PageHeading`, `RewardScreen`, `Confetti`, `RewardFeedback`, `Modal`, serta scoreboard/lobby/controller.
- `src/app/[...path]/page.tsx`: pemetaan route server ke pengalaman klien, menggunakan async params dan Suspense sesuai Next.js yang terpasang.
- React `useSyncExternalStore` menyediakan snapshot server yang stabil; API browser tidak diakses saat SSR.
- Lima lencana dan satu materi selesai merupakan seed untuk presentasi. XP awal 2.350 berarti level 5 dengan progres 350/500. Reset di profil mengembalikan seed.

State browser bukan batas keamanan; peserta yang mengubah developer tools dapat mengubah data demo. Integrasi layanan nyata kelak perlu memindahkan validasi, otoritas skor, dan persistensi ke server.

## Verifikasi dan bukti UI

Pengujian terperinci: [QA.md](QA.md).

```powershell
$env:DEMO_URL='http://localhost:3001'
node scripts/test-demo.mjs
node scripts/test-accessibility.mjs
node scripts/test-polish.mjs
npx ui-evidence doctor --config ui-evidence/config.yaml --ready
npx ui-evidence snapshot --config ui-evidence/config.yaml --stage primary-flow --label current
```

Capture memakai browser context terisolasi. Hook `ui-evidence/hooks/seed.mjs` hanya memasukkan data deterministik ke context pengujian. Tidak mengubah profil browser pengguna.

Review produksi: `ui-evidence/screenshots/snapshots/20261012-150106--verified-production/review/index.html`. Screenshot, overview, manifest, dan laporan tersedia di folder snapshot. Ukuran yang diperiksa: 360, 390×844, 768×1024, 1440×900, 1280×720, dan 1920×1080.

Audit dependensi produksi tidak melaporkan kerentanan saat pemeriksaan. Audit lengkap masih melaporkan 7 temuan high pada rantai alat pengembangan ESLint dan ui-evidence/sharp; rekomendasi otomatis mencakup downgrade besar Next lint, sehingga tidak diterapkan secara paksa. Lihat `ui-evidence/npm-audit*.json`.
