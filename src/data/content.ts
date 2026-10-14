export type Topic = {
  slug: string;
  title: string;
  short: string;
  description: string;
  color: string;
  lesson: string;
  example: string;
  activity: string;
  choices: string[];
  answer: number;
  explanation: string;
};
export const topics: Topic[] = [
  {
    slug: "kenal-uang",
    title: "Kenal Uang & Nilainya",
    short: "Kenal Uang",
    description: "Kenali uang, temukan nilainya!",
    color: "mint",
    lesson:
      "Uang membantu kita menukar barang dan jasa. Rupiah ada yang berbentuk koin dan kertas. Nilainya ditentukan oleh angka yang tertulis, bukan ukuran atau jumlah lembarnya.",
    example:
      "Satu lembar Rp5.000 sama nilainya dengan lima keping Rp1.000. Gunakan uang dengan jujur dan bijak.",
    activity: "Berapa keping Rp1.000 yang sama dengan Rp5.000?",
    choices: ["2 keping", "5 keping", "10 keping"],
    answer: 1,
    explanation: "5 × Rp1.000 = Rp5.000. Kamu sudah bisa menukar nilai uang!",
  },
  {
    slug: "kebutuhan-keinginan",
    title: "Kebutuhan vs Keinginan",
    short: "Kebutuhan & Keinginan",
    description: "Pilih yang penting, belanja bijak!",
    color: "peach",
    lesson:
      "Kebutuhan adalah sesuatu yang diperlukan untuk hidup dan belajar. Keinginan membuat kita senang, tetapi biasanya dapat ditunda. Keduanya boleh, asalkan kebutuhan didahulukan.",
    example:
      "Buku tulismu habis. Kamu juga ingin stiker. Karena besok harus mencatat, buku tulis menjadi prioritas. Kebutuhan bisa berbeda sesuai keadaan.",
    activity: "Bukumu habis dan uangmu terbatas. Apa yang dibeli dulu?",
    choices: ["Stiker lucu", "Buku tulis", "Mainan baru"],
    answer: 1,
    explanation:
      "Buku tulis diperlukan untuk belajar. Stiker bisa ditabung untuk lain waktu.",
  },
  {
    slug: "menabung",
    title: "Menabung Itu Seru",
    short: "Menabung",
    description: "Sedikit demi sedikit, jadi bukit!",
    color: "blue",
    lesson:
      "Menabung berarti menyisihkan uang untuk nanti. Tentukan tujuan, lalu sisihkan sesuai kemampuan. Tidak harus banyak dan tidak perlu merasa bersalah jika belum bisa menabung.",
    example:
      "Untuk buku Rp20.000, kamu bisa menabung Rp2.000 sebanyak 10 kali. Catat setiap tabungan agar tahu perkembangannya.",
    activity: "Rp2.000 ditabung 5 kali. Berapa jumlahnya?",
    choices: ["Rp5.000", "Rp10.000", "Rp20.000"],
    answer: 1,
    explanation: "5 × Rp2.000 = Rp10.000. Setiap langkah kecil berarti!",
  },
  {
    slug: "berbagi",
    title: "Indahnya Berbagi",
    short: "Berbagi",
    description: "Kebaikan kecil, senyum besar!",
    color: "lavender",
    lesson:
      "Sedekah adalah kebaikan sukarela, bisa berupa uang, barang, atau bantuan. Infak berarti mengeluarkan harta untuk kebaikan. Zakat adalah kewajiban bagi Muslim yang memenuhi syarat tertentu. Pelajari bersama orang tua atau guru.",
    example:
      "Membantu teman memahami tugas juga kebaikan. Berbagilah dengan ikhlas, sesuai kemampuan, dan tanpa membuat penerima malu.",
    activity: "Teman lupa membawa pensil. Apa yang bisa kamu lakukan?",
    choices: [
      "Menertawakannya",
      "Meminjamkan pensil cadangan",
      "Memaksanya membeli",
    ],
    answer: 1,
    explanation:
      "Meminjamkan pensil dengan ramah membantu teman. Kebaikan tidak harus berupa uang.",
  },
  {
    slug: "rencana-target",
    title: "Rencana & Target",
    short: "Rencana & Target",
    description: "Mimpi besar dimulai dari rencana!",
    color: "yellow",
    lesson:
      "Rencana uang membantu memilih prioritas. Tuliskan tujuan, harga, uang yang sudah ada, dan yang bisa disisihkan. Sesuaikan rencana jika keadaan berubah.",
    example:
      "Buku Rp30.000, tabungan Rp10.000. Kamu perlu Rp20.000 lagi. Jika menabung Rp2.000 setiap kali, perlu 10 kali lagi.",
    activity: "Target Rp30.000, tabungan Rp10.000. Berapa kekurangannya?",
    choices: ["Rp40.000", "Rp20.000", "Rp10.000"],
    answer: 1,
    explanation:
      "Rp30.000 − Rp10.000 = Rp20.000. Sekarang kamu tahu langkah berikutnya.",
  },
  {
    slug: "refleksi",
    title: "Aku Makin Cerdas",
    short: "Refleksi",
    description: "Lihat langkahmu, rayakan belajarmu!",
    color: "pink",
    lesson:
      "Refleksi berarti melihat kembali keputusan kita. Apa yang sudah baik? Apa yang ingin dicoba lain kali? Kita belajar dari pengalaman tanpa menyalahkan diri sendiri.",
    example:
      "Kemarin uang buku kurang setelah membeli camilan. Lain kali, siapkan uang buku lebih dulu. Kesalahan adalah kesempatan belajar.",
    activity: "Apa yang membantu kita lebih bijak setelah belanja?",
    choices: [
      "Melupakan semua belanja",
      "Mengecek kebutuhan dan catatan uang",
      "Menyalahkan teman",
    ],
    answer: 1,
    explanation:
      "Melihat kembali keputusan membantu kita membuat rencana lebih baik.",
  },
];
export type Question = {
  id: string;
  topic: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
};
type Row = [string, string, string, string, string, string];
const banks: Row[][] = [
  [
    [
      "Dua lembar Rp2.000 sama dengan…",
      "Rp4.000",
      "Rp2.000",
      "Rp6.000",
      "Rp8.000",
      "Rp2.000 + Rp2.000 = Rp4.000.",
    ],
    [
      "Lima keping Rp1.000 sama dengan…",
      "Rp5.000",
      "Rp500",
      "Rp10.000",
      "Rp2.000",
      "5 × Rp1.000 = Rp5.000.",
    ],
    [
      "Membayar Rp10.000 untuk buku Rp7.000. Kembaliannya?",
      "Rp3.000",
      "Rp7.000",
      "Rp2.000",
      "Rp17.000",
      "Rp10.000 − Rp7.000 = Rp3.000.",
    ],
    [
      "Mana nilai uang paling besar?",
      "Rp50.000",
      "Rp5.000",
      "Rp10.000",
      "Rp20.000",
      "50.000 lebih besar dari nilai lainnya.",
    ],
    [
      "Rp5.000 ditambah Rp2.000 menjadi…",
      "Rp7.000",
      "Rp3.000",
      "Rp10.000",
      "Rp5.200",
      "5.000 + 2.000 = 7.000.",
    ],
    [
      "Sepuluh keping Rp500 bernilai…",
      "Rp5.000",
      "Rp500",
      "Rp10.000",
      "Rp1.000",
      "10 × Rp500 = Rp5.000.",
    ],
    [
      "Apa mata uang Indonesia?",
      "Rupiah",
      "Dolar",
      "Yen",
      "Ringgit",
      "Mata uang Indonesia adalah rupiah, ditulis Rp.",
    ],
    [
      "Rp20.000 dapat ditukar menjadi…",
      "Dua lembar Rp10.000",
      "Dua lembar Rp5.000",
      "Lima keping Rp1.000",
      "Satu lembar Rp2.000",
      "2 × Rp10.000 = Rp20.000.",
    ],
  ],
  [
    [
      "Buku catatanmu habis. Mana yang didahulukan?",
      "Buku tulis",
      "Stiker",
      "Mainan",
      "Permen",
      "Buku tulis diperlukan untuk mencatat pelajaran.",
    ],
    [
      "Kamu haus setelah olahraga. Pilihan utama?",
      "Air minum",
      "Gantungan kunci",
      "Komik",
      "Mainan",
      "Air memenuhi kebutuhan tubuh.",
    ],
    [
      "Sepatu masih layak, tetapi ada model baru. Model baru itu…",
      "Keinginan yang bisa ditunda",
      "Selalu kebutuhan utama",
      "Harus dibeli",
      "Lebih penting dari makan",
      "Sepatu baru bisa ditunda ketika sepatu lama layak.",
    ],
    [
      "Sebelum belanja sebaiknya kita…",
      "Membuat daftar kebutuhan",
      "Membeli semua yang lucu",
      "Menghabiskan uang",
      "Mengikuti semua iklan",
      "Daftar membantu memilih prioritas.",
    ],
    [
      "Apakah keinginan boleh dipenuhi?",
      "Boleh sesuai kemampuan setelah kebutuhan",
      "Tidak pernah",
      "Harus semuanya",
      "Dengan uang orang lain tanpa izin",
      "Perhatikan kebutuhan dan anggaran terlebih dahulu.",
    ],
    [
      "Tas satu-satunya rusak. Tas pengganti sekolah adalah…",
      "Kebutuhan",
      "Selalu kemewahan",
      "Hadiah wajib",
      "Tidak berguna",
      "Konteks penting: tas diperlukan untuk perlengkapan.",
    ],
    [
      "Iklan mainan menarik. Langkah bijak?",
      "Pertimbangkan kebutuhan dan uang",
      "Langsung membeli",
      "Memaksa orang tua",
      "Mengambil uang teman",
      "Berhenti sejenak sebelum memutuskan.",
    ],
    [
      "Uang terbatas dan belum makan siang. Pilih…",
      "Makanan bergizi",
      "Stiker tambahan",
      "Aksesori",
      "Mainan kedua",
      "Makan adalah kebutuhan tubuh.",
    ],
  ],
  [
    [
      "Menabung berarti…",
      "Menyisihkan uang untuk nanti",
      "Menghabiskan semua uang",
      "Meminjam terus",
      "Menyimpan tanpa tujuan selamanya",
      "Tabungan membantu mencapai tujuan masa depan.",
    ],
    [
      "Rp2.000 ditabung 10 kali menjadi…",
      "Rp20.000",
      "Rp12.000",
      "Rp10.000",
      "Rp2.010",
      "10 × Rp2.000 = Rp20.000.",
    ],
    [
      "Jika belum bisa menabung hari ini…",
      "Coba lagi saat mampu",
      "Harus merasa bersalah",
      "Ambil uang teman",
      "Berhenti selamanya",
      "Menabung disesuaikan kemampuan.",
    ],
    [
      "Manfaat mencatat tabungan?",
      "Mengetahui kemajuan",
      "Uang berlipat sendiri",
      "Mengubah harga",
      "Menjamin hadiah",
      "Catatan menunjukkan jumlah yang terkumpul.",
    ],
    [
      "Target Rp100.000, sudah Rp14.000. Sisanya…",
      "Rp86.000",
      "Rp114.000",
      "Rp14.000",
      "Rp96.000",
      "Rp100.000 − Rp14.000 = Rp86.000.",
    ],
    [
      "Tempat menyimpan uang sebaiknya…",
      "Aman dan diketahui orang tua",
      "Di jalan",
      "Di tempat terbuka",
      "Pada orang asing",
      "Minta bantuan orang tua memilih tempat aman.",
    ],
    [
      "Rp5.000 ditabung 4 kali menjadi…",
      "Rp20.000",
      "Rp9.000",
      "Rp10.000",
      "Rp45.000",
      "4 × Rp5.000 = Rp20.000.",
    ],
    [
      "Tujuan tabungan yang jelas adalah…",
      "Buku seharga Rp30.000",
      "Semua benda di toko",
      "Apa saja tanpa rencana",
      "Hadiah pasti besok",
      "Tujuan dan jumlah jelas memudahkan rencana.",
    ],
  ],
  [
    [
      "Berbagi dapat berupa…",
      "Bantuan, barang, atau uang",
      "Hanya uang banyak",
      "Hanya hadiah mahal",
      "Paksaan",
      "Bantuan kecil juga kebaikan.",
    ],
    [
      "Teman lupa pensil, kamu punya cadangan. Kamu bisa…",
      "Meminjamkannya dengan ramah",
      "Mengejeknya",
      "Menyembunyikannya",
      "Memaksanya membayar mahal",
      "Bantuan ramah membantu teman belajar.",
    ],
    [
      "Sedekah dilakukan dengan…",
      "Sukarela dan ikhlas",
      "Paksaan",
      "Harapan pasti dipuji",
      "Mempermalukan penerima",
      "Berbuat baik dengan tulus dan menghargai orang lain.",
    ],
    [
      "Zakat berbeda karena…",
      "Wajib bagi Muslim yang memenuhi syarat",
      "Selalu sama dengan hadiah",
      "Hanya berupa senyum",
      "Wajib untuk semua anak tanpa syarat",
      "Zakat memiliki syarat tertentu. Pelajari bersama guru.",
    ],
    [
      "Infak berkaitan dengan…",
      "Mengeluarkan harta untuk kebaikan",
      "Mengejek orang",
      "Mengambil hak orang lain",
      "Membeli semua mainan",
      "Infak berarti mengeluarkan harta untuk kebaikan.",
    ],
    [
      "Jika uang terbatas, kamu bisa membantu dengan…",
      "Tenaga sesuai kemampuan",
      "Berutang untuk dipuji",
      "Mengambil uang orang",
      "Berjanji berlebihan",
      "Berbagi tidak harus uang.",
    ],
    [
      "Saat memberikan bantuan, sebaiknya…",
      "Menjaga perasaan penerima",
      "Menceritakan kekurangannya",
      "Meminta pujian",
      "Memotretnya tanpa izin",
      "Hormati orang yang menerima bantuan.",
    ],
    [
      "Sebelum membagikan barang milik keluarga…",
      "Minta izin pemiliknya",
      "Langsung mengambil",
      "Sembunyikan dari orang tua",
      "Berikan semua",
      "Berbagi juga menghormati kepemilikan.",
    ],
  ],
  [
    [
      "Langkah pertama merencanakan tabungan?",
      "Menentukan tujuan",
      "Menghabiskan uang",
      "Meniru semua teman",
      "Meminjam sebanyaknya",
      "Tujuan memberi arah untuk rencana.",
    ],
    [
      "Target Rp30.000, sudah Rp10.000. Kurangnya…",
      "Rp20.000",
      "Rp40.000",
      "Rp10.000",
      "Rp30.000",
      "30.000 − 10.000 = 20.000.",
    ],
    [
      "Butuh Rp10.000, menabung Rp2.000 sekali. Perlu…",
      "5 kali",
      "2 kali",
      "10 kali",
      "20 kali",
      "10.000 ÷ 2.000 = 5 kali.",
    ],
    [
      "Jika harga barang naik, rencanamu…",
      "Boleh disesuaikan",
      "Harus dibuang",
      "Pasti gagal",
      "Tidak boleh berubah",
      "Rencana bisa menyesuaikan keadaan.",
    ],
    [
      "Uang Rp20.000, buku Rp12.000. Sisanya…",
      "Rp8.000",
      "Rp32.000",
      "Rp12.000",
      "Rp2.000",
      "20.000 − 12.000 = 8.000.",
    ],
    [
      "Prioritas berarti…",
      "Hal yang didahulukan",
      "Semua dibeli bersama",
      "Barang paling mahal",
      "Mengikuti iklan",
      "Prioritas membantu memilih dengan sumber daya terbatas.",
    ],
    [
      "Rencana belanja sesuai…",
      "Kebutuhan dan kemampuan",
      "Keinginan semua teman",
      "Iklan saja",
      "Harga tertinggi",
      "Sesuaikan dengan kondisi diri dan keluarga.",
    ],
    [
      "Untuk mengecek kemajuan target…",
      "Bandingkan tabungan dengan target",
      "Menebak saja",
      "Hapus catatan",
      "Tambah harga sendiri",
      "Perbandingan menunjukkan yang masih diperlukan.",
    ],
  ],
  [
    [
      "Refleksi adalah…",
      "Melihat kembali keputusan untuk belajar",
      "Menyalahkan diri",
      "Melupakan pengalaman",
      "Menyalahkan teman",
      "Refleksi membantu belajar dari pengalaman.",
    ],
    [
      "Setelah belanja melebihi rencana…",
      "Catat dan perbaiki rencana",
      "Menyerah",
      "Sembunyikan semua",
      "Ulangi tanpa berpikir",
      "Kesalahan adalah kesempatan belajar.",
    ],
    [
      "Pertanyaan refleksi yang membantu?",
      "Apa yang bisa kucoba lebih baik?",
      "Mengapa aku selalu buruk?",
      "Siapa yang harus disalahkan?",
      "Bagaimana menyembunyikannya?",
      "Pertanyaan ramah membantu menemukan langkah berikutnya.",
    ],
    [
      "Tabungan bertambah sedikit. Kamu boleh…",
      "Menghargai kemajuan kecil",
      "Mengejek diri sendiri",
      "Merasa pasti gagal",
      "Membandingkan terus",
      "Setiap langkah sesuai kemampuan layak dihargai.",
    ],
    [
      "Catatan belanja menunjukkan…",
      "Ke mana uang digunakan",
      "Nilai orang lain",
      "Masa depan pasti",
      "Hadiah yang dijamin",
      "Catatan menunjukkan pola penggunaan uang.",
    ],
    [
      "Belajar dari keputusan teman sebaiknya…",
      "Dengan saling menghargai",
      "Dengan mengejek",
      "Dengan memaksa",
      "Dengan membandingkan kekayaan",
      "Belajar bersama tanpa merendahkan.",
    ],
    [
      "Rencana yang belum berhasil dapat…",
      "Dicoba lagi dengan penyesuaian",
      "Menentukan nilai dirimu",
      "Menjadi alasan menyerah",
      "Disembunyikan selamanya",
      "Ubah langkah sesuai pengalaman dan kemampuan.",
    ],
    [
      "Setelah belajar berbagi, refleksi yang tepat?",
      "Bagaimana membantu sesuai kemampuan?",
      "Bagaimana mendapat pujian?",
      "Siapa lebih kaya?",
      "Haruskah memberi semua uang?",
      "Refleksi membantu menerapkan kebaikan dengan bijak.",
    ],
  ],
];
export const questions: Question[] = banks.flatMap((rows, ti) =>
  rows.map(([text, answer, b, c, d, explanation], i) => {
    const options = [answer, b, c, d];
    const shift = (i + ti) % 4;
    return {
      id: `${topics[ti].slug}-${i}`,
      topic: topics[ti].slug,
      text,
      options: [...options.slice(shift), ...options.slice(0, shift)],
      correct: (4 - shift) % 4,
      explanation,
    };
  }),
);
export const badges = [
  "Ahli Uang",
  "Rajin Menabung",
  "Sahabat Berbagi",
  "Perencana Cilik",
  "Juara Duel",
  "Si Cerdas",
  "Penjelajah Materi",
  "Bintang Kelas",
];
export const rupiah = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;
