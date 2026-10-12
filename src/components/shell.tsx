"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Gamepad2,
  House,
  Trophy,
  Star,
  ChevronRight,
  GraduationCap,
  VolumeX,
  Volume2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { MotionConfig } from "motion/react";
import { useStore } from "@/lib/store";
import { Mascot } from "./art";
import { RewardFeedback } from "./reward-feedback";
import { cn } from "@/lib/utils";
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Duel Cerdas beranda">
      <span className="brand-mark">
        d<span>c</span>
        <Star size={11} fill="currentColor" />
      </span>
      <span>
        duel<span className="brand-green">cerdas</span>
        <small>JAGO ATUR UANG!</small>
      </span>
    </Link>
  );
}
const nav = [
  ["/", "Beranda", House],
  ["/materi", "Dunia Belajar", BookOpen],
  ["/mini-games", "Mini Games", Gamepad2],
  ["/tabunganku", "Tabunganku", Wallet],
  ["/leaderboard", "Papan Juara", Trophy],
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const s = useStore();
  const [sound, setSound] = useState(false);
  const immersive = path.startsWith("/tv/") || path.startsWith("/play/");
  const teacher = path.startsWith("/guru") || path.startsWith("/admin");
  const toggleSound = () => {
    setSound(!sound);
    if (!sound) {
      try {
        const ctx = new AudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.value = 0.035;
        o.frequency.value = 660;
        o.start();
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.stop(ctx.currentTime + 0.2);
        o.onended = () => ctx.close();
      } catch {}
    }
  };
  return (
    <MotionConfig reducedMotion="user">
      <RewardFeedback />
      <a className="skip-link" href="#main-content">
        Langsung ke isi
      </a>
      {!immersive && (
        <header className="site-header">
          <div className="header-inner">
            <Logo />
            <nav className="desktop-nav" aria-label="Navigasi utama">
              {nav.map(([href, label, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "nav-link",
                    (path === href ||
                      (href !== "/" && path.startsWith(href))) &&
                      "active",
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="header-player">
              <Link href="/pencapaian" className="star-counter">
                <Star size={19} fill="currentColor" />
                {s.stars}
              </Link>
              <span className="header-divider" />
              <Link
                href="/profil"
                className="avatar-small"
                aria-label="Buka profil"
              >
                {["👦🏻", "👧🏻", "🧕🏻", "👦🏽"][s.avatar]}
              </Link>
              <Link href="/profil" className="player-name">
                {s.name}
                <small>Level {Math.floor(s.xp / 500) + 1}</small>
              </Link>
              <ChevronRight size={16} />
            </div>
          </div>
        </header>
      )}
      {!immersive && teacher && (
        <nav className="teacher-nav">
          <GraduationCap size={20} />
          <strong>Ruang Guru</strong>
          {[
            ["dashboard", "Ringkasan"],
            ["kelas", "Kelas"],
            ["laporan", "Laporan"],
            ["soal", "Bank soal"],
          ].map(([slug, label]) => (
            <Link key={slug} href={`/guru/${slug}`}>
              {label}
            </Link>
          ))}
          <Link href="/admin">Admin</Link>
          <span>Data demo</span>
        </nav>
      )}
      <main id="main-content" className={cn(immersive && "immersive-main")}>
        {children}
      </main>
      {!immersive && (
        <>
          <footer className="footer">
            <Logo />
            <p>Belajar uang, raih bintang, jadi anak cerdas!</p>
            <Link href="/workbook">Workbook</Link>
            <Link href="/guru/dashboard">Ruang Guru</Link>
            <Link href="/tentang">Tentang & privasi</Link>
            <button
              className="sound-button"
              onClick={toggleSound}
              aria-label={sound ? "Matikan suara" : "Aktifkan suara"}
            >
              {sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
            </button>
          </footer>
          <div className="demo-footer">
            Petualangan edukasi • Semua poin dan tabungan adalah simulasi.
          </div>
          <nav className="mobile-nav" aria-label="Navigasi seluler">
            {nav.map(([href, label, Icon]) => (
              <Link
                key={href}
                href={href}
                className={cn(path === href && "active")}
              >
                <Icon size={21} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </MotionConfig>
  );
}
export function EmptyState({
  title = "Petualangan belum ditemukan",
  text = "Yuk, kembali dan pilih petualangan lainnya.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty-state">
      <Mascot emotion="thinking" />
      <h1>{title}</h1>
      <p>{text}</p>
      <Link className="button" href="/">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
