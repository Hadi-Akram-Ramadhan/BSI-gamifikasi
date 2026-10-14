"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Plus, Trophy, X } from "lucide-react";
import { badges, rupiah, topics, questions } from "@/data/content";
import { resetDemo, recordSavings, update, useStore } from "@/lib/store";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AnimatedCounter,
  AnimatedSavingsJar,
  SavingBox,
  QuestionTransition,
} from "./game-motion";
import { fadeIn, popIn, softSpring, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Mascot } from "./art";
import { Confetti, PageHeading } from "./learning";
import { DuelCards, Progress } from "./home";
export function Modal({
  title,
  description,
  trigger,
  children,
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close className="dialog-close" aria-label="Tutup">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Savings() {
  const s = useStore();
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(false);
  const [goal, setGoal] = useState(s.goal);
  const [target, setTarget] = useState(s.target);
  const [milestone, setMilestone] = useState(0);
  const progress = (s.savings / s.target) * 100;
  const add = () => {
    const { amount, milestone: reached } = recordSavings();
    if (amount <= 0) return;
    setMessage(`${rupiah(amount)} tercatat. Langkah kecilmu berarti!`);
    if (reached) setMilestone(reached);
  };
  return (
    <div className="page-container content-page" data-testid="savings">
      <PageHeading
        title="Tabungan impianku!"
        subtitle="Sedikit demi sedikit, kita mendekat ke impian. Ini simulasi pencatatan tabungan."
      />
      <div className="savings-layout">
        <div className="savings-illustration">
          <AnimatedSavingsJar value={s.savings} target={s.target} />
          <span className="status-pill">Impianku</span>
          <h2>{s.goal}</h2>
          <p className="muted">Tercatat dari target {rupiah(s.target)}</p>
          <div className="savings-amount">
            <AnimatedCounter value={s.savings} currency />
          </div>
          <Progress value={progress} />
          <p className="spacer-top">
            {Math.round(progress)}% tercapai ·{" "}
            {rupiah(Math.max(0, s.target - s.savings))} lagi
          </p>
          <Modal
            title="Ubah impianmu"
            description="Pilih tujuan yang realistis. Catatan tabunganmu tetap tersimpan."
            trigger={
              <button
                className="text-link"
                onClick={() => {
                  setGoal(s.goal);
                  setTarget(s.target);
                }}
              >
                Ubah target
              </button>
            }
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (target < s.savings || target < 2000) return;
                update((v) => {
                  v.goal = goal.trim();
                  v.target = target;
                });
                setMessage("Target baru tersimpan. Yuk, lanjutkan!");
                setMilestone(0);
              }}
            >
              <label className="field">
                Nama impian
                <input
                  required
                  maxLength={45}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </label>
              <label className="field">
                Target rupiah
                <input
                  type="number"
                  required
                  min={Math.max(2000, s.savings)}
                  max={10000000}
                  step={2000}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                />
                <small>Minimal sebesar tabungan yang sudah tercatat.</small>
              </label>
              <button className="button spacer-top" type="submit">
                Simpan target
              </button>
              {message.startsWith("Target") && (
                <p role="status" className="spacer-top">
                  {message}
                </p>
              )}
            </form>
          </Modal>
        </div>
        <div className="paper">
          <h2>Satu kotak, satu langkah</h2>
          <p className="muted spacer-top">
            {s.target === 100000
              ? "Setiap kotak mewakili Rp2.000."
              : "50 kotak menunjukkan persentase targetmu."}{" "}
            Warnai perjalananmu menuju impian!
          </p>
          <div
            className="savings-grid"
            role="group"
            aria-label={`${Math.floor(progress / 2)} dari 50 kotak terisi`}
          >
            {Array.from({ length: 50 }, (_, i) => (
              <SavingBox
                key={i}
                index={i}
                filled={i < Math.floor(progress / 2)}
              />
            ))}
          </div>
          <div className="savings-caption">
            <span>{Math.floor(progress / 2)} dari 50 kotak</span>
            <span>{Math.min(100, Math.round(progress))}% menuju impian</span>
          </div>
          <div className="actions-row">
            <button
              className="button"
              disabled={s.savings >= s.target}
              onClick={add}
            >
              <Plus size={18} /> Catat Tabungan +Rp2.000
            </button>
            <button className="text-link" onClick={() => setHistory(!history)}>
              {history ? "Tutup riwayat" : "Lihat riwayat"}
            </button>
          </div>
          {message && (
            <div role="status" className="feedback">
              {message}
            </div>
          )}
          {s.savings >= s.target && (
            <div className="feedback" style={{ position: "relative" }}>
              {milestone === 100 && <Confetti />}
              <strong>Yeay, targetmu tercapai! ★</strong>
              <p>Rayakan usahamu. Kamu boleh menentukan impian berikutnya.</p>
            </div>
          )}
          {milestone > 0 && milestone < 100 && (
            <div
              className="feedback milestone-feedback"
              role="status"
              key={milestone}
            >
              ★ {milestone}% tercapai! Sedikit demi sedikit, makin dekat dengan
              impian.
            </div>
          )}
          {history && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Tercatat</th>
                  </tr>
                </thead>
                <tbody>
                  {s.deposits.map((d, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(d.date).toLocaleDateString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })}
                      </td>
                      <td>{rupiah(d.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="mission-banner">
        <Mascot size="sm" emotion="saving" />
        <div>
          <h3>Hubungkan dengan workbook!</h3>
          <p>
            Catat tabunganmu di buku, isi kotak fisiknya, lalu cek progres di
            sini. Tidak ada uang yang disimpan atau ditransfer.
          </p>
        </div>
        <Link href="/workbook" className="text-link">
          Buka workbook <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
const badgeDesc = [
  "Selesaikan dunia Kenal Uang.",
  "Selesaikan tantangan menabung atau capai target.",
  "Selesaikan Misi Berbagi.",
  "Selesaikan dunia Rencana & Target.",
  "Selesaikan satu duel bersama teman.",
  "Selesaikan satu kuis.",
  "Jelajahi keenam dunia belajar.",
  "Selesaikan kuis Refleksi.",
];
export function Achievements() {
  const s = useStore();
  const reduce = useReducedMotion();
  return (
    <div className="page-container content-page">
      <PageHeading
        title="Koleksi prestasiku!"
        subtitle={`${s.badges.length} dari 8 lencana sudah menemani petualanganmu. Setiap langkah berarti.`}
      />
      <motion.div
        className="badge-grid"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {badges.map((badge, i) => {
          const earned = s.badges.includes(i);
          return (
            <Modal
              key={badge}
              title={badge}
              description={badgeDesc[i]}
              trigger={
                <motion.button
                  variants={reduce ? fadeIn : popIn}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  className={cn("badge-card", !earned && "locked")}
                >
                  <span className="badge-symbol">
                    {["★", "♧", "♥", "⚑", "♛", "✦", "✧", "★"][i]}
                  </span>
                  <h3>{badge}</h3>
                  <p>
                    {earned ? "✓ Sudah dikoleksi" : "Masih bisa dijelajahi"}
                  </p>
                </motion.button>
              }
            >
              <Mascot emotion={earned ? "trophy" : "encouraging"} />
              <p>
                {earned
                  ? "Lencana ini ada di koleksimu. Terus nikmati proses belajarmu!"
                  : "Yuk, coba aktivitasnya. Belajar sesuai langkahmu."}
              </p>
              <Link
                href={
                  i === 4
                    ? "/duel"
                    : i === 1
                      ? "/mini-games/menabung"
                      : "/materi"
                }
                className="button"
              >
                Jelajahi aktivitas <ArrowRight size={16} />
              </Link>
            </Modal>
          );
        })}
      </motion.div>
      <p className="muted spacer-top">
        Profil awal berisi lima lencana contoh untuk demonstrasi.
      </p>
    </div>
  );
}
export function Profile() {
  const s = useStore();
  const [saved, setSaved] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="page-container content-page">
      <PageHeading
        title="Paspor petualanganku"
        subtitle="Kenali langkah hebat yang sudah kamu ambil."
      />
      <div className="paper">
        <div className="profile-top">
          <span className="avatar-large">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={s.avatar}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={softSpring}
              >
                {["👦🏻", "👧🏻", "🧕🏻", "👦🏽"][s.avatar]}
              </motion.span>
            </AnimatePresence>
          </span>
          <div>
            <h1>{s.name}</h1>
            <p className="muted">
              Level {Math.floor(s.xp / 500) + 1} · Penjelajah Cerdas · Kelas 5A
              (demo)
            </p>
            <Progress value={(s.xp % 500) / 5} />
          </div>
        </div>
        <div className="profile-stats">
          {[
            [s.xp, "Total XP"],
            [s.stars, "Bintang"],
            [s.completed.length, "Dunia selesai"],
            [s.matches.length, "Duel dimainkan"],
          ].map(([n, label]) => (
            <div key={label}>
              <strong>
                <AnimatedCounter value={Number(n)} />
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <h3>Pilih avatarmu</h3>
        <div className="avatar-picker">
          {["👦🏻", "👧🏻", "🧕🏻", "👦🏽"].map((emoji, i) => (
            <button
              key={i}
              aria-label={`Avatar ${i + 1}`}
              aria-pressed={s.avatar === i}
              className={cn(s.avatar === i && "active")}
              onClick={() =>
                update((v) => {
                  v.avatar = i;
                })
              }
            >
              {emoji}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const nickname = String(
              new FormData(e.currentTarget).get("nickname") || "",
            ).trim();
            if (nickname) {
              update((v) => {
                v.name = nickname;
              });
              setSaved(true);
            }
          }}
          className="form-grid"
        >
          <label className="field">
            Nama panggilan
            <input
              key={s.name}
              name="nickname"
              defaultValue={s.name}
              maxLength={20}
              required
              onChange={() => setSaved(false)}
            />
            <small>Gunakan nama panggilan, bukan nama lengkap.</small>
          </label>
          <div className="actions-row">
            <button className="button">Simpan profil</button>
            {saved && <span role="status">Tersimpan ✓</span>}
          </div>
        </form>
      </div>
      <div className="paper spacer-top">
        <h2>Jejak belajarmu</h2>
        {topics.map((t) => (
          <div className="report-row" key={t.slug}>
            <Link href={`/materi/${t.slug}`}>{t.short}</Link>
            <Progress value={s.completed.includes(t.slug) ? 100 : 0} />
            <span>{s.completed.includes(t.slug) ? "100%" : "0%"}</span>
          </div>
        ))}
        <Link className="text-link spacer-top" href="/pencapaian">
          Lihat semua lencana <ArrowRight size={16} />
        </Link>
      </div>
      <div className="spacer-top">
        <AlertDialog.Root>
          <AlertDialog.Trigger className="danger-button">
            Reset Data Demo
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="dialog-overlay" />
            <AlertDialog.Content className="dialog-content">
              <AlertDialog.Title>Mulai ulang data demo?</AlertDialog.Title>
              <AlertDialog.Description>
                Progres, tabungan, dan room di browser ini akan kembali ke data
                contoh awal.
              </AlertDialog.Description>
              <div className="actions-row">
                <AlertDialog.Cancel className="button button-white">
                  Batal
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  className="danger-button"
                  onClick={resetDemo}
                >
                  Ya, reset demo
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
}
export function Leaderboard() {
  const s = useStore();
  const [team, setTeam] = useState(false);
  const reduce = useReducedMotion();
  const people = [
    { name: "Siti", xp: 2680, avatar: "🧕🏻" },
    { name: s.name, xp: s.xp, avatar: ["👦🏻", "👧🏻", "🧕🏻", "👦🏽"][s.avatar] },
    { name: "Budi", xp: 2210, avatar: "👦🏽" },
    { name: "Aisyah", xp: 1960, avatar: "👧🏻" },
    { name: "Fajar", xp: 1840, avatar: "👦🏻" },
  ].sort((a, b) => b.xp - a.xp);
  const teams = s.matches
    .flatMap((m) =>
      m.names.map((name, i) => ({
        name,
        xp: m.scores[i],
        avatar: i === 0 ? "🌿" : "☀️",
      })),
    )
    .sort((a, b) => b.xp - a.xp);
  const rows = team ? teams : people;
  return (
    <div className="page-container content-page">
      <PageHeading
        title="Papan juara cerdas!"
        subtitle="Setiap langkah belajar adalah pencapaian. Ini papan kelas contoh, bukan data siswa sungguhan."
      />
      <div className="tabs">
        <button
          className={cn("tab", !team && "active")}
          onClick={() => setTeam(false)}
        >
          Individu · XP
        </button>
        <button
          className={cn("tab", team && "active")}
          onClick={() => setTeam(true)}
        >
          Hasil duel · Poin
        </button>
      </div>
      <QuestionTransition id={team ? "teams" : "people"}>
        {rows.length === 0 ? (
          <div className="empty-state">
            <Mascot emotion="encouraging" />
            <h2>Belum ada duel selesai</h2>
            <p>Ajak teman untuk membuat cerita pertama kalian!</p>
            <Link href="/duel" className="button">
              Mulai duel
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              className="podium"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {[1, 0, 2]
                .filter((i) => rows[i])
                .map((i) => (
                  <motion.div
                    layout
                    className="podium-place"
                    key={i}
                    variants={reduce ? fadeIn : popIn}
                  >
                    <span>{rows[i].avatar}</span>
                    <strong>{rows[i].name}</strong>
                    <div className="podium-block">
                      {i + 1}
                      <small>
                        <AnimatedCounter value={rows[i].xp} />{" "}
                        {team ? "poin" : "XP"}
                      </small>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
            <div className="paper table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Urutan</th>
                    <th>Petualang</th>
                    <th>{team ? "Poin pertandingan" : "Level"}</th>
                    <th>{team ? "Semangat" : "Total XP"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p, i) => (
                    <tr key={i} className={cn(p.name === s.name && "current")}>
                      <td>{i + 1}</td>
                      <td>
                        <strong>
                          {p.avatar} {p.name}
                        </strong>
                        {p.name === s.name ? " (kamu)" : ""}
                      </td>
                      <td>{team ? p.xp : Math.floor(p.xp / 500) + 1}</td>
                      <td>
                        {team ? "Terus belajar!" : p.xp.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </QuestionTransition>
      <div className="note spacer-top">
        <Trophy size={21} /> Kemajuanmu lebih penting daripada urutanmu. Kalian
        semua hebat!
      </div>
    </div>
  );
}
const noopSubscribe = () => () => {};
export function useOrigin() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );
}
export function Workbook() {
  const origin = useOrigin();
  return (
    <div className="page-container content-page">
      <PageHeading
        title="Dari buku, lanjut berpetualang!"
        subtitle="Pindai kode pada workbook untuk membuka dunia belajarmu. Kamu juga bisa mengetuk tombolnya."
      />
      <div className="qr-grid">
        {topics.map((t, i) => (
          <div className="qr-card" key={t.slug}>
            <span className="status-pill">Workbook · Dunia {i + 1}</span>
            <QRCodeSVG
              value={`${origin}/materi/${t.slug}`}
              size={145}
              marginSize={2}
            />
            <h3>{t.short}</h3>
            <Link href={`/materi/${t.slug}`} className="button button-small">
              Buka materi <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
      <div className="note spacer-top">
        Kode mengarah ke alamat situs ini. Alamat localhost tidak dapat dibuka
        langsung dari perangkat lain. Pencatatan buku dan uang dilakukan
        sendiri, tanpa verifikasi otomatis.
      </div>
    </div>
  );
}
export function Duel() {
  return (
    <div className="page-container content-page" data-testid="duel-selection">
      <PageHeading
        title="Pilih mode duelmu!"
        subtitle="Bertukar ide, uji pengetahuan, dan rayakan usaha bersama."
      />
      <DuelCards />
      <div className="mission-banner">
        <Mascot size="sm" emotion="encouraging" />
        <div>
          <h3>Sudah punya kode room?</h3>
          <p>Masuk ke timmu dan bersiap menjawab tantangan Koini.</p>
        </div>
        <Link href="/join" className="button button-small">
          Gabung Room <ArrowRight size={16} />
        </Link>
      </div>
      <div className="note spacer-top">
        Demo kelas tersinkron antar-tab pada browser dan alamat situs yang sama.
        Belum mendukung permainan antarperangkat melalui jaringan.
      </div>
    </div>
  );
}
export function Teacher({ section = "dashboard" }: { section?: string }) {
  const s = useStore();
  const [className, setClassName] = useState("Kelas 5A");
  const [filter, setFilter] = useState("all");
  const title =
    section === "kelas"
      ? "Kelas petualang"
      : section === "laporan"
        ? "Laporan belajar"
        : section === "soal"
          ? "Bank soal"
          : section === "admin"
            ? "Ikhtisar konten"
            : "Selamat datang, Bapak / Ibu Guru";
  return (
    <div className="page-container content-page">
      <PageHeading
        title={title}
        subtitle="Ruang pendamping belajar · Seluruh identitas dan statistik kelas adalah data demonstrasi."
      />
      <div className="actions-row">
        <Link className="button" href="/guru/game/buat">
          Buat Game Baru <Plus size={17} />
        </Link>
        <Link className="button button-white" href="/guru/kelas">
          Kelola kelas
        </Link>
        <Link className="text-link" href="/guru/laporan">
          Lihat laporan <ArrowRight size={17} />
        </Link>
        <Link className="text-link" href="/guru/soal">
          Buka bank soal
        </Link>
      </div>
      {section === "kelas" ? (
        <>
          <div className="tabs spacer-top">
            {["Kelas 4A", "Kelas 5A", "Kelas 6A"].map((c) => (
              <button
                className={cn("tab", className === c && "active")}
                key={c}
                onClick={() => setClassName(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="paper spacer-top">
            <h2>{className}</h2>
            <p className="muted">5 profil fiktif · Kelas contoh</p>
            <table>
              <thead>
                <tr>
                  <th>Nama panggilan</th>
                  <th>Peran</th>
                </tr>
              </thead>
              <tbody>
                {["Ahmad", "Siti", "Budi", "Aisyah", "Fajar"].map((n) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>Petualang demo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : section === "soal" || section === "admin" ? (
        <>
          <div className="dashboard-stat-grid">
            <div>
              Materi<strong>6</strong>
            </div>
            <div>
              Soal dengan pembahasan<strong>48</strong>
            </div>
            <div>
              Mini-games<strong>4</strong>
            </div>
          </div>
          <label className="field">
            Filter topik
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Semua topik</option>
              {topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.short}
                </option>
              ))}
            </select>
          </label>
          <div className="paper spacer-top">
            {questions
              .filter((q) => filter === "all" || q.topic === filter)
              .map((q, i) => (
                <details key={q.id} className="question-detail">
                  <summary>
                    {i + 1}. {q.text}
                  </summary>
                  <p>Jawaban: {q.options[q.correct]}</p>
                  <p className="muted">{q.explanation}</p>
                </details>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="dashboard-stat-grid">
            <div>
              Kelas demo aktif<strong>Kelas 5A</strong>
            </div>
            <div>
              Profil contoh<strong>5</strong>
            </div>
            <div>
              Duel selesai di browser<strong>{s.matches.length}</strong>
            </div>
          </div>
          <div className="paper">
            <h2>
              {section === "laporan"
                ? "Progres profil demo"
                : "Jejak belajar Ahmad"}
            </h2>
            <p className="muted spacer-top">
              Progres ini mengikuti aktivitas profil pada browser ini.
            </p>
            {topics.map((t) => (
              <div className="report-row" key={t.slug}>
                <span>{t.short}</span>
                <Progress value={s.completed.includes(t.slug) ? 100 : 0} />
                <span>{s.completed.includes(t.slug) ? "100%" : "0%"}</span>
              </div>
            ))}
          </div>
          <div className="paper spacer-top">
            <h2>Pertandingan terbaru</h2>
            {s.matches.length ? (
              s.matches.map((m) => (
                <div className="report-row" key={m.id || m.code}>
                  <Link href={`/guru/game/${m.code}`}>{m.title}</Link>
                  <span>{m.names.join(" vs ")}</span>
                  <span>{m.scores.join(":")}</span>
                </div>
              ))
            ) : (
              <p className="muted spacer-top">
                Belum ada pertandingan selesai. Buat game untuk memulai demo
                kelas.
              </p>
            )}
            {Object.values(s.rooms)
              .filter((r) => r.status !== "finished")
              .map((r) => (
                <p className="spacer-top" key={r.code}>
                  <Link className="text-link" href={`/guru/game/${r.code}`}>
                    Lanjutkan room {r.code} <ArrowRight size={16} />
                  </Link>
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
export function About() {
  return (
    <div className="page-container content-page narrow">
      <PageHeading title="Belajar uang dengan gembira" />
      <div className="paper">
        <Mascot />
        <h2>Duel Cerdas — Jago Atur Uang</h2>
        <p className="spacer-top">
          Petualangan literasi keuangan dan nilai berbagi untuk anak kelas 4–6
          SD. Belajar bersama Koini melalui enam dunia, latihan, dan duel kelas.
        </p>
        <h3 className="spacer-top">Privasi dalam demo</h3>
        <p className="spacer-top">
          Nama panggilan, progres, dan catatan simulasi disimpan di browser ini.
          Tidak ada akun, transaksi uang, atau layanan bank. Hindari mengisi
          nama lengkap atau informasi pribadi. Data bisa dihapus lewat Reset
          Data Demo di profil.
        </p>
        <h3 className="spacer-top">Untuk pendamping</h3>
        <p className="spacer-top">
          Gunakan cerita sebagai bahan diskusi. Kebutuhan tiap keluarga berbeda.
          Ajak anak menabung dan berbagi sesuai kemampuan, tanpa membandingkan
          keadaan ekonomi.
        </p>
        <Link href="/guru/dashboard" className="button spacer-top">
          Buka ruang guru
        </Link>
      </div>
    </div>
  );
}
