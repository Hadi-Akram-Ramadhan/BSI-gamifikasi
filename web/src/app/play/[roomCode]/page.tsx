"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flame, Check, Sparkles, Home, Shield } from "lucide-react";
import { useGameSocket } from "@/lib/useGameSocket";
import { OptionKey, TeamType } from "@/lib/types";

interface PageProps {
  params: Promise<{ roomCode: string }>;
}

function MobileBuzzerContent({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(params);
  const searchParams = useSearchParams();

  const playerName = searchParams.get("name") || "Siswa Cerdas";
  const playerTeam = (searchParams.get("team") || "none") as TeamType;
  const playerAvatar = searchParams.get("avatar") || "1";

  // Generate deterministic player ID per device tab
  const [playerId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bsi_player_id");
      if (stored) return stored;
      const created = `p_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("bsi_player_id", created);
      return created;
    }
    return `p_${Math.random().toString(36).substring(2, 9)}`;
  });

  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);

  const {
    isConnected,
    room,
    currentQuestion,
    questionIndex,
    totalQuestions,
    gameOverData,
    errorMessage,
    submitAnswer,
  } = useGameSocket({
    roomCode,
    playerId,
    playerName,
    avatar: playerAvatar,
    team: playerTeam,
    isHost: false,
  });

  // Reset answer status on question change
  useEffect(() => {
    setHasAnswered(false);
    setSelectedOption(null);
  }, [currentQuestion?.id]);

  const handleTapOption = (key: OptionKey) => {
    if (hasAnswered || !currentQuestion || room?.state !== "in_progress") return;

    setSelectedOption(key);
    setHasAnswered(true);
    submitAnswer(key);

    // Vibrate haptic jika didukung ponsel
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }
  };

  const currentPlayer = room?.players?.[playerId];

  return (
    <div className="min-h-screen bg-[#F4FBF9] text-[#0B3835] flex flex-col justify-between p-4 max-w-md mx-auto select-none touch-manipulation">
      {/* Top Mobile Status Header */}
      <header className="bg-white rounded-2xl p-3 border-2 border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#00A39E] text-white flex items-center justify-center font-black text-lg">
            {playerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#0B3835] leading-tight">
              {playerName}
            </div>
            <div className="text-[11px] font-bold text-[#64748B] flex items-center gap-1">
              {playerTeam === "hijau" ? (
                <span className="text-[#059669]">● Tim Hijau</span>
              ) : playerTeam === "oranye" ? (
                <span className="text-[#EA580C]">● Tim Oranye</span>
              ) : (
                <span>● Mode 1v1</span>
              )}
              <span>• Room: {roomCode}</span>
            </div>
          </div>
        </div>

        {/* Live Score & Streak */}
        <div className="text-right">
          <div className="text-lg font-black text-[#00A39E] leading-tight">
            {currentPlayer?.score || 0} <span className="text-xs font-semibold">POIN</span>
          </div>
          {(currentPlayer?.streak || 0) > 0 && (
            <div className="text-[10px] font-bold text-amber-600 flex items-center justify-end gap-0.5">
              <Flame className="w-3 h-3 fill-current text-amber-500" />
              Streak {currentPlayer?.streak}x
            </div>
          )}
        </div>
      </header>

      {/* Main Buzzer Area */}
      <main className="flex-1 my-4 flex flex-col justify-center">
        {errorMessage && (
          <div className="p-3 mb-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* 1. WAITING FOR HOST */}
        {room?.state === "waiting" && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#B2E4E2] text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F6F5] text-[#00A39E] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-[#0B3835] mb-1">Tombol Buzzer Siap!</h2>
            <p className="text-xs text-[#64748B] font-medium mb-4">
              Kamu sudah berhasil terhubung. Perhatikan layar Smart TV di depan kelas. Guru akan segera memulai duel!
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold border border-[#A7F3D0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {isConnected ? "Koneksi Cepat & Stabil" : "Menghubungkan..."}
            </div>
          </div>
        )}

        {/* 2. IN-PROGRESS BUZZER BUTTONS */}
        {room?.state === "in_progress" && currentQuestion && (
          <div className="flex flex-col h-full justify-between gap-3">
            {/* Mini Question Header on Mobile */}
            <div className="bg-white rounded-2xl p-3 border-2 border-[#E2E8F0] text-center shadow-xs">
              <div className="text-[11px] font-black text-[#00A39E] uppercase tracking-wider mb-0.5">
                SOAL {questionIndex + 1} DARI {totalQuestions}
              </div>
              <div className="text-xs font-bold text-[#475569] line-clamp-2">
                Lihat pilihan lengkap di Layar TV!
              </div>
            </div>

            {/* Answered Banner Feedback */}
            {hasAnswered && (
              <div className="bg-[#E6F6F5] border-2 border-[#00A39E] rounded-2xl p-4 text-center animate-fade-in shadow-xs">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007571] mb-1">
                  <Check className="w-4 h-4 text-[#00A39E]" />
                  JAWABAN {selectedOption} TERKIRIM CEPAT!
                </div>
                <p className="text-xs text-[#0B3835] font-semibold">
                  Tengok layar Smart TV untuk melihat hasil dan pembahasan berkah!
                </p>
              </div>
            )}

            {/* 4 Big Quadrant Buzzer Buttons */}
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-[340px]">
              {/* Option A (Red) */}
              <button
                type="button"
                disabled={hasAnswered}
                onClick={() => handleTapOption("A")}
                className={`rounded-3xl flex flex-col items-center justify-center font-black text-3xl transition-all cursor-pointer ${
                  selectedOption === "A"
                    ? "bg-red-600 text-white ring-4 ring-red-300 scale-98"
                    : "bg-red-500 hover:bg-red-600 text-white shadow-[0_6px_0_#991B1B] active:translate-y-1 active:shadow-[0_2px_0_#991B1B]"
                } ${hasAnswered && selectedOption !== "A" ? "opacity-30" : ""}`}
              >
                <span>A</span>
                <span className="text-xs font-extrabold mt-1 tracking-wider opacity-90">OPSI A</span>
              </button>

              {/* Option B (Blue) */}
              <button
                type="button"
                disabled={hasAnswered}
                onClick={() => handleTapOption("B")}
                className={`rounded-3xl flex flex-col items-center justify-center font-black text-3xl transition-all cursor-pointer ${
                  selectedOption === "B"
                    ? "bg-blue-600 text-white ring-4 ring-blue-300 scale-98"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_6px_0_#1E40AF] active:translate-y-1 active:shadow-[0_2px_0_#1E40AF]"
                } ${hasAnswered && selectedOption !== "B" ? "opacity-30" : ""}`}
              >
                <span>B</span>
                <span className="text-xs font-extrabold mt-1 tracking-wider opacity-90">OPSI B</span>
              </button>

              {/* Option C (Amber) */}
              <button
                type="button"
                disabled={hasAnswered}
                onClick={() => handleTapOption("C")}
                className={`rounded-3xl flex flex-col items-center justify-center font-black text-3xl transition-all cursor-pointer ${
                  selectedOption === "C"
                    ? "bg-amber-600 text-white ring-4 ring-amber-300 scale-98"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_6px_0_#92400E] active:translate-y-1 active:shadow-[0_2px_0_#92400E]"
                } ${hasAnswered && selectedOption !== "C" ? "opacity-30" : ""}`}
              >
                <span>C</span>
                <span className="text-xs font-extrabold mt-1 tracking-wider opacity-90">OPSI C</span>
              </button>

              {/* Option D (Green) */}
              <button
                type="button"
                disabled={hasAnswered}
                onClick={() => handleTapOption("D")}
                className={`rounded-3xl flex flex-col items-center justify-center font-black text-3xl transition-all cursor-pointer ${
                  selectedOption === "D"
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-300 scale-98"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_6px_0_#065F46] active:translate-y-1 active:shadow-[0_2px_0_#065F46]"
                } ${hasAnswered && selectedOption !== "D" ? "opacity-30" : ""}`}
              >
                <span>D</span>
                <span className="text-xs font-extrabold mt-1 tracking-wider opacity-90">OPSI D</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. GAME OVER SCREEN */}
        {(room?.state === "finished" || gameOverData) && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#F39C12] text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#0B3835] mb-1">Permainan Selesai!</h2>
            <p className="text-xs text-[#64748B] mb-4">
              Total Skor Akhirmu: <strong className="text-[#00A39E] text-base">{currentPlayer?.score || 0} Poin</strong>
            </p>
            <Link
              href="/"
              className="w-full py-3 rounded-xl btn-3d-teal font-extrabold text-sm inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        )}
      </main>

      {/* Mobile Footer */}
      <footer className="text-center text-[10px] text-[#64748B] font-semibold pt-2">
        Buzzer Siswa • Duel Cerdas BSI Maslahat SYLS 2026
      </footer>
    </div>
  );
}

export default function MobileBuzzerPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4FBF9] flex items-center justify-center text-sm font-bold text-[#00A39E]">
          Menyiapkan Tombol Buzzer...
        </div>
      }
    >
      <MobileBuzzerContent params={params} />
    </Suspense>
  );
}
