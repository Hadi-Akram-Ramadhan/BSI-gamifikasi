export default async function seed({ page, screen }) {
  const status =
    screen.id === "tv-arena"
      ? "question"
      : screen.id === "results"
        ? "finished"
        : "waiting";
  await page.addInitScript(
    ({ status }) => {
      const room = {
        code: "CERDAS42",
        title: "Petualangan Kelas 5A",
        mode: "team",
        input: "manual",
        topic: "all",
        status,
        questionIds: [
          "kebutuhan-keinginan-0",
          "menabung-0",
          "berbagi-0",
          "kenal-uang-0",
          "refleksi-0",
        ],
        index: 0,
        seconds: 60,
        duration: 10,
        deadline: Date.now() + 60000,
        matchDeadline: Date.now() + 600000,
        remaining: 0,
        matchRemaining: 0,
        teams: [
          {
            name: "Tim Hijau",
            players: ["Ahmad", "Siti"],
            score: status === "finished" ? 400 : 0,
          },
          {
            name: "Tim Oranye",
            players: ["Budi", "Aisyah"],
            score: status === "finished" ? 300 : 0,
          },
        ],
        answers: [null, null],
        rounds:
          status === "finished"
            ? [
                { questionId: "kebutuhan-keinginan-0", answers: [3, 0] },
                { questionId: "menabung-0", answers: [2, 2] },
                { questionId: "berbagi-0", answers: [1, 1] },
                { questionId: "kenal-uang-0", answers: [0, 0] },
                { questionId: "refleksi-0", answers: [0, 0] },
              ]
            : [],
      };
      const data = {
        name: "Ahmad",
        avatar: 0,
        xp: 2350,
        stars: 24,
        completed: ["kenal-uang"],
        rewards: ["lesson-kenal-uang"],
        badges: [0, 1, 2, 3, 5],
        savings: 14000,
        target: 100000,
        goal: "Buku cerita impianku",
        deposits: [{ amount: 14000, date: "2026-10-12T08:00:00+07:00" }],
        rooms: { CERDAS42: room },
        matches: [],
      };
      localStorage.setItem("duel-cerdas-v1", JSON.stringify(data));
    },
    { status },
  );
}
