"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Copy,
  Maximize,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Tv,
  Users,
} from "lucide-react";
import { topics, questions } from "@/data/content";
import { createRoom, gameAction, Room, Team, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Mascot } from "./art";
import { EmptyState, Logo } from "./shell";
import { Answers, Confetti, PageHeading } from "./learning";
import { Progress } from "./home";
import { Modal, useOrigin } from "./progress-pages";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AnimatedCounter,
  GameCountdown,
  MatchStart,
  QuestionTransition,
  ScoreIncrease,
} from "./game-motion";
import { fadeIn, popIn, slideUp, staggerContainer } from "@/lib/motion";
const statusText = {
  waiting: "Menunggu pemain",
  countdown: "Bersiap!",
  question: "Pertanyaan dibuka",
  paused: "Dijeda",
  reveal: "Pembahasan",
  finished: "Selesai",
};
export function Setup() {
  const router = useRouter();
  const search = useSearchParams();
  const [mode, setMode] = useState<"team" | "individual">(
    search.get("mode") === "individual" ? "individual" : "team",
  );
  const [topic, setTopic] = useState("all");
  const [count, setCount] = useState(5);
  const [seconds, setSeconds] = useState(30);
  const [duration, setDuration] = useState(5);
  const [input, setInput] = useState<"manual" | "digital">("manual");
  const [title, setTitle] = useState("Petualangan Kelas 5A");
  const [busy, setBusy] = useState(false);
  return (
    <div className="page-container content-page">
      <div className="narrow">
        <PageHeading
          title="Siapkan duel serumu"
          subtitle="Atur permainan, panggil petualang, lalu tampilkan di layar besar."
          back="/duel"
        />
        <form
          className="paper"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy) return;
            setBusy(true);
            const code = createRoom(
              { title: title.trim(), mode, topic, seconds, duration, input },
              count,
            );
            router.push(`/guru/game/${code}`);
          }}
        >
          <div className="form-grid">
            <label className="field full">
              Nama permainan
              <input
                required
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="field">
              Mode duel
              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "team" | "individual")
                }
              >
                <option value="team">Duel Tim · Hijau vs Oranye</option>
                <option value="individual">Duel Individu · 1 vs 1</option>
              </select>
            </label>
            <label className="field">
              Dunia belajar
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (e.target.value !== "all") setCount(5);
                }}
              >
                <option value="all">Campuran 6 dunia</option>
                {topics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.short}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Jumlah soal
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {(topic === "all" ? [5, 10, 15] : [5, 8]).map((n) => (
                  <option key={n} value={n}>
                    {n} soal
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Waktu per soal
              <select
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
              >
                {[15, 30, 45, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} detik
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Batas waktu pertandingan
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {[3, 5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} menit
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Cara menjawab
              <select
                value={input}
                onChange={(e) =>
                  setInput(e.target.value as "manual" | "digital")
                }
              >
                <option value="manual">Guru memilih jawaban tim</option>
                <option value="digital">Pemain menjawab di tab sendiri</option>
              </select>
            </label>
          </div>
          <div className="note spacer-top">
            {input === "manual"
              ? "Cocok untuk satu laptop dan layar kelas. Guru mencatat jawaban yang disebutkan peserta."
              : "Buka tab pemain pada browser dan origin yang sama. Demo ini belum menghubungkan perangkat berbeda."}
          </div>
          <button
            className="button spacer-top"
            disabled={busy || !title.trim()}
            type="submit"
          >
            <Plus size={18} />
            {busy ? "Menyiapkan…" : "Buat Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
function useClock(room: Room | undefined) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!room || !now) return;
    const expired =
      (room.status === "countdown" || room.status === "question") &&
      now >= room.deadline;
    const matchExpired =
      (room.status === "question" || room.status === "reveal") &&
      now >= room.matchDeadline;
    if (expired || matchExpired) void gameAction(room.code, { type: "tick" });
  }, [room, now]);
  return now;
}
function remaining(room: Room, now: number) {
  return room.status === "paused"
    ? Math.ceil(room.remaining / 1000)
    : Math.max(
        0,
        Math.ceil(
          (room.deadline - (now || room.deadline - room.seconds * 1000)) / 1000,
        ),
      );
}
function TeamScore({
  team,
  index,
  submitted,
  showScore = true,
}: {
  team: Team;
  index: number;
  submitted?: boolean;
  showScore?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("team-score", index === 1 && "orange")}
      initial="hidden"
      animate="visible"
      variants={reduce ? fadeIn : slideUp}
    >
      <span className="team-emoji">{index === 0 ? "🌿" : "☀️"}</span>
      <h2>{team.name}</h2>
      {showScore ? (
        <>
          <strong>
            <ScoreIncrease value={team.score} />
          </strong>
          <small>POIN</small>
        </>
      ) : (
        <div className="player-list">
          {team.players.length ? (
            <AnimatePresence initial={false}>
              {team.players.map((p) => (
                <motion.span
                  layout
                  className="player-chip"
                  key={p}
                  variants={reduce ? fadeIn : popIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <span aria-hidden="true">{index === 0 ? "🌿" : "☀️"}</span>{" "}
                  {p}
                </motion.span>
              ))}
            </AnimatePresence>
          ) : (
            <span className="muted waiting-dots">Menunggu petualang…</span>
          )}
        </div>
      )}
      {showScore && submitted !== undefined && (
        <p className="submitted">
          <motion.span
            key={String(submitted)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {submitted ? "✓ Jawaban Terkunci" : "Sedang berpikir…"}
          </motion.span>
        </p>
      )}
      {!showScore && (
        <small>
          <AnimatedCounter value={team.players.length} /> petualang siap
        </small>
      )}
    </motion.div>
  );
}
function LocalNote() {
  return (
    <p className="local-warning">
      Mode demo lokal · Sinkronisasi hanya antar-tab di browser dan origin yang
      sama. QR adalah tautan masuk, bukan koneksi permainan antarperangkat.
    </p>
  );
}
function Result({ room }: { room: Room }) {
  const [review, setReview] = useState(false);
  const reduce = useReducedMotion();
  const winner =
    room.teams[0].score === room.teams[1].score
      ? "Kompak, hasilnya seri!"
      : `${room.teams[room.teams[0].score > room.teams[1].score ? 0 : 1].name} unggul!`;
  return (
    <motion.div
      className="match-results"
      data-testid="game-results"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Confetti />
      <Mascot emotion="victory" />
      <span className="status-pill">Pertandingan selesai</span>
      <motion.h1 className="spacer-top" variants={reduce ? fadeIn : popIn}>
        {winner}
      </motion.h1>
      <p>Kalian semua hebat. Terima kasih sudah belajar bersama!</p>
      <div className="result-scores">
        {room.teams.map((t, i) => (
          <div key={i}>
            <TeamScore team={t} index={i} />
            <p className="spacer-top">
              {t.score / 100} jawaban benar dari {room.rounds.length} soal
              dimainkan
            </p>
          </div>
        ))}
      </div>
      <div className="actions-row center-actions">
        <button
          className="button"
          onClick={() => gameAction(room.code, { type: "replay" })}
        >
          <RotateCcw size={18} /> Main Lagi
        </button>
        <Link className="button button-white" href="/leaderboard">
          Papan Juara
        </Link>
        <Link className="text-link" href="/">
          Kembali ke Beranda
        </Link>
        <button className="text-link" onClick={() => setReview(!review)}>
          {review ? "Tutup pembahasan" : "Lihat Pembahasan"}
        </button>
      </div>
      {review && (
        <div className="paper review-list">
          {room.rounds.map((r, i) => {
            const q = questions.find((q) => q.id === r.questionId)!;
            return (
              <div key={i}>
                <h3>
                  {i + 1}. {q.text}
                </h3>
                <p>
                  <strong>{q.options[q.correct]}</strong> — {q.explanation}
                </p>
                <p className="muted">
                  {room.teams
                    .map(
                      (t, j) =>
                        `${t.name}: ${r.answers[j] === null ? "Tidak menjawab" : q.options[r.answers[j]!]}`,
                    )
                    .join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
export function TVView({ code, view }: { code: string; view?: string }) {
  const s = useStore();
  const room = s.rooms[code];
  const now = useClock(room);
  const origin = useOrigin();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!room) return;
    const expected =
      room.status === "finished"
        ? "hasil"
        : room.status === "waiting"
          ? ""
          : "arena";
    if ((view || "") !== expected)
      router.replace(`/tv/${code}${expected ? `/${expected}` : ""}`);
  }, [room, code, view, router]);
  if (!room)
    return (
      <EmptyState
        title="Room belum ditemukan"
        text="Buat room di ruang guru pada browser yang sama, lalu buka tautan TV-nya."
      />
    );
  const q = questions.find((q) => q.id === room.questionIds[room.index])!;
  const seconds = remaining(room, now);
  const full = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  return (
    <div
      className="arena"
      data-testid={
        room.status === "waiting"
          ? "tv-lobby"
          : room.status === "finished"
            ? "tv-results"
            : "tv-arena"
      }
    >
      <div className="arena-header">
        <Logo />
        <div className="arena-status">
          <span>
            {room.status === "waiting"
              ? `${room.questionIds.length} soal · ${room.duration} menit`
              : room.status === "finished"
                ? "Terima kasih sudah bermain!"
                : `Soal ${room.index + 1} / ${room.questionIds.length}`}
          </span>
          {["question", "paused"].includes(room.status) && (
            <div
              className={cn("arena-clock", seconds <= 5 && "timer-urgent")}
              role="timer"
              aria-label={`${seconds} detik`}
            >
              {seconds}
              <small> dtk</small>
            </div>
          )}
        </div>
        <button className="button button-small button-white" onClick={full}>
          <Maximize size={17} /> Layar penuh
        </button>
      </div>
      {room.status === "waiting" ? (
        <div className="lobby-content">
          <span className="status-pill">
            {room.mode === "team" ? "Duel Tim" : "Duel Individu"} ·{" "}
            {room.input === "manual" ? "Dipandu guru" : "Jawaban digital"}
          </span>
          <h1>{room.title}</h1>
          <p>Petualang, siap untuk tantangan Koini?</p>
          <div className="room-code">{code}</div>
          <button
            className="text-link"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy size={15} />
            {copied ? "Kode disalin!" : "Salin kode room"}
          </button>
          <div className="lobby-grid">
            <TeamScore team={room.teams[0]} index={0} showScore={false} />
            <div className="qr-panel">
              <QRCodeSVG
                value={`${origin}/join?code=${code}`}
                size={150}
                marginSize={1}
              />
              <p>
                Buka halaman gabung
                <br />
                pada tab browser yang sama.
              </p>
            </div>
            <TeamScore team={room.teams[1]} index={1} showScore={false} />
          </div>
          <div className="actions-row center-actions">
            <Link href={`/guru/game/${code}`} className="button">
              Buka kontrol guru <ArrowRight size={17} />
            </Link>
            <Link className="button button-white" href={`/join?code=${code}`}>
              Gabung Room
            </Link>
          </div>
          <LocalNote />
        </div>
      ) : room.status === "finished" ? (
        <Result room={room} />
      ) : room.status === "countdown" ? (
        <GameCountdown seconds={seconds} />
      ) : (
        <>
          <MatchStart
            active={
              room.index === 0 &&
              room.status === "question" &&
              now > 0 &&
              now - (room.deadline - room.seconds * 1000) < 700
            }
          />
          <div className="arena-layout">
            <TeamScore
              team={room.teams[0]}
              index={0}
              submitted={room.answers[0] !== null}
            />
            <QuestionTransition
              id={`${room.run || 0}-${room.index}`}
              className="arena-question"
            >
              <small>
                {room.status === "paused"
                  ? "Waktunya istirahat sebentar"
                  : room.status === "reveal"
                    ? "Yuk, pahami jawabannya"
                    : "Pikirkan bersama, jawab dengan percaya diri"}
              </small>
              <h1>{q.text}</h1>
              <Progress
                value={
                  room.status === "reveal"
                    ? 100
                    : (seconds / room.seconds) * 100
                }
              />
              <Answers
                question={q}
                selected={null}
                onAnswer={() => {}}
                locked
                reveal={room.status === "reveal"}
              />
              {room.status === "reveal" && (
                <div className="feedback" role="status">
                  <strong>
                    Jawaban: {String.fromCharCode(65 + q.correct)} ·{" "}
                    {q.options[q.correct]}
                  </strong>
                  <p>{q.explanation}</p>
                </div>
              )}
              {room.status === "paused" && (
                <div className="feedback">
                  Permainan dijeda oleh guru. Timer berhenti.
                </div>
              )}
            </QuestionTransition>
            <TeamScore
              team={room.teams[1]}
              index={1}
              submitted={room.answers[1] !== null}
            />
          </div>
          <div className="arena-foot">
            {room.status === "reveal"
              ? "Menunggu guru membuka pertanyaan berikutnya."
              : room.input === "manual"
                ? "Diskusikan jawaban. Guru akan mencatat pilihan timmu."
                : "Pilih jawaban pada tab pemainmu."}{" "}
            <span>· Room {code}</span>
          </div>
        </>
      )}
    </div>
  );
}
export function Controller({ code }: { code: string }) {
  const s = useStore();
  const room = s.rooms[code];
  const now = useClock(room);
  if (!room) return <EmptyState title="Room belum ditemukan" />;
  const q = questions.find((q) => q.id === room.questionIds[room.index])!;
  const ready = room.teams.every((t) => t.players.length > 0);
  return (
    <div
      className="page-container content-page"
      data-testid="teacher-controller"
    >
      <PageHeading title="Kontrol pertandingan" subtitle={room.title} />
      <div className="controller-heading">
        <span className="status-pill">
          {code} · {statusText[room.status]}
        </span>
        <div className="actions-row" style={{ margin: 0 }}>
          <Link
            href={`/tv/${code}`}
            target="_blank"
            className="button button-white"
          >
            <Tv size={18} /> Buka Smart TV
          </Link>
          <Link
            href={`/join?code=${code}`}
            target="_blank"
            className="text-link"
          >
            Buka halaman pemain
          </Link>
        </div>
      </div>
      {room.status === "finished" ? (
        <Result room={room} />
      ) : (
        <div className="paper">
          <div className="quiz-top">
            <strong>
              {room.status === "waiting"
                ? "Panggil semua petualang"
                : `Soal ${room.index + 1} / ${room.questionIds.length}`}
            </strong>
            <span className="arena-clock">
              {room.status === "waiting"
                ? `${room.seconds} dtk / soal`
                : room.status === "reveal"
                  ? "Pembahasan"
                  : `${remaining(room, now)} dtk`}
            </span>
          </div>
          <h2>
            {room.status === "waiting"
              ? "Siap memulai cerita baru?"
              : room.status === "countdown"
                ? "Bersiap, permainan akan dimulai…"
                : q.text}
          </h2>
          <p className="muted spacer-top">
            {room.input === "manual"
              ? "Mode guru: pilih satu jawaban resmi untuk setiap tim."
              : "Mode digital: pemain menjawab melalui tab pemain masing-masing."}{" "}
            Jawaban benar +100 poin, lainnya 0 poin.
          </p>
          <div className="controller-teams">
            {room.teams.map((t, i) => (
              <div
                className={cn("controller-team", i === 1 && "orange")}
                key={i}
              >
                <h3>
                  {t.name}
                  <span>
                    <AnimatedCounter value={t.score} /> poin
                  </span>
                </h3>
                <p>
                  {t.players.length ? t.players.join(", ") : "Belum ada pemain"}
                </p>
                {room.status !== "waiting" && (
                  <>
                    <div className="controller-answers spacer-top">
                      {q.options.map((a, j) => (
                        <button
                          key={j}
                          title={a}
                          aria-label={`${t.name} jawab ${String.fromCharCode(65 + j)}: ${a}`}
                          className={cn(room.answers[i] === j && "selected")}
                          disabled={
                            room.input !== "manual" ||
                            room.status !== "question" ||
                            room.answers[i] !== null
                          }
                          onClick={() =>
                            gameAction(code, {
                              type: "answer",
                              team: i,
                              answer: j,
                              round: room.index,
                            })
                          }
                        >
                          {String.fromCharCode(65 + j)}
                        </button>
                      ))}
                    </div>
                    <p className="spacer-top">
                      {room.answers[i] === null
                        ? "Belum menjawab"
                        : `✓ Pilihan ${String.fromCharCode(65 + room.answers[i]!)}`}
                    </p>
                  </>
                )}
                {room.input === "digital" && t.players.length > 0 && (
                  <Link
                    className="text-link"
                    target="_blank"
                    href={`/play/${code}?team=${i}`}
                  >
                    Buka tab {t.name} <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            ))}
          </div>
          {room.status !== "waiting" && room.status !== "countdown" && (
            <>
              <div className="answer-grid">
                {q.options.map((a, i) => (
                  <div
                    key={i}
                    className={cn(
                      "answer",
                      room.status === "reveal" && i === q.correct && "correct",
                    )}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {a}
                  </div>
                ))}
              </div>
              {room.status === "reveal" && (
                <div className="feedback">
                  <strong>Jawaban benar: {q.options[q.correct]}</strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </>
          )}
          <div className="controller-actions">
            {room.status === "waiting" ? (
              <>
                <button
                  className="button button-white"
                  onClick={() => gameAction(code, { type: "populate" })}
                >
                  <Users size={18} /> Isi Pemain Demo
                </button>
                <button
                  className="button"
                  disabled={!ready}
                  onClick={() => gameAction(code, { type: "start" })}
                >
                  <Play size={18} /> Mulai Pertandingan
                </button>
              </>
            ) : room.status === "question" ? (
              <>
                <button
                  className="button button-white"
                  onClick={() => gameAction(code, { type: "pause" })}
                >
                  <Pause size={17} /> Jeda
                </button>
                <button
                  className="button"
                  onClick={() => gameAction(code, { type: "reveal" })}
                >
                  Tutup ronde & bahas
                </button>
              </>
            ) : room.status === "paused" ? (
              <button
                className="button"
                onClick={() => gameAction(code, { type: "resume" })}
              >
                <Play size={18} /> Lanjutkan permainan
              </button>
            ) : room.status === "reveal" ? (
              <button
                className="button"
                onClick={() => gameAction(code, { type: "next" })}
              >
                {room.index + 1 === room.questionIds.length
                  ? "Lihat Hasil"
                  : "Pertanyaan Berikutnya"}{" "}
                <ArrowRight size={18} />
              </button>
            ) : null}
            {room.status !== "waiting" && (
              <Modal
                title="Akhiri pertandingan?"
                description="Skor yang sudah diperoleh tetap disimpan. Semua peserta dapat melihat hasilnya."
                trigger={
                  <button className="text-link">Akhiri pertandingan</button>
                }
              >
                <button
                  className="button"
                  onClick={() => gameAction(code, { type: "finish" })}
                >
                  Selesai & lihat hasil
                </button>
              </Modal>
            )}
          </div>
          {!ready && room.status === "waiting" && (
            <p className="muted spacer-top">
              Isi pemain demo atau gabungkan minimal satu pemain di setiap sisi.
            </p>
          )}
        </div>
      )}
      <LocalNote />
    </div>
  );
}
export function Join() {
  const router = useRouter();
  const search = useSearchParams();
  const s = useStore();
  const [code, setCode] = useState(search.get("code") || "");
  const [name, setName] = useState(s.name);
  const [team, setTeam] = useState(0);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const room = s.rooms[code.trim().toUpperCase()];
    if (!room) {
      setError(
        "Room tidak ditemukan. Periksa kode atau buat room di browser ini.",
      );
      return;
    }
    if (room.status !== "waiting") {
      setError("Permainan sudah dimulai. Tunggu ronde permainan baru.");
      return;
    }
    if (room.mode === "individual" && room.teams[team].players.length) {
      setError("Sisi ini sudah terisi. Pilih sisi lainnya.");
      return;
    }
    if (!name.trim()) {
      setError("Isi nama panggilanmu dulu.");
      return;
    }
    await gameAction(room.code, { type: "join", team, name: name.trim() });
    router.push(`/play/${room.code}?team=${team}`);
  };
  return (
    <div className="page-container content-page">
      <div className="join-form">
        <PageHeading title="Petualangan menunggumu!" />
        <form className="paper" onSubmit={submit}>
          <Mascot emotion="happy" />
          <h1>Gabung Room</h1>
          <p>Siapkan nama panggilan dan kode dari guru.</p>
          <label className="field">
            Kode room
            <input
              required
              value={code}
              maxLength={14}
              placeholder="CERDAS…"
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              autoCapitalize="characters"
            />
          </label>
          <label className="field">
            Nama panggilan
            <input
              required
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            Pilih sisi
            <select
              value={team}
              onChange={(e) => setTeam(Number(e.target.value))}
            >
              <option value={0}>🌿 Hijau</option>
              <option value={1}>☀️ Oranye</option>
            </select>
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          <button className="button spacer-top" type="submit">
            Gabung permainan <ArrowRight size={17} />
          </button>
        </form>
        <LocalNote />
      </div>
    </div>
  );
}
export function Player({ code }: { code: string }) {
  const s = useStore();
  const room = s.rooms[code];
  const now = useClock(room);
  const search = useSearchParams();
  const team = search.get("team") === "1" ? 1 : 0;
  if (!room) return <EmptyState title="Room belum ditemukan" />;
  if (room.status === "finished")
    return (
      <div className="arena">
        <Logo />
        <Result room={room} />
      </div>
    );
  const q = questions.find((q) => q.id === room.questionIds[room.index])!;
  const answer = room.answers[team];
  return (
    <div className="player-screen" data-testid="player-screen">
      <Logo />
      <div className="paper">
        <span className="status-pill">
          {room.teams[team].name} · {code}
        </span>
        <h1>
          {room.status === "waiting"
            ? "Sudah siap, petualang?"
            : room.status === "countdown"
              ? "Bersiap…"
              : `Soal ${room.index + 1} dari ${room.questionIds.length}`}
        </h1>
        {room.status === "waiting" || room.status === "countdown" ? (
          <>
            {room.status === "countdown" ? (
              <GameCountdown seconds={remaining(room, now)} />
            ) : (
              <Mascot emotion="encouraging" animated />
            )}
            <p className="spacer-top">
              Tunggu guru memulai permainan. Tim kamu:{" "}
              {room.teams[team].players.join(", ") || "belum bergabung"}
            </p>
            {!room.teams[team].players.length && (
              <Link className="button spacer-top" href={`/join?code=${code}`}>
                Gabung dahulu
              </Link>
            )}
          </>
        ) : (
          <QuestionTransition id={`${room.run || 0}-${room.index}`}>
            <div className="quiz-top">
              <span>{statusText[room.status]}</span>
              <strong className="tabular-nums">
                {remaining(room, now)} dtk
              </strong>
            </div>
            <h2>{q.text}</h2>
            <Answers
              question={q}
              selected={answer}
              locked={
                room.status !== "question" ||
                answer !== null ||
                room.input === "manual" ||
                !room.teams[team].players.length
              }
              onAnswer={(i) =>
                gameAction(code, {
                  type: "answer",
                  team,
                  answer: i,
                  round: room.index,
                })
              }
              reveal={room.status === "reveal"}
            />
            {answer !== null && (
              <div className="feedback" role="status">
                ✓ Jawabanmu sudah dikirim!
                {room.status === "reveal" && <p>{q.explanation}</p>}
              </div>
            )}
            {room.status === "reveal" && answer === null && (
              <div className="feedback">Ronde ditutup. {q.explanation}</div>
            )}
            {room.input === "manual" && (
              <p className="note spacer-top">
                Sebutkan pilihanmu. Guru akan mencatat jawaban.
              </p>
            )}
            {room.status === "paused" && (
              <div className="note spacer-top">
                Guru menjeda permainan. Istirahat sebentar, ya.
              </div>
            )}
          </QuestionTransition>
        )}
      </div>
      <LocalNote />
    </div>
  );
}
