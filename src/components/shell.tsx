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
import { AnimatedCounter, AnimatedPage } from "./game-motion";
import { cn } from "@/lib/utils";
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="KHALIFA beranda">
      <span className="brand-mark khalifa-brand-mark">
        <svg viewBox="0 0 256 256" width="30" height="30" aria-hidden="true" fill="none">
          <rect x="44" y="32" width="34" height="192" rx="17" fill="#FFFFFF"/>
          <path d="M 88 126 C 104 110 128 70 178 44 C 196 34 212 42 212 58 C 212 76 198 100 176 116 C 146 138 116 148 94 148 Z" fill="#6EE7B7"/>
          <path d="M 88 136 C 114 148 144 176 172 208 C 182 220 174 228 160 228 C 138 228 116 208 98 184 C 86 168 84 148 88 136 Z" fill="#FFFFFF"/>
          <polygon points="178,108 181.8,119.2 192.1,110.1 187.2,122.9 200.7,121.7 190.4,130.8 202.1,137.9 188.7,139.1 193.6,151.9 183.3,142.8 178,156 172.7,142.8 162.4,151.9 167.3,139.1 153.9,137.9 165.6,130.8 155.3,121.7 168.8,122.9 163.9,110.1 174.2,119.2" fill="#FBBF24"/>
        </svg>
      </span>
      <span>
        KHALIFA<span className="brand-green">.id</span>
        <small>SDN 02 JEMBER KIDUL</small>
      </span>
    </Link>
  );
}
const nav = [
  ["/", "Beranda", House],
  ["/materi", "Dunia Belajar", BookOpen],
  ["/mini-games", "Mini Games", Gamepad2],
  ["/tabunganku", "Tabunganku", Wallet],
  ["/guru/dashboard", "Ruang Guru", GraduationCap],
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
                <AnimatedCounter value={s.stars} />
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
        {immersive ? (
          children
        ) : (
          <AnimatedPage route={path}>{children}</AnimatedPage>
        )}
      </main>
      {!immersive && (
        <>
          <footer className="footer">
            <Logo />
            <p>
              KHALIFA: Ekosistem Workbook, Gamifikasi, dan Pelatihan Guru untuk
              Meningkatkan Literasi Keuangan Syariah Siswa Sekolah Dasar di SDN
              02 Jember Kidul.
            </p>
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
            KHALIFA × SDN 02 Jember Kidul • BSI Maslahat • Seluruh tabungan dan duel adalah simulasi edukatif.
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
      <Mascot emotion="thinking" animated />
      <h1>{title}</h1>
      <p>{text}</p>
      <Link className="button" href="/">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
