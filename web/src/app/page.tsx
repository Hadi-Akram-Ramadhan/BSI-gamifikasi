"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Users, Trophy, QrCode, Play, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { fetchModules, createRoom } from "@/lib/api";
import { ModuleInfo, GameMode, TeamType } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<GameMode>("1v1");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Join Pemain
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState<TeamType>("hijau");
  const [avatar, setAvatar] = useState("1");

  useEffect(() => {
    fetchModules()
      .then((data) => setModules(data))
      .catch((err) => {
        console.error("Gagal load modul:", err);
        // Fallback offline mock jika backend belum menyala
        setModules([
          { id: 1, title: "Kenali Uang dan Nilainya", description: "Nominal uang rupiah dan nilai tukar", icon: "coins", pillar: "Finansial" },
          { id: 2, title: "Kebutuhan vs Keinginan", description: "Hajat dharuriyyat vs syahwat konsumtif", icon: "balance-scale", pillar: "Finansial" },
          { id: 3, title: "Menabung dan Dana Impian", description: "Menyisihkan uang di awal target impian", icon: "piggy-bank", pillar: "Finansial" },
          { id: 4, title: "Berbagi dengan Bijak (ZISWAF)", description: "Keutamaan sedekah dan zakat berkah", icon: "hand-heart", pillar: "Sosial & Spiritual" },
          { id: 5, title: "Rencana Keuangan Sederhana", description: "Alokasi saku barakah 50-30-20 ramah anak", icon: "clipboard-list", pillar: "Finansial" },
          { id: 6, title: "Belanja Cerdas dan Halal", description: "Cek logo halal dan etika muamalah", icon: "shopping-bag", pillar: "Spiritual" },
          { id: 7, title: "Mengenal Bank Syariah dan BSI", description: "Bagi hasil tanpa riba dan Tabungan SimPel BSI", icon: "landmark", pillar: "Beyond Banking" },
          { id: 8, title: "Keamanan Digital dan Anti-Tipu", description: "Jaga PIN rahasia dan waspada penipuan", icon: "shield-check", pillar: "Finansial" },
        ]);
      });
  }, []);

  const handleCreateRoom = async () => {
    try {
      setIsCreating(true);
      setError(null);
      const room = await createRoom(selectedMode, selectedModule, questionCount);
      router.push(`/tv/${room.code}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat room. Pastikan server Go aktif di port 8080.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError("Masukkan kode room terlebih dahulu");
      return;
    }
    const cleanCode = joinCode.trim().toUpperCase();
    const query = new URLSearchParams({
      name: playerName || "Siswa Cerdas",
      team: selectedMode === "team" ? playerTeam : "none",
      avatar,
    });
    router.push(`/play/${cleanCode}?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F4FBF9] text-[#0B3835]">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A39E] flex items-center justify-center text-white font-black text-xl shadow-xs">
              B
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#0B3835] block leading-tight">
                Duel Cerdas: Jago Atur Uang
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                Sharia Young Leader Summit 2026 • BSI Maslahat
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F6F5] text-[#007571] border border-[#B2E4E2]">
              <Sparkles className="w-3.5 h-3.5 text-[#F39C12]" />
              Phygital Ecosystem
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-4 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider mb-3">
          Arena Cerdas Cermat Sekolah Dasar • Jawa Timur
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#0B3835] tracking-tight mb-3">
          Belajar Kelola Uang Jadi Seru & Berkah!
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-[#475569] font-medium leading-relaxed">
          Hubungkan binder fisik <strong className="text-[#00A39E]">Saku Barakah</strong> dengan arena duel digital di Smart TV kelas. Siswa adu cepat menggunakan HP sebagai tombol buzzer!
        </p>
      </section>

      {error && (
        <div className="max-w-4xl mx-auto px-4 my-2">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800 text-xs">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Dual Action Hub: Host TV vs Player Mobile */}
      <section className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
        {/* Card 1: Buka Arena Smart TV (Guru / Host) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#B2E4E2] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F6F5] flex items-center justify-center text-[#00A39E]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B3835]">Buka Layar Smart TV</h2>
                <p className="text-xs text-[#64748B]">Untuk Guru/Fasilitator di depan kelas</p>
              </div>
            </div>

            {/* Mode Permainan */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                Pilih Format Duel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode("1v1")}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedMode === "1v1"
                      ? "border-[#00A39E] bg-[#E6F6F5] text-[#007571] font-bold"
                      : "border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]"
                  }`}
                >
                  <div className="font-extrabold text-sm mb-0.5">1 lawan 1</div>
                  <div className="text-xs text-[#64748B]">Adu cepat 2 siswa perwakilan</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode("team")}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedMode === "team"
                      ? "border-[#00A39E] bg-[#E6F6F5] text-[#007571] font-bold"
                      : "border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B]"
                  }`}
                >
                  <div className="font-extrabold text-sm mb-0.5">Tim Hijau vs Oranye</div>
                  <div className="text-xs text-[#64748B]">Adu skor serentak satu kelas</div>
                </button>
              </div>
            </div>

            {/* Pilihan Modul Literasi */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                Pilih Modul Soal Saku Barakah
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(Number(e.target.value))}
                className="w-full p-3 rounded-xl border-2 border-[#E2E8F0] bg-white font-medium text-sm text-[#0B3835] focus:outline-hidden focus:border-[#00A39E]"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    Modul {m.id}: {m.title} ({m.pillar})
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Soal */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                Jumlah Soal Duel
              </label>
              <div className="flex gap-3">
                {[3, 5, 8].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      questionCount === cnt
                        ? "border-[#00A39E] bg-[#00A39E] text-white"
                        : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {cnt} Soal
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isCreating}
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-2xl btn-3d-teal font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" />
            {isCreating ? "Menyiapkan Arena..." : "Buka Arena Layar TV"}
          </button>
        </div>

        {/* Card 2: Masuk sebagai Pemain (Mobile Buzzer) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#FED7AA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B3835]">Masuk sebagai Pemain</h2>
                <p className="text-xs text-[#64748B]">Gunakan ponsel sebagai tombol buzzer</p>
              </div>
            </div>

            <form onSubmit={handleJoinGame}>
              {/* Kode Room */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Kode Room (Lihat di Layar TV)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BSI-A1B2"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full p-3 text-lg font-black tracking-widest text-center rounded-xl border-2 border-[#E2E8F0] uppercase text-[#0B3835] focus:outline-hidden focus:border-[#F97316]"
                  maxLength={10}
                  required
                />
              </div>

              {/* Nama Pemain */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Nama Panggilan / Kelompok
                </label>
                <input
                  type="text"
                  placeholder="Nama Siswa (cth: Ahmad)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-[#E2E8F0] font-medium text-sm text-[#0B3835] focus:outline-hidden focus:border-[#F97316]"
                  maxLength={20}
                  required
                />
              </div>

              {/* Pilihan Tim */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Pilih Tim (Untuk Mode Tim)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlayerTeam("hijau")}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      playerTeam === "hijau"
                        ? "border-[#10B981] bg-[#ECFDF5] text-[#065F46]"
                        : "border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                    Tim Hijau
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerTeam("oranye")}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      playerTeam === "oranye"
                        ? "border-[#F97316] bg-[#FFF7ED] text-[#9A3412]"
                        : "border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#F97316]"></span>
                    Tim Oranye
                  </button>
                </div>
              </div>

              {/* Pilihan Avatar Karakter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                  Pilih Avatar
                </label>
                <div className="flex justify-between gap-2">
                  {[
                    { id: "1", label: "👦 Ahmad" },
                    { id: "2", label: "🧕 Siti" },
                    { id: "3", label: "🧒 Fajar" },
                    { id: "4", label: "👧 Aisyah" },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.id)}
                      className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                        avatar === av.id
                          ? "border-[#F97316] bg-[#FFF7ED] text-[#9A3412]"
                          : "border-[#E2E8F0] text-[#64748B]"
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl btn-3d-orange font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-5 h-5" />
                Ambil Tombol Buzzer!
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Phygital Saku Barakah Integration Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-[#0B3835] text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#00A39E] text-white text-xs font-bold tracking-wider mb-3">
              Integrasi Phygital • Smart Workbook Saku Barakah
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
              Belajar Finansial Nyata dengan 3 Saku Binder
            </h3>
            <p className="text-sm md:text-base text-[#99F6E4] mb-6 leading-relaxed">
              Setiap bab workbook Saku Barakah dilengkapi kantong fisik transparan dengan target tabungan harian Rp2.000 untuk melatih kebiasaan nyata:
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#0F4E4A] border border-[#14B8A6]/30">
                <div className="text-xl mb-1">🏷️</div>
                <div className="font-bold text-white text-sm">Saku Kebutuhan</div>
                <div className="text-xs text-[#99F6E4]">Alokasi 50% untuk pensil, buku, dan ongkos sekolah pokok.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F4E4A] border border-[#14B8A6]/30">
                <div className="text-xl mb-1">🎯</div>
                <div className="font-bold text-white text-sm">Saku Impian</div>
                <div className="text-xs text-[#99F6E4]">Alokasi 30% ditabung harian menuju target sepatu/tas baru.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F4E4A] border border-[#14B8A6]/30">
                <div className="text-xl mb-1">🤝</div>
                <div className="font-bold text-white text-sm">Saku Sedekah</div>
                <div className="text-xs text-[#99F6E4]">Alokasi 20% infak Jumat berkah menyuburkan empati sosial.</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#99F6E4] font-medium items-center">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F39C12]" />
                Kesesuaian Prinsip Syariah BSI
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#F39C12]" />
                Kurikulum Merdeka Kelas 4-6 SD
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#F39C12]" />
                Target Rp100.000 per Bulan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold text-[#0B3835]">
            Duel Cerdas: Jago Atur Uang • Sharia Young Leader Summit (SYLS) 2026
          </p>
          <p className="mt-1">
            Inisiasi Ekosistem Literasi Finansial Phygital oleh PT Bank Syariah Indonesia (Persero) Tbk & BSI Maslahat
          </p>
        </div>
      </footer>
    </main>
  );
}
