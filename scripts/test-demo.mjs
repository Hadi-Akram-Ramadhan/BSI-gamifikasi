import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.DEMO_URL || "http://localhost:3001";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
const errors = [];
const checks = [];
ctx.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
page.on("pageerror", (e) => errors.push(e.message));
const state = () =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("duel-cerdas-v1") || "null"),
  );
const pass = (name) => {
  checks.push(name);
  console.log("PASS", name);
};
try {
  await page.goto(base);
  await expect(page.getByTestId("home-hero")).toBeVisible();
  await page.goto(base + "/tabunganku");
  await page.getByRole("button", { name: "Catat Tabungan +Rp2.000" }).click();
  assert.equal((await state()).savings, 16000);
  await page.reload();
  await expect(page.locator(".savings-amount")).toHaveText("Rp16.000");
  pass("Savings deposit persists after reload");
  await page.goto(base + "/materi/kebutuhan-keinginan");
  await page.getByRole("button", { name: "Mulai Materi" }).click();
  await expect(
    page.getByRole("heading", { name: "Tahukah kamu?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Bayangkan ceritanya…" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ayo, coba pikirkan!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "A Stiker lucu" }).click();
  await expect(
    page.getByRole("button", { name: "Selesaikan materi" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "B Buku tulis" }).click();
  await page.getByRole("button", { name: "Selesaikan materi" }).click();
  await expect(page.getByTestId("reward-screen")).toBeVisible();
  assert((await state()).completed.includes("kebutuhan-keinginan"));
  pass("Lesson retry, completion and XP reward");
  await page.goto(base + "/kuis/kenal-uang");
  for (let i = 0; i < 8; i++) {
    await page
      .locator(".answer")
      .nth((4 - (i % 4)) % 4)
      .click();
    await page
      .getByRole("button", {
        name: i === 7 ? "Lihat hasil" : "Soal berikutnya",
      })
      .click();
  }
  await expect(page.getByTestId("reward-screen")).toContainText("8 dari 8");
  pass("Eight-question quiz scoring and explanations");
  await page.goto(base + "/mini-games/kebutuhan");
  for (let i = 0; i < 6; i++) {
    await page
      .getByRole("button", {
        name: i % 2 === 0 ? "Kebutuhan" : "Keinginan",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", {
        name: i === 5 ? "Selesaikan" : "Barang berikutnya",
        exact: true,
      })
      .click();
  }
  await expect(page.getByTestId("reward-screen")).toBeVisible();
  pass("Needs/wants game completes using tap alternative");
  await page.goto(base + "/mini-games/menabung");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "+Rp5.000", exact: true }).click();
  await expect(page.getByTestId("reward-screen")).toBeVisible();
  pass("Savings mini-game reaches target");
  for (const slug of ["hitung-koin", "berbagi"]) {
    await page.goto(base + "/mini-games/" + slug);
    for (let i = 0; i < 3; i++) {
      await page.locator(".answer").nth(1).click();
      await page
        .getByRole("button", {
          name: i === 2 ? "Selesaikan permainan" : "Lanjutkan",
          exact: true,
        })
        .click();
    }
    await expect(page.getByTestId("reward-screen")).toBeVisible();
    pass(slug + " mini-game completes");
  }
  await page.goto(base + "/guru/game/buat");
  await page.getByRole("button", { name: "Buat Room", exact: true }).click();
  await page.waitForURL("**/guru/game/CERDAS*");
  const code = page.url().split("/").pop();
  await page.getByRole("button", { name: "Isi Pemain Demo" }).click();
  const tv = await ctx.newPage();
  await tv.goto(base + "/tv/" + code);
  await expect(tv.getByTestId("tv-lobby")).toContainText("Siti");
  await page.getByRole("button", { name: "Mulai Pertandingan" }).click();
  await expect(
    tv.getByTestId("tv-arena").filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Jeda", exact: true }),
  ).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Jeda", exact: true }).click();
  await expect(
    tv.getByText("Permainan dijeda oleh guru. Timer berhenti."),
  ).toBeVisible();
  const paused = (await state()).rooms[code].remaining;
  await page.waitForTimeout(500);
  assert.equal((await state()).rooms[code].remaining, paused);
  await page.getByRole("button", { name: "Lanjutkan permainan" }).click();
  pass("TV follows teacher start, pause, and resume");
  for (let i = 0; i < 5; i++) {
    await page
      .locator(".controller-team")
      .nth(0)
      .locator("button")
      .nth(0)
      .click();
    await page
      .locator(".controller-team")
      .nth(1)
      .locator("button")
      .nth(1)
      .click();
    await expect(
      page.getByText("Jawaban benar:", { exact: false }),
    ).toBeVisible();
    const before = (await state()).rooms[code];
    assert.equal(before.rounds.length, i + 1);
    await expect(tv.locator(".feedback")).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 4 ? "Lihat Hasil" : "Pertanyaan Berikutnya",
        exact: true,
      })
      .click();
  }
  await expect(
    tv.getByTestId("game-results").filter({ visible: true }),
  ).toBeVisible();
  assert.equal((await state()).matches.length, 1);
  pass("Five-round manual duel synchronizes scores, reveal, next, result");
  await page.goto(base + "/guru/game/buat?mode=individual");
  await page.getByLabel("Cara menjawab").selectOption("digital");
  await page.getByRole("button", { name: "Buat Room", exact: true }).click();
  await page.waitForURL("**/guru/game/CERDAS*");
  const digitalCode = page.url().split("/").pop();
  const green = await ctx.newPage();
  await green.goto(base + "/join?code=" + digitalCode);
  await green.getByLabel("Nama panggilan").fill("Pemain Satu");
  await green.getByRole("button", { name: "Gabung permainan" }).click();
  await green.waitForURL("**/play/**");
  const orange = await ctx.newPage();
  await orange.goto(base + "/join?code=" + digitalCode);
  await orange.getByLabel("Nama panggilan").fill("Pemain Dua");
  await orange.getByLabel("Pilih sisi").selectOption("1");
  await orange.getByRole("button", { name: "Gabung permainan" }).click();
  await orange.waitForURL("**/play/**");
  await expect(
    page.getByText("Pemain Satu", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mulai Pertandingan" }).click();
  await expect(green.locator(".answer").first()).toBeEnabled({
    timeout: 10000,
  });
  await Promise.all([
    green.locator(".answer").nth(0).click(),
    orange.locator(".answer").nth(1).click(),
  ]);
  await expect(
    page.getByText("Jawaban benar:", { exact: false }),
  ).toBeVisible();
  assert.deepEqual((await state()).rooms[digitalCode].answers, [0, 1]);
  await expect(green.locator(".answer").first()).toBeDisabled();
  await green.reload();
  await expect(
    green.getByText("Jawabanmu sudah dikirim!", { exact: false }),
  ).toBeVisible();
  pass(
    "Digital 1v1 joins, simultaneous answers, duplicate protection and refresh",
  );
  await page.getByRole("button", { name: "Pertanyaan Berikutnya" }).click();
  await expect(page.getByText("Soal 2 / 5", { exact: true })).toBeVisible();
  await page.evaluate((code) => {
    const key = "duel-cerdas-v1";
    const data = JSON.parse(localStorage.getItem(key));
    data.rooms[code].deadline = Date.now() - 1;
    localStorage.setItem(key, JSON.stringify(data));
    new BroadcastChannel(key).postMessage("updated");
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, digitalCode);
  await expect(
    page.getByText("Jawaban benar:", { exact: false }),
  ).toBeVisible();
  assert.deepEqual((await state()).rooms[digitalCode].answers, [null, null]);
  pass("Expired round reveals without awarding unanswered points");
  await page.goto(base + "/tv/UNKNOWN");
  await expect(
    page.getByRole("heading", { name: "Room belum ditemukan" }),
  ).toBeVisible();
  pass("Unknown room friendly error");
  const routes = [
    "/",
    "/materi",
    "/materi/berbagi",
    "/mini-games",
    "/duel",
    "/tabunganku",
    "/profil",
    "/pencapaian",
    "/leaderboard",
    "/workbook",
    "/guru/dashboard",
    "/guru/kelas",
    "/guru/laporan",
    "/guru/soal",
    "/admin",
  ];
  const overflows = [];
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 });
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator("main h1, main h2").first().waitFor();
      const size = await page.evaluate(() => ({
        w: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      if (size.scroll > size.w + 1) overflows.push({ route, width, ...size });
    }
  }
  assert.deepEqual(overflows, []);
  pass("15 routes at 360/390/768/1440px without horizontal overflow");
  assert.deepEqual(errors, []);
  pass("No browser runtime errors");
  fs.writeFileSync(
    "ui-evidence/functional-checks.json",
    JSON.stringify({ checks, errors, passed: true }, null, 2),
  );
} finally {
  await browser.close();
}
