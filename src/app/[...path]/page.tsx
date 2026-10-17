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
async function DynamicContent({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const [root, slug, detail] = path;
  if (root === "materi" || root === "belajar")
    return slug ? <Lesson key={slug} slug={slug} /> : <LearningWorld />;
  if (root === "kuis" && slug) return <Quiz key={slug} slug={slug} />;
  if (root === "mini-games")
    return slug ? <MiniGame key={slug} slug={slug} /> : <MiniGames />;
  if (root === "tabunganku") return <Savings />;
  if (root === "pencapaian") return <Achievements />;
  if (root === "profil") return <Profile />;
  if (root === "leaderboard") return <Leaderboard />;
  if (root === "workbook") return <Workbook />;
  if (root === "duel") return <Duel />;
  if (root === "join") return <Join />;
  if (root === "play" && slug) return <Player code={slug} />;
  if (root === "tv" && slug) return <TVView code={slug} view={detail} />;
  if (root === "guru" && slug === "game" && detail === "buat") return <Setup />;
  if (root === "guru" && slug === "game" && detail)
    return <Controller code={detail} />;
  if (root === "guru") return <Teacher section={slug} />;
  if (root === "admin") return <Teacher section="admin" />;
  if (root === "tentang") return <About />;
  notFound();
}

export default function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="loading-block">
          Koini sedang menyiapkan petualanganmu…
        </div>
      }
    >
      <DynamicContent params={params} />
    </Suspense>
  );
}
