"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, Clock, Flame, CheckCircle, ArrowRight, Home, Users } from "lucide-react";
import { useGameSocket } from "@/lib/useGameSocket";
import { OptionKey } from "@/lib/types";

interface PageProps {
  params: Promise<{ roomCode: string }>;
}

function TvArenaContent({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(params);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [revealExplanation, setRevealExplanation] = useState<boolean>(false);

  const {
    isConnected,
    room,
    currentQuestion,
    questionIndex,
    totalQuestions,
    lastResult,
    gameOverData,
    errorMessage,
    startGame,
    nextQuestion,
  } = useGameSocket({
    roomCode,
    isHost: true,
  });

  // Countdown Timer
  useEffect(() => {
    if (!currentQuestion || room?.state !== "in_progress") return;

    setTimeLeft(currentQuestion.time_limit_seconds || 15);
    setRevealExplanation(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRevealExplanation(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, room?.state]);

  // Trigger celebration on Game Over
  useEffect(() => {
    if (gameOverData) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [gameOverData]);

  const optionColors: Record<OptionKey, { bg: string; border: string; text: string; badge: string }> = {
    A: { bg: "bg-red-50", border: "border-red-300", text: "text-red-900", badge: "bg-red-500 text-white" },
    B: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900", badge: "bg-blue-500 text-white" },
    C: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-900", badge: "bg-amber-500 text-white" },
    D: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-900", badge: "bg-emerald-500 text-white" },
  };

  const playersList = room ? Object.values(room.players) : [];
  const greenPlayers = playersList.filter((p) => p.team === "hijau");
  const orangePlayers = playersList.filter((p) => p.team === "oranye");

  const greenTotalScore = greenPlayers.reduce((acc, p) => acc + p.score, 0);
  const orangeTotalScore = orangePlayers.reduce((acc, p) => acc + p.score, 0);

  return (
    <div className="min-h-screen bg-[#F4FBF9] text-[#0B3835] flex flex-col justify-between p-6 md:p-10 select-none">
      {/* Top Bar Header */}
      <header className="flex items-center justify-between border-b-2 border-[#E2E8F0] pb-4 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00A39E] text-white flex items-center justify-center font-black text-2xl shadow-sm">
            BSI
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#0B3835]">
              Arena Layar TV: {room?.module_name || "Duel Cerdas"}
            </h1>
            <p className="text-xs text-[#64748B] font-semibold">
              Sharia Young Leader Summit 2026 • Format: {room?.mode === "team" ? "Tim Hijau vs Tim Oranye" : "1 lawan 1"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-white border-2 border-[#00A39E] flex items-center gap-2 shadow-xs">
            <span className="text-xs font-bold text-[#64748B]">KODE ROOM:</span>
            <span className="text-xl font-black tracking-widest text-[#00A39E]">{roomCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            ></span>
            <span className="text-xs font-bold text-[#475569]">
              {isConnected ? "Live 1,000 CCU Engine" : "Terputus"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 my-6 flex flex-col justify-center">
        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-2xl bg-red-100 border-2 border-red-300 text-red-800 font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* STATE 1: WAITING FOR PLAYERS */}
        {room?.state === "waiting" && (
          <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 border-3 border-[#B2E4E2] shadow-sm text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E6F6F5] text-[#007571] font-extrabold text-sm mb-4">
              RUANG TUNGGU ARENA DUEL
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0B3835] tracking-tight mb-3">
              Ketik Kode di HP Siswa:
            </h2>
            <div className="text-5xl md:text-7xl font-black tracking-widest text-[#00A39E] my-4 py-3 px-8 bg-[#E6F6F5] rounded-3xl inline-block border-3 border-[#00A39E] shadow-xs">
              {roomCode}
            </div>
            <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto mb-8">
              Siswa membuka tautan aplikasi di ponsel masing-masing, masukkan kode di atas, lalu pilih tim atau nama perwakilan.
            </p>

            {/* Roster Siswa yang Sudah Bergabung */}
            <div className="mb-8">
              <h3 className="text-sm font-extrabold text-[#475569] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Pemain Bergabung ({playersList.length})
              </h3>

              {room.mode === "team" ? (
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  {/* Tim Hijau */}
                  <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#10B981]">
                    <div className="font-extrabold text-sm text-[#065F46] mb-2 flex items-center justify-between">
                      <span>Tim Hijau</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#10B981] text-white text-xs">
                        {greenPlayers.length} Siswa
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {greenPlayers.map((p) => (
                        <span key={p.id} className="px-3 py-1 rounded-xl bg-white border border-[#A7F3D0] text-xs font-bold text-[#065F46]">
                          {p.name}
                        </span>
                      ))}
                      {greenPlayers.length === 0 && (
                        <span className="text-xs text-[#065F46]/70 italic">Menunggu siswa memilih Tim Hijau...</span>
                      )}
                    </div>
                  </div>

                  {/* Tim Oranye */}
                  <div className="p-4 rounded-2xl bg-[#FFF7ED] border-2 border-[#F97316]">
                    <div className="font-extrabold text-sm text-[#9A3412] mb-2 flex items-center justify-between">
                      <span>Tim Oranye</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#F97316] text-white text-xs">
                        {orangePlayers.length} Siswa
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {orangePlayers.map((p) => (
                        <span key={p.id} className="px-3 py-1 rounded-xl bg-white border border-[#FED7AA] text-xs font-bold text-[#9A3412]">
                          {p.name}
                        </span>
                      ))}
                      {orangePlayers.length === 0 && (
                        <span className="text-xs text-[#9A3412]/70 italic">Menunggu siswa memilih Tim Oranye...</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {playersList.map((p) => (
                    <div key={p.id} className="px-4 py-2 rounded-2xl bg-[#E6F6F5] border-2 border-[#00A39E] font-bold text-sm text-[#007571]">
                      {p.name}
                    </div>
                  ))}
                  {playersList.length === 0 && (
                    <div className="text-sm text-[#64748B] italic">Belum ada siswa yang masuk...</div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={startGame}
              className="py-4 px-10 rounded-2xl btn-3d-teal text-lg font-black tracking-wide cursor-pointer inline-flex items-center gap-3 shadow-md"
            >
              Mulai Duel Sekarang!
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STATE 2: IN-PROGRESS BATTLE ARENA */}
        {room?.state === "in_progress" && currentQuestion && (
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
            {/* Split Arena Scoreboard Top Banner */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tim / Pemain Kiri */}
              <div className="bg-white rounded-3xl p-5 border-3 border-[#10B981] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] flex items-center justify-center font-black text-2xl text-[#10B981]">
                    {room.mode === "team" ? "TH" : "P1"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#065F46]">
                      {room.mode === "team" ? "Tim Hijau" : playersList[0]?.name || "Pemain 1"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#059669] font-bold">
                      <Flame className="w-4 h-4 fill-current text-amber-500" />
                      Streak: {room.mode === "team" ? "-" : playersList[0]?.streak || 0}
                    </div>
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-black text-[#10B981] tracking-tight">
                  {room.mode === "team" ? greenTotalScore : playersList[0]?.score || 0}
                  <span className="text-sm font-semibold block text-right text-[#64748B]">POIN</span>
                </div>
              </div>

              {/* Tim / Pemain Kanan */}
              <div className="bg-white rounded-3xl p-5 border-3 border-[#F97316] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center font-black text-2xl text-[#F97316]">
                    {room.mode === "team" ? "TO" : "P2"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#9A3412]">
                      {room.mode === "team" ? "Tim Oranye" : playersList[1]?.name || "Pemain 2"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#EA580C] font-bold">
                      <Flame className="w-4 h-4 fill-current text-amber-500" />
                      Streak: {room.mode === "team" ? "-" : playersList[1]?.streak || 0}
                    </div>
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-black text-[#F97316] tracking-tight">
                  {room.mode === "team" ? orangeTotalScore : playersList[1]?.score || 0}
                  <span className="text-sm font-semibold block text-right text-[#64748B]">POIN</span>
                </div>
              </div>
            </div>

            {/* Question Card Box */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border-3 border-[#B2E4E2] shadow-sm relative overflow-hidden">
              {/* Header Soal & Waktu */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 rounded-full bg-[#E6F6F5] text-[#007571] font-black text-xs uppercase tracking-wider">
                  SOAL {questionIndex + 1} DARI {totalQuestions}
                </span>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-black text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft} Detik</span>
                </div>
              </div>

              {/* Progress Bar Waktu */}
              <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 5 ? "bg-red-500" : timeLeft <= 10 ? "bg-amber-500" : "bg-[#00A39E]"
                  }`}
                  style={{
                    width: `${(timeLeft / (currentQuestion.time_limit_seconds || 15)) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Teks Pertanyaan */}
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#0B3835] leading-snug mb-8">
                {currentQuestion.question_text}
              </h2>

              {/* 4 Pilihan Jawaban Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt) => {
                  const style = optionColors[opt.key];
                  const isCorrectAnswer = opt.key === currentQuestion.correct_option;
                  const isRevealed = revealExplanation || !!lastResult;

                  return (
                    <div
                      key={opt.key}
                      className={`p-5 rounded-2xl border-3 flex items-center gap-4 transition-all ${
                        isRevealed && isCorrectAnswer
                          ? "bg-emerald-100 border-emerald-500 text-emerald-950 scale-102"
                          : isRevealed && !isCorrectAnswer
                          ? "opacity-50 " + style.bg + " " + style.border
                          : style.bg + " " + style.border + " " + style.text
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${style.badge}`}>
                        {opt.key}
                      </span>
                      <span className="text-lg md:text-xl font-bold flex-1">
                        {opt.text}
                      </span>
                      {isRevealed && isCorrectAnswer && (
                        <CheckCircle className="w-7 h-7 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Penjelasan Edukasi Syariah (Muncul Saat Waktu Habis / Semua Jawab) */}
              {(revealExplanation || lastResult) && (
                <div className="mt-8 p-6 rounded-2xl bg-[#E6F6F5] border-2 border-[#00A39E] animate-fade-in">
                  <div className="font-extrabold text-[#007571] text-sm mb-1 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#00A39E]" />
                    PEMBAHASAN & HIKMAH FINANSIAL SYARIAH:
                  </div>
                  <p className="text-base text-[#0B3835] font-semibold leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="py-3 px-6 rounded-xl btn-3d-teal font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      Lanjut ke Soal Berikutnya
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATE 3: GAME OVER PODIUM */}
        {(room?.state === "finished" || gameOverData) && (
          <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 border-3 border-[#F39C12] shadow-lg text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Trophy className="w-12 h-12" />
            </div>

            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#B45309] font-extrabold text-xs mb-3">
              DUEL CERDAS SELESAI!
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#0B3835] mb-2">
              {gameOverData?.winner_team === "hijau"
                ? "🏆 Tim Hijau Menang!"
                : gameOverData?.winner_team === "oranye"
                ? "🏆 Tim Oranye Menang!"
                : "🏆 Duel Berakhir Seri & Berkah!"}
            </h2>

            <p className="text-sm md:text-base text-[#64748B] font-medium max-w-md mx-auto mb-8">
              Hebat! Seluruh siswa telah menyelesaikan tantangan literasi finansial syariah dengan penuh semangat.
            </p>

            {/* Skor Akhir */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#10B981]">
                <div className="text-xs font-extrabold text-[#065F46] uppercase">Skor Tim Hijau</div>
                <div className="text-3xl font-black text-[#10B981]">
                  {gameOverData ? gameOverData.green_score : greenTotalScore}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF7ED] border-2 border-[#F97316]">
                <div className="text-xs font-extrabold text-[#9A3412] uppercase">Skor Tim Oranye</div>
                <div className="text-3xl font-black text-[#F97316]">
                  {gameOverData ? gameOverData.orange_score : orangeTotalScore}
                </div>
              </div>
            </div>

            {/* Action Tombol Kembali */}
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="py-3 px-8 rounded-xl btn-3d-teal font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Bar Footer */}
      <footer className="text-center text-xs font-semibold text-[#64748B] pt-4">
        Duel Cerdas: Jago Atur Uang • Smart TV Classroom Host Engine • BSI Maslahat 2026
      </footer>
    </div>
  );
}

export default function TvArenaPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4FBF9] flex items-center justify-center text-sm font-bold text-[#00A39E]">
          Menyiapkan Arena Layar TV...
        </div>
      }
    >
      <TvArenaContent params={params} />
    </Suspense>
  );
}
