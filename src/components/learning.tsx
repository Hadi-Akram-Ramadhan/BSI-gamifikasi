"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { topics, questions, Question } from "@/data/content";
import { completeLesson, reward, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Mascot, TopicArt } from "./art";
import { Progress, TopicCard } from "./home";
import { EmptyState } from "./shell";
export function PageHeading({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: string;
}) {
  return (
    <div className="page-heading">
      {back && (
        <Link href={back} className="back-link">
          <ArrowLeft size={16} /> Kembali
        </Link>
      )}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${i * 4.2}%`,
            animationDelay: `${(i % 5) * 0.09}s`,
            transform: `rotate(${i * 31}deg)`,
          }}
        />
      ))}
    </div>
  );
}
export function RewardScreen({
  title = "Wah, hebat sekali!",
  description = "Petualangan kecil, pengetahuan baru.",
  earned = true,
  onReplay,
}: {
  title?: string;
  description?: string;
  earned?: boolean;
  onReplay?: () => void;
}) {
  return (
    <div className="reward-screen" data-testid="reward-screen">
      <Confetti />
      <Mascot emotion="celebrating" />
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="reward-number">
        {earned ? "+50 XP · +3 bintang" : "Latihan selesai! ★"}
      </div>
      <p>
        {earned
          ? "Bintangmu sudah masuk ke koleksi."
          : "XP untuk aktivitas ini sudah pernah diterima. Terus asah kemampuanmu!"}
      </p>
      <div className="actions-row center-actions">
        <Link className="button" href="/duel">
          Coba Duel Cerdas <ArrowRight size={17} />
        </Link>
        {onReplay && (
          <button className="button button-white" onClick={onReplay}>
            <RotateCcw size={17} /> Main lagi
          </button>
        )}
        <Link className="text-link" href="/materi">
          Jelajah dunia lainnya
        </Link>
      </div>
    </div>
  );
}
export function LearningWorld() {
  return (
    <div className="page-container content-page" data-testid="learning-world">
      <PageHeading
        title="Pilih dunia belajarmu!"
        subtitle="Enam petualangan seru menantimu. Mulai dari mana saja, sesuai rasa ingin tahumu."
      />
      <div className="world-grid">
        {topics.map((topic, index) => (
          <TopicCard key={topic.slug} topic={topic} index={index} />
        ))}
      </div>
      <div className="note">
        <Star size={22} /> Semua dunia terbuka. Tidak perlu terburu-buru,
        nikmati setiap langkah belajarmu.
      </div>
    </div>
  );
}
export function Answers({
  question,
  selected,
  onAnswer,
  locked = false,
  reveal = false,
}: {
  question: Pick<Question, "options" | "correct">;
  selected: number | null;
  onAnswer: (i: number) => void;
  locked?: boolean;
  reveal?: boolean;
}) {
  return (
    <div className="answer-grid">
      {question.options.map((option, i) => (
        <button
          key={i}
          className={cn(
            "answer",
            selected === i && "selected",
            reveal && i === question.correct && "correct",
            reveal && selected === i && i !== question.correct && "incorrect",
          )}
          onClick={() => onAnswer(i)}
          disabled={locked}
          aria-pressed={selected === i}
        >
          <span className="answer-letter">
            {reveal && i === question.correct ? (
              <Check size={20} />
            ) : (
              String.fromCharCode(65 + i)
            )}
          </span>
          {option}
          {reveal && i === question.correct && (
            <span className="sr-only">Jawaban benar</span>
          )}
        </button>
      ))}
    </div>
  );
}
export function Lesson({ slug }: { slug: string }) {
  const topic = topics.find((t) => t.slug === slug);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const s = useStore();
  const [earned, setEarned] = useState(false);
  if (!topic) return <EmptyState />;
  const index = topics.indexOf(topic);
  const finish = () => {
    setEarned(!s.rewards.includes(`lesson-${slug}`));
    completeLesson(slug);
    setStep(4);
  };
  return (
    <div className="page-container content-page">
      <div className="narrow">
        <h1 className="sr-only">{topic.title}</h1>
        <div className="lesson-top">
          <Link href="/materi" className="back-link">
            <ArrowLeft size={17} /> Dunia {index + 1}: {topic.short}
          </Link>
          <div
            className="lesson-steps"
            role="group"
            aria-label={`Langkah ${step + 1} dari 5`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span className={cn(i <= step && "done")} key={i} />
            ))}
          </div>
        </div>
        <div className="paper" data-testid="lesson">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              {step === 4 ? (
                <>
                  <RewardScreen
                    earned={earned}
                    title="Satu dunia, banyak cerita baru!"
                    description={`Kamu selesai belajar ${topic.short.toLowerCase()}.`}
                  />
                  <div className="actions-row center-actions">
                    <Link
                      className="button button-orange"
                      href={`/kuis/${slug}`}
                    >
                      Lanjut kuis <ArrowRight size={17} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="storybook">
                    <div className={cn("storybook-art", topic.color)}>
                      <TopicArt index={index} />
                      <span className="status-pill">
                        {step === 0
                          ? "Yuk, kenalan!"
                          : step === 1
                            ? "Pahami bersama Koini"
                            : step === 2
                              ? "Cerita sehari-hari"
                              : "Giliran kamu!"}
                      </span>
                    </div>
                    <div className="lesson-content">
                      <small className="muted">
                        Petualangan {index + 1} / 6
                      </small>
                      <h2>
                        {step === 0
                          ? topic.title
                          : step === 1
                            ? "Tahukah kamu?"
                            : step === 2
                              ? "Bayangkan ceritanya…"
                              : "Ayo, coba pikirkan!"}
                      </h2>
                      <p>
                        {step === 0
                          ? `${topic.description} Kita akan belajar bersama, mencoba cerita, lalu menjawab satu tantangan. Siap?`
                          : step === 1
                            ? topic.lesson
                            : step === 2
                              ? topic.example
                              : topic.activity}
                      </p>
                      {step === 3 && (
                        <>
                          <Answers
                            question={{
                              options: topic.choices,
                              correct: topic.answer,
                            }}
                            selected={answer}
                            onAnswer={setAnswer}
                            locked={answer === topic.answer}
                            reveal={answer === topic.answer}
                          />
                          {answer !== null && (
                            <div
                              className={cn(
                                "feedback",
                                answer !== topic.answer && "retry",
                              )}
                              role="status"
                            >
                              <strong>
                                {answer === topic.answer
                                  ? "Benar! Kamu hebat."
                                  : "Yuk, pikirkan lagi."}
                              </strong>
                              <p>
                                {answer === topic.answer
                                  ? topic.explanation
                                  : "Coba baca ceritanya kembali. Kamu boleh memilih jawaban lain."}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="lesson-nav">
                    <button
                      className="button button-white"
                      disabled={step === 0}
                      onClick={() => setStep((v) => v - 1)}
                    >
                      <ArrowLeft size={16} /> Sebelumnya
                    </button>
                    <button
                      className="button"
                      disabled={step === 3 && answer !== topic.answer}
                      onClick={() =>
                        step === 3
                          ? finish()
                          : setStep((v) => Math.min(3, v + 1))
                      }
                    >
                      {step === 3
                        ? "Selesaikan materi"
                        : step === 0
                          ? "Mulai Materi"
                          : "Lanjut"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
export function Quiz({ slug }: { slug: string }) {
  const qs = questions.filter((q) => q.topic === slug);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [earned, setEarned] = useState(false);
  const s = useStore();
  if (!qs.length) return <EmptyState title="Soalnya belum tersedia" />;
  const q = qs[index];
  const answer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(score + 1);
  };
  const next = () => {
    if (index + 1 === qs.length) {
      setEarned(!s.rewards.includes(`quiz-${slug}`));
      reward(`quiz-${slug}`, 50, slug === "refleksi" ? 7 : undefined);
      setDone(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  };
  return (
    <div className="page-container content-page">
      <div className="narrow">
        <PageHeading
          title={`Kuis ${topics.find((t) => t.slug === slug)?.short}`}
          subtitle="Pikirkan baik-baik. Setiap jawaban punya cerita untuk dipelajari."
          back={`/materi/${slug}`}
        />
        <div className="paper" data-testid="quiz">
          {done ? (
            <RewardScreen
              title="Kamu makin cerdas!"
              description={`${score} dari ${qs.length} jawaban benar. Terima kasih sudah mencoba!`}
              earned={earned}
              onReplay={() => {
                setIndex(0);
                setSelected(null);
                setScore(0);
                setDone(false);
              }}
            />
          ) : (
            <>
              <div className="quiz-top">
                <strong>
                  Soal {index + 1} dari {qs.length}
                </strong>
                <Progress value={((index + 1) / qs.length) * 100} />
                <span className="xp-pill">+50 XP</span>
              </div>
              <div className="quiz-question">
                <h2>{q.text}</h2>
                <Mascot
                  emotion={
                    selected === null
                      ? "thinking"
                      : selected === q.correct
                        ? "celebrating"
                        : "encouraging"
                  }
                />
              </div>
              <Answers
                question={q}
                selected={selected}
                onAnswer={answer}
                locked={selected !== null}
                reveal={selected !== null}
              />
              {selected !== null && (
                <div
                  className={cn("feedback", selected !== q.correct && "retry")}
                  role="status"
                >
                  <strong>
                    {selected === q.correct
                      ? "Tepat sekali!"
                      : "Belum tepat, tapi kita bisa belajar."}
                  </strong>
                  <p>{q.explanation}</p>
                  <button
                    className="button button-small spacer-top"
                    onClick={next}
                  >
                    {index + 1 === qs.length
                      ? "Lihat hasil"
                      : "Soal berikutnya"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const games = [
  ["hitung-koin", "Hitung Koin", "Hitung uangnya, temukan jumlahnya!", 0],
  [
    "kebutuhan",
    "Kebutuhan atau Keinginan?",
    "Pilah barang untuk belanja lebih bijak.",
    1,
  ],
  ["menabung", "Tantangan Menabung", "Isi toplesmu sampai target tercapai.", 2],
  ["berbagi", "Misi Berbagi", "Pilih kebaikan dalam cerita sehari-hari.", 3],
] as const;
export function MiniGames() {
  return (
    <div className="page-container content-page">
      <PageHeading
        title="Zona Mini Games!"
        subtitle="Tantangan kecil untuk pikiran hebat. Pilih permainan favoritmu!"
      />
      <div className="game-selection">
        {games.map(([slug, title, desc, i]) => (
          <Link
            key={slug}
            href={`/mini-games/${slug}`}
            className={cn("game-cover", topics[i].color)}
          >
            <TopicArt index={i} />
            <div>
              <h2>{title}</h2>
              <p>{desc}</p>
              <div className="game-meta">Mudah · 2–3 menit · +50 XP</div>
              <span className="button button-small">
                Mulai main <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
const sortItems = [
  ["🥪", "Bekal makan siang", 0],
  ["🧸", "Boneka tambahan", 1],
  ["📓", "Buku tulis yang habis", 0],
  ["🍬", "Permen setelah makan", 1],
  ["🎒", "Pengganti tas rusak", 0],
  ["🎀", "Aksesori baru", 1],
] as const;
export function MiniGame({ slug }: { slug: string }) {
  const game = games.find((g) => g[0] === slug);
  const s = useStore();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [deposit, setDeposit] = useState(0);
  const [done, setDone] = useState(false);
  const [earned, setEarned] = useState(false);
  if (!game) return <EmptyState />;
  const finish = () => {
    setEarned(!s.rewards.includes(`game-${slug}`));
    reward(
      `game-${slug}`,
      50,
      slug === "berbagi" ? 2 : slug === "menabung" ? 1 : undefined,
    );
    setDone(true);
  };
  const next = () => {
    if (round >= (slug === "kebutuhan" ? 5 : 2)) finish();
    else {
      setRound(round + 1);
      setSelected(null);
    }
  };
  const sharing = questions.filter((q) => q.topic === "berbagi").slice(0, 3);
  const counts = [
    [1000, 1000, 1000],
    [2000, 1000, 2000],
    [2000, 2000, 1000, 1000],
  ];
  const sum = counts[Math.min(round, 2)].reduce((a, b) => a + b, 0);
  const coinQuestion = {
    options: [sum + 1000, sum, sum - 1000, sum + 2000].map(
      (n) => `Rp${n.toLocaleString("id-ID")}`,
    ),
    correct: 1,
  };
  const currentQ = slug === "berbagi" ? sharing[round] : coinQuestion;
  return (
    <div className="page-container content-page">
      <div className="narrow">
        <PageHeading title={game[1]} subtitle={game[2]} back="/mini-games" />
        <div className="paper" data-testid="mini-game">
          {done ? (
            <RewardScreen
              earned={earned}
              description="Kamu sudah menyelesaikan tantangan. Pengetahuanmu bertambah!"
              onReplay={() => {
                setDone(false);
                setRound(0);
                setSelected(null);
                setDeposit(0);
              }}
            />
          ) : (
            <div className="mini-stage">
              {slug === "kebutuhan" ? (
                <>
                  <small>Barang {round + 1} dari 6</small>
                  <h2 className="spacer-top">Masuk keranjang yang mana?</h2>
                  <div
                    className="sort-item"
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", "item")
                    }
                  >
                    <span>{sortItems[round][0]}</span>
                    <strong>{sortItems[round][1]}</strong>
                  </div>
                  <p className="muted">
                    Seret barang atau ketuk salah satu keranjang.
                  </p>
                  <div className="answer-grid">
                    {["Kebutuhan", "Keinginan"].map((label, i) => (
                      <button
                        key={label}
                        className={cn(
                          "answer drop-target",
                          selected === i &&
                            (i === sortItems[round][2]
                              ? "correct"
                              : "incorrect"),
                        )}
                        onClick={() => setSelected(i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setSelected(i);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {selected !== null && (
                    <div className="feedback" role="status">
                      <p>
                        {selected === sortItems[round][2]
                          ? "Tepat! Kamu memahami prioritas dalam cerita ini."
                          : "Coba lagi. Pikirkan: apakah barang ini diperlukan sekarang, atau bisa ditunda?"}
                      </p>
                      {selected === sortItems[round][2] && (
                        <button
                          className="button button-small spacer-top"
                          onClick={next}
                        >
                          {round === 5 ? "Selesaikan" : "Barang berikutnya"}
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : slug === "menabung" ? (
                <>
                  <TopicArt index={2} />
                  <h2>Target toples: Rp20.000</h2>
                  <div className="savings-amount">
                    Rp{deposit.toLocaleString("id-ID")}
                  </div>
                  <Progress value={deposit / 200} />
                  <p className="spacer-top">
                    Pilih jumlah yang ingin kamu sisihkan. Semua ini uang
                    latihan.
                  </p>
                  <div className="actions-row center-actions">
                    {[1000, 2000, 5000].map((n) => (
                      <button
                        key={n}
                        className="button button-orange"
                        disabled={deposit + n > 20000}
                        onClick={() => {
                          const next = deposit + n;
                          setDeposit(next);
                          if (next === 20000) finish();
                        }}
                      >
                        +Rp{n.toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <small>Tantangan {round + 1} dari 3</small>
                  {slug === "hitung-koin" ? (
                    <>
                      <h2 className="spacer-top">
                        Berapa jumlah uang semuanya?
                      </h2>
                      <div className="coin-row">
                        {counts[round].map((n, i) => (
                          <span key={i} className="coin">
                            Rp{n.toLocaleString("id-ID")}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <TopicArt index={3} />
                      <h2>{sharing[round].text}</h2>
                    </>
                  )}
                  <Answers
                    question={currentQ}
                    selected={selected}
                    onAnswer={setSelected}
                    locked={selected !== null}
                    reveal={selected !== null}
                  />
                  {selected !== null && (
                    <div
                      className={cn(
                        "feedback",
                        selected !== currentQ.correct && "retry",
                      )}
                      role="status"
                    >
                      <strong>
                        {selected === currentQ.correct
                          ? "Tepat sekali!"
                          : "Mari kita pahami bersama."}
                      </strong>
                      <p>
                        {slug === "hitung-koin"
                          ? `Jumlahnya Rp${sum.toLocaleString("id-ID")}. Jumlahkan nilai pada setiap keping uang.`
                          : sharing[round].explanation}
                      </p>
                      <button
                        className="button button-small spacer-top"
                        onClick={next}
                      >
                        {round === 2 ? "Selesaikan permainan" : "Lanjutkan"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
