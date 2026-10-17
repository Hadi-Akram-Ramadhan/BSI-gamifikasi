"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, BookOpen, Heart, Plus, Sparkles, Trophy, Wallet, X } from "lucide-react";
import { badges, rupiah, topics, questions } from "@/data/content";
import { recordSavings, update, useStore } from "@/lib/store";
import { motion, useReducedMotion } from "motion/react";
import {
  AnimatedCounter,
  AnimatedSavingsJar,
  SavingBox,
} from "./game-motion";
import { fadeIn, popIn, staggerContainer } from "@/lib/motion";
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
  return <Achievements />;
}
export function Leaderboard() {
  const s = useStore();
  const reduce = useReducedMotion();
  const rows = s.matches.flatMap((m) =>
    m.names.map((name, i) => ({
      name,
      xp: m.scores[i],
      avatar: i === 0 ? "🌿" : "☀️",
      title: m.title,
    })),
  ).sort((a, b) => b.xp - a.xp);

  return (
    <div className="page-container content-page">
      <PageHeading
        title="Papan Juara Duel Cerdas TV"
        subtitle="Pilar 2: Skor dan apresiasi pertandingan kuis interaktif kelas SDN 02 Jember Kidul."
      />
      {rows.length === 0 ? (
        <div className="empty-state">
          <Mascot emotion="encouraging" />
          <h2>Belum Ada Pertandingan Selesai</h2>
          <p>
            Jalankan duel cerdas di Smart TV kelas untuk melihat hasil pertandingan tim dan siswa di sini.
          </p>
          <Link href="/duel" className="button">
            Mulai Duel Cerdas
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
                      <AnimatedCounter value={rows[i].xp} /> Poin
                    </small>
                  </div>
                </motion.div>
              ))}
          </motion.div>
          <div className="paper table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Tim / Peserta</th>
                  <th>Pertandingan</th>
                  <th>Skor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>
                        {p.avatar} {p.name}
                      </strong>
                    </td>
                    <td>{p.title}</td>
                    <td>{p.xp.toLocaleString("id-ID")} poin</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="note spacer-top">
        <Trophy size={21} /> Seluruh poin dihitung secara real-time dari sesi Duel Cerdas Smart TV di kelas.
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
        title="Smart Workbook KHALIFA"
        subtitle="Pilar 1: Hubungkan binder fisik 3 Saku Barakah dengan modul petualangan digital di SDN 02 Jember Kidul."
      />

      <div className="pillars-grid spacer-bottom" style={{ marginBottom: "2.5rem" }}>
        <div className="pillar-card pillar-workbook">
          <div className="pillar-top">
            <span className="pillar-badge">Saku 1</span>
            <div className="pillar-icon-box bg-mint">
              <Wallet size={22} />
            </div>
          </div>
          <h3>Saku Hajat</h3>
          <p>
            Alokasi kebutuhan primer sekolah: buku tulis, pensil, dan ongkos harian. Mengajarkan disiplin membedakan kebutuhan dari keinginan.
          </p>
          <div className="pillar-tags">
            <span>🎒 Kebutuhan Pokok</span>
            <span>📝 Perlengkapan</span>
          </div>
        </div>

        <div className="pillar-card pillar-gamification">
          <div className="pillar-top">
            <span className="pillar-badge">Saku 2</span>
            <div className="pillar-icon-box bg-blue">
              <Sparkles size={22} />
            </div>
          </div>
          <h3>Saku Impian</h3>
          <p>
            Target tabungan jangka menengah Rp100.000 dengan milestone 50 stiker (Rp2.000/stiker) di lembar fisik binder murid.
          </p>
          <div className="pillar-tags">
            <span>🎯 Target Rp100.000</span>
            <span>🪙 50 Stiker</span>
          </div>
          <Link href="/tabunganku" className="pillar-link">
            Cek Tabungan Digital <ArrowRight size={15} />
          </Link>
        </div>

        <div className="pillar-card pillar-teacher">
          <div className="pillar-top">
            <span className="pillar-badge">Saku 3</span>
            <div className="pillar-icon-box bg-peach">
              <Heart size={22} />
            </div>
          </div>
          <h3>Saku Sedekah</h3>
          <p>
            Pembiasaan berbagi infak dan sedekah sukarela. Mengakar pada nilai kepedulian sosial Islam bersama inisiatif BSI Maslahat.
          </p>
          <div className="pillar-tags">
            <span>🤲 ZISWAF</span>
            <span>🤝 BSI Maslahat</span>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="section-kicker">
            <BookOpen size={16} /> Dynamic QR Code Bab Materi
          </span>
          <h2>Pindai Bab Belajar</h2>
          <p>
            Gunakan kamera ponsel atau tablet untuk langsung membuka tantangan interaktif dari lembar fisik binder KHALIFA.
          </p>
        </div>
      </div>

      <div className="qr-grid">
        {topics.map((t, i) => (
          <div className="qr-card" key={t.slug}>
            <span className="status-pill">Workbook · Bab {i + 1}</span>
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
        Kode QR mengarah langsung ke modul belajar KHALIFA SDN 02 Jember Kidul. Seluruh catatan fisik dapat disinkronkan melalui simulasi Tabunganku dan arena Duel Cerdas.
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
  const [filter, setFilter] = useState("all");
  const title =
    section === "laporan"
      ? "Laporan Capaian Literasi Syariah"
      : section === "soal"
        ? "Bank Soal Finansial Syariah"
        : section === "admin"
          ? "Ikhtisar Konten & Modul"
          : "Portal & Panduan Fasilitator Guru SDN 02 Jember Kidul";
  return (
    <div className="page-container content-page">
      <PageHeading
        title={title}
        subtitle="Pilar 3: Pelatihan & Panduan Guru SDN 02 Jember Kidul · Operasional Gamifikasi TV & Integrasi Workbook."
      />
      <div className="actions-row">
        <Link className="button" href="/guru/game/buat">
          Buat Arena TV <Plus size={17} />
        </Link>
        <Link className="button button-white" href="/guru/soal">
          Bank Soal
        </Link>
        <Link className="text-link" href="/workbook">
          Modul Workbook <ArrowRight size={17} />
        </Link>
        <Link className="text-link" href="/guru/laporan">
          Laporan Kurikulum
        </Link>
      </div>
      {section === "soal" || section === "admin" ? (
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
              Arena TV Cerdas<strong>Siap (&lt; 2 mnt)</strong>
            </div>
            <div>
              Bank Soal Kurasi<strong>48</strong>
            </div>
            <div>
              Duel Selesai<strong>{s.matches.length}</strong>
            </div>
          </div>
          <div className="paper">
            <h2>Panduan Cepat Guru (SOP Fasilitator Kelas)</h2>
            <p className="muted spacer-top">
              Dirancang untuk kemudahan wali kelas tanpa beban administrasi akun atau pendataan murid:
            </p>
            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              <div style={{ padding: "14px", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <strong>1. Buat Room TV (&lt; 2 Menit)</strong>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Klik &quot;Buat Arena TV&quot;, pilih topik atau acak semua materi, lalu tampilkan layar <code>/tv/[kode]</code> di Smart TV / Proyektor kelas.
                </p>
              </div>
              <div style={{ padding: "14px", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <strong>2. Siswa Masuk Instan (Zero-Friction)</strong>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Siswa membuka <code>/join</code> dari gawai kelas/pribadi, masukkan 6 digit PIN room dan pilih Tim Hijau (BSI) atau Tim Oranye (Maslahat). Tanpa email, password, atau registrasi.
                </p>
              </div>
              <div style={{ padding: "14px", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <strong>3. Refleksi &amp; Stempel Workbook</strong>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Setelah duel selesai, guru memandu refleksi nilai syariah (menabung, sedekah, membedakan kebutuhan) dan meminta siswa memberi stempel progres di Smart Workbook fisik KHALIFA.
                </p>
              </div>
            </div>
          </div>
          <div className="paper spacer-top">
            <h2>
              {section === "laporan"
                ? "Capaian Kurikulum 6 Dunia Belajar"
                : "Modul Literasi Finansial Syariah"}
            </h2>
            <p className="muted spacer-top">
              Cakupan materi interaktif yang terhubung langsung dengan Dynamic QR Code Smart Workbook:
            </p>
            {topics.map((t) => (
              <div className="report-row" key={t.slug}>
                <span>{t.short}</span>
                <Progress value={s.completed.includes(t.slug) ? 100 : 0} />
                <span>{s.completed.includes(t.slug) ? "Tersedia" : "Tersedia"}</span>
              </div>
            ))}
          </div>
          <div className="paper spacer-top">
            <h2>Riwayat Pertandingan TV Kelas</h2>
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
                Belum ada pertandingan selesai. Klik &quot;Buat Arena TV&quot; untuk memulai sesi kuis kelas.
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
      <PageHeading title="Tentang Ekosistem KHALIFA" />
      <div className="paper">
        <Mascot />
        <h2>KHALIFA: Ekosistem Literasi Keuangan Syariah</h2>
        <span className="status-pill spacer-top">SDN 02 Jember Kidul × BSI Maslahat</span>
        <p className="spacer-top">
          KHALIFA adalah ekosistem terintegrasi yang memadukan <strong>Smart Workbook Saku Barakah (Offline Habit)</strong>,
          <strong> Gamifikasi Duel Cerdas Smart TV (Digital Classroom)</strong>, dan <strong>Pelatihan Guru (Capacity Building)</strong>
          untuk meningkatkan indeks literasi dan inklusi keuangan syariah bagi siswa sekolah dasar di SDN 02 Jember Kidul.
        </p>
        <h3 className="spacer-top">Tiga Nilai Beyond Banking BSI</h3>
        <p className="spacer-top">
          1. <strong>Sahabat Finansial:</strong> Melatih pembedaan hajat (kebutuhan) vs syahwat (keinginan), target tabungan berkah, dan pengenalan Tabungan SimPel BSI iB.<br/>
          2. <strong>Sahabat Sosial:</strong> Menumbuhkan empati berbagi sedekah dan infak Jum&apos;at secara rutin melalui kompartemen saku khusus.<br/>
          3. <strong>Sahabat Spiritual:</strong> Menanamkan nilai kejujuran, harta barakah, dan sifat qana&apos;ah sejak dini.
        </p>
        <h3 className="spacer-top">Privasi & Simulasi Belajar</h3>
        <p className="spacer-top">
          Nama panggilan, progres bintang, dan catatan simulasi tabungan disimpan secara aman di browser lokal.
          Seluruh mata uang dan transaksi dalam platform ini adalah media edukasi interaktif.
        </p>
        <Link href="/guru/dashboard" className="button spacer-top">
          Buka Portal Ruang Guru
        </Link>
      </div>
    </div>
  );
}
