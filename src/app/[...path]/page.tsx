import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  LearningWorld,
  Lesson,
  Quiz,
  MiniGames,
  MiniGame,
} from "@/components/learning";
import {
  Savings,
  Achievements,
  Profile,
  Leaderboard,
  Workbook,
  Duel,
  Teacher,
  About,
} from "@/components/progress-pages";
import {
  Setup,
  TVView,
  Controller,
  Join,
  Player,
} from "@/components/classroom";
export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const [root, slug, detail] = path;
  let content;
  if (root === "materi" || root === "belajar")
    content = slug ? <Lesson key={slug} slug={slug} /> : <LearningWorld />;
  else if (root === "kuis" && slug) content = <Quiz key={slug} slug={slug} />;
  else if (root === "mini-games")
    content = slug ? <MiniGame key={slug} slug={slug} /> : <MiniGames />;
  else if (root === "tabunganku") content = <Savings />;
  else if (root === "pencapaian") content = <Achievements />;
  else if (root === "profil") content = <Profile />;
  else if (root === "leaderboard") content = <Leaderboard />;
  else if (root === "workbook") content = <Workbook />;
  else if (root === "duel") content = <Duel />;
  else if (root === "join") content = <Join />;
  else if (root === "play" && slug) content = <Player code={slug} />;
  else if (root === "tv" && slug)
    content = <TVView code={slug} view={detail} />;
  else if (root === "guru" && slug === "game" && detail === "buat")
    content = <Setup />;
  else if (root === "guru" && slug === "game" && detail)
    content = <Controller code={detail} />;
  else if (root === "guru") content = <Teacher section={slug} />;
  else if (root === "admin") content = <Teacher section="admin" />;
  else if (root === "tentang") content = <About />;
  else notFound();
  return (
    <Suspense
      fallback={
        <div className="loading-block">
          Koini sedang menyiapkan petualanganmu…
        </div>
      }
    >
      {content}
    </Suspense>
  );
}
