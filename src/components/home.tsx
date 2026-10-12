"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Flag,
  Gamepad2,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { topics, Topic } from "@/data/content";
import { AdventureArt, Mascot, TopicArt } from "./art";
import { cn } from "@/lib/utils";
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label || "Progres"}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        style={{
          transform: `scaleX(${Math.min(100, Math.max(0, value)) / 100})`,
        }}
      />
    </div>
  );
}
export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const s = useStore();
  const done = s.completed.includes(topic.slug);
  return (
    <Link
      href={`/materi/${topic.slug}`}
      className={cn("topic-card", topic.color)}
    >
      <div className="topic-card-top">
        <span>Dunia {index + 1}</span>
        <span
          className="topic-stars"
          aria-label={done ? "3 bintang" : "Belum selesai"}
        >
          {done ? "★★★" : "☆☆☆"}
        </span>
      </div>
      <TopicArt index={index} />
      <div className="topic-card-body">
        <h3>{topic.short}</h3>
        <p>{topic.description}</p>
        <div className="topic-card-bottom">
          <span>
            {done ? (
              <>
                <Check size={14} /> Selesai
              </>
            ) : (
              <>Mulai jelajahi</>
            )}
          </span>
          <span className="round-arrow">
            <ArrowRight size={19} />
          </span>
        </div>
      </div>
    </Link>
  );
}
export function DuelCards() {
  return (
    <div className="duel-cards">
      <Link href="/guru/game/buat?mode=individual" className="duel-card blue">
        <div>
          <span className="duel-label">
            <Swords size={16} /> Satu lawan satu
          </span>
          <h3>Duel Individu</h3>
          <p>Adu pengetahuan, jadi makin hebat bersama!</p>
          <span className="text-link">
            Mulai duel <ArrowRight size={16} />
          </span>
        </div>
        <div className="duel-characters">
          <span>👦🏻</span>
          <b>VS</b>
          <span>👧🏻</span>
        </div>
      </Link>
      <Link href="/guru/game/buat?mode=team" className="duel-card peach">
        <div>
          <span className="duel-label">
            <Users size={16} /> Kompak lebih seru
          </span>
          <h3>Duel Tim</h3>
          <p>Satukan ide, raih bintang bersama timmu!</p>
          <span className="text-link">
            Bentuk timmu <ArrowRight size={16} />
          </span>
        </div>
        <div className="duel-characters">
          <span>🧕🏻</span>
          <b>VS</b>
          <span>👦🏽</span>
        </div>
      </Link>
    </div>
  );
}
export function Home() {
  const s = useStore();
  return (
    <>
      <section className="hero" data-testid="home-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-label">
              <Sparkles size={15} /> Petualangan kecil, masa depan hebat
            </span>
            <h1>
              Jago atur uang,
              <br />
              seru petualangannya!
            </h1>
            <p>
              Belajar menabung, belanja bijak, dan berbagi.
              <br className="desktop-break" /> Bersama Koini, jadi jagoan
              finansial sambil bermain!
            </p>
            <div className="hero-actions">
              <Link className="button" href="/materi">
                <BookOpen size={20} /> Mulai Petualangan{" "}
                <ArrowRight size={18} />
              </Link>
              <Link className="button button-white" href="/duel">
                <Swords size={20} /> Main Duel
              </Link>
            </div>
            <div className="hero-note">
              <span>
                <Check size={13} />
              </span>{" "}
              Untuk jagoan kelas 4–6 SD <i /> Belajar sesuai langkahmu
            </div>
          </div>
          <AdventureArt />
        </div>
        <svg
          className="hero-wave"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 28Q360 65 720 28T1440 28V50H0Z"
            fill="var(--background)"
          />
        </svg>
      </section>
      <div className="page-container home-content">
        <section className="welcome-panel">
          <div className="welcome-person">
            <span className="avatar-large">
              {["👦🏻", "👧🏻", "🧕🏻", "👦🏽"][s.avatar]}
            </span>
            <div>
              <h2>
                Halo, {s.name}! <span className="wave-hand">✦</span>
              </h2>
              <p>Siap menambah cerita hebat hari ini?</p>
            </div>
          </div>
          <div className="welcome-progress">
            <div>
              <strong>
                Level {Math.floor(s.xp / 500) + 1}{" "}
                <span>Penjelajah Cerdas</span>
              </strong>
              <small>{s.xp % 500} / 500 XP</small>
            </div>
            <Progress value={(s.xp % 500) / 5} />
          </div>
          <div className="welcome-stat">
            <Star fill="#ffbf47" color="#d99721" />
            <strong>
              {s.stars}
              <small>Bintang</small>
            </strong>
          </div>
          <div className="welcome-stat">
            <Trophy color="#e39d39" />
            <strong>
              {s.badges.length}
              <small>Lencana</small>
            </strong>
          </div>
          <Link
            className="welcome-continue"
            href="/materi/kebutuhan-keinginan"
            aria-label="Lanjut belajar"
          >
            <ChevronRight />
          </Link>
        </section>
        <section className="world-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                <Flag size={16} /> Setiap dunia, pengetahuan baru
              </span>
              <h2>Mau jelajah ke mana hari ini?</h2>
              <p>Enam dunia seru untuk jadi makin cerdas mengatur uang.</p>
            </div>
            <Link className="text-link" href="/materi">
              Lihat semua materi <ArrowRight size={17} />
            </Link>
          </div>
          <div className="topic-grid">
            {topics.map((topic, index) => (
              <TopicCard key={topic.slug} topic={topic} index={index} />
            ))}
          </div>
        </section>
        <section className="mission-banner">
          <span className="mission-icon">
            <Star size={27} fill="#ffcc60" />
          </span>
          <div>
            <h3>Misi hari ini: jadi pembeli bijak!</h3>
            <p>
              Pisahkan kebutuhan dan keinginan. Yuk, coba satu tantangan kecil.
            </p>
          </div>
          <span className="xp-pill">+50 XP</span>
          <Link
            href="/mini-games/kebutuhan"
            className="button button-small button-white"
          >
            Mulai misi <ArrowRight size={16} />
          </Link>
        </section>
        <section className="duel-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                <Gamepad2 size={17} /> Belajar bareng, serunya bareng
              </span>
              <h2>Siap untuk duel cerdas?</h2>
              <p>
                Tantang temanmu. Menang atau belajar, kalian sama-sama hebat!
              </p>
            </div>
            <Link href="/join" className="text-link">
              Punya kode room? <ArrowRight size={16} />
            </Link>
          </div>
          <DuelCards />
        </section>
        <section className="journey-strip">
          {[
            [BookOpen, "Pilih duniamu", "Ikuti rasa ingin tahumu"],
            [Gamepad2, "Belajar & bermain", "Coba, pahami, ulangi"],
            [Swords, "Duel bersama", "Berbagi keseruan"],
            [Star, "Raih bintang", "Rayakan setiap langkah"],
          ].map(([Icon, title, desc], i) => {
            const I = Icon as typeof Star;
            return (
              <div key={i}>
                <span className="journey-number">{i + 1}</span>
                <I size={26} />
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </div>
            );
          })}
        </section>
        <section className="closing-banner">
          <Mascot emotion="trophy" />
          <div>
            <h2>Langkah kecilmu layak dirayakan.</h2>
            <p>Kumpulkan pengalaman, bintang, dan lencana petualanganmu.</p>
            <Link href="/pencapaian" className="text-link">
              Lihat koleksi prestasiku <ArrowRight size={17} />
            </Link>
          </div>
          <div className="badge-preview">
            <span>★</span>
            <span>♛</span>
            <span>✦</span>
          </div>
        </section>
      </div>
    </>
  );
}
