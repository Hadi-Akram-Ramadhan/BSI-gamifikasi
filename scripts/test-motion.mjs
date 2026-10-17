import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";

const base = process.env.DEMO_URL || "http://127.0.0.1:3002";
const browser = await chromium.launch();
const checks = [];
const errors = [];
const pass = (name) => {
  checks.push(name);
  console.log("PASS", name);
};
fs.mkdirSync("ui-evidence/motion", { recursive: true });
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion,
    });
    context.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
    const page = await context.newPage();
    const state = () =>
      page.evaluate(() => JSON.parse(localStorage.getItem("duel-cerdas-v1")));
    const closeReward = async () => {
      if (await page.getByRole("dialog").isVisible())
        await page
          .getByRole("button", { name: "Lanjutkan", exact: true })
          .click();
    };
    await page.goto(base);
    await page.locator(".hero-primary").hover();
    await expect(page.locator(".hero-primary")).toBeEnabled();
    await page.locator(".hero-primary").click();
    await expect(page.getByTestId("learning-world")).toBeVisible();
    await page.locator(".world-grid .topic-card").nth(2).hover();
    await page.locator(".world-grid .topic-card").nth(2).click();
    await page.getByRole("button", { name: "Mulai Materi" }).click();
    await expect(
      page.getByRole("heading", { name: "Tahukah kamu?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Lanjut", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Bayangkan ceritanya…" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Sebelumnya" }).click();
    await expect(
      page.getByRole("heading", { name: "Tahukah kamu?" }),
    ).toBeVisible();
    pass(
      `${reducedMotion}: hero CTA, cards, navigation and lesson forward/back`,
    );

    await page.goto(base + "/kuis/refleksi");
    for (let i = 0; i < 8; i++) {
      await page
        .locator(".answer")
        .nth((4 - ((i + 5) % 4)) % 4)
        .click();
      await expect(page.locator(".answer").first()).toBeDisabled();
      await page
        .getByRole("button", {
          name: i === 7 ? "Lihat hasil" : "Soal berikutnya",
        })
        .click();
    }
    await expect(page.getByRole("dialog")).toContainText("Pencapaian baru!");
    const earnedXP = (await state()).xp;
    assert((await state()).badges.includes(7));
    await page.screenshot({
      path: `ui-evidence/motion/achievement-${reducedMotion}.png`,
    });
    await closeReward();
    await expect(page.getByTestId("reward-screen")).toContainText("8 dari 8");
    await page.reload();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    assert.equal((await state()).xp, earnedXP);
    pass(
      `${reducedMotion}: full quiz, real XP and achievement unlock without refresh replay`,
    );

    await page.goto(base + "/tabunganku");
    for (let i = 0; i < 6; i++)
      await page
        .getByRole("button", { name: "Catat Tabungan +Rp2.000" })
        .click();
    await expect(
      page.locator(".savings-amount .animated-counter"),
    ).toHaveAttribute("data-value", "26000");
    await expect(page.locator(".milestone-feedback")).toContainText("25%");
    assert.equal((await state()).savingsMilestones.length, 1);
    await page.reload();
    await expect(page.locator(".milestone-feedback")).toHaveCount(0);
    await page.getByRole("button", { name: "Catat Tabungan +Rp2.000" }).click();
    assert.equal((await state()).savingsMilestones.length, 1);
    // Verify all remaining thresholds with real deposits and persisted metadata.
    for (let i = 0; i < 36; i++)
      await page
        .getByRole("button", { name: "Catat Tabungan +Rp2.000" })
        .click();
    assert.equal((await state()).savings, 100000);
    assert.equal((await state()).savingsMilestones.length, 4);
    await expect(page.locator(".saving-box.filled")).toHaveCount(50);
    await page.reload();
    await expect(page.locator(".celebration-confetti")).toHaveCount(0);
    pass(
      `${reducedMotion}: deposits, four persisted milestones, only new savings boxes animate`,
    );

    await page.goto(base + "/mini-games/kebutuhan");
    await page
      .locator(".sort-item")
      .dragTo(page.getByRole("button", { name: "Keinginan", exact: true }));
    await expect(page.locator(".feedback")).toContainText("Coba lagi");
    await page
      .locator(".sort-item")
      .dragTo(page.getByRole("button", { name: "Kebutuhan", exact: true }));
    await expect(
      page.getByRole("button", { name: "Barang berikutnya" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Barang berikutnya" }).click();
    await page.getByRole("button", { name: "Keinginan", exact: true }).click();
    await expect(page.locator(".drop-target.correct")).toContainText(
      "Keinginan",
    );
    await page.goto(base + "/mini-games/belanja-cerdas");
    await page.getByRole("button", { name: /Boneka/ }).click();
    await page.getByRole("button", { name: /Buku tulis/ }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "belum cukup" }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Boneka/ }).click();
    for (const product of [/Buku tulis/, /Pensil/, /Bekal/])
      await page.getByRole("button", { name: product }).click();
    await expect(page.locator(".shopping-budget")).toContainText("3 barang");
    await page.getByRole("button", { name: "Selesaikan belanja" }).click();
    await expect(page.getByTestId("reward-screen")).toContainText(
      "Semua kebutuhan terpenuhi",
    );
    pass(
      `${reducedMotion}: drag/drop, tap alternative, shopping selection and budget warning`,
    );

    await page.goto(base + "/guru/game/buat");
    await page.getByRole("button", { name: "Buat Room", exact: true }).click();
    await page.waitForURL("**/guru/game/CERDAS*");
    const code = page.url().split("/").pop();
    const tv = await context.newPage();
    await tv.setViewportSize({ width: 1920, height: 1080 });
    await tv.goto(base + "/tv/" + code);
    const participant = await context.newPage();
    await participant.goto(base + "/join?code=" + code);
    await participant.getByRole("button", { name: "Gabung permainan" }).click();
    await expect(tv.locator(".player-chip")).toContainText("Ahmad");
    await page.getByRole("button", { name: "Isi Pemain Demo" }).click();
    await page.getByRole("button", { name: "Mulai Pertandingan" }).click();
    await expect(tv.locator(".countdown")).toBeVisible();
    await tv.screenshot({
      path: `ui-evidence/motion/countdown-${reducedMotion}.png`,
    });
    await expect(
      page.getByRole("button", { name: "Jeda", exact: true }),
    ).toBeVisible({ timeout: 10000 });
    await page
      .locator(".controller-team")
      .nth(0)
      .locator("button")
      .nth(0)
      .click();
    await expect(tv.locator(".submitted").first()).toContainText(
      "Jawaban Terkunci",
    );
    assert.equal((await state()).rooms[code].teams[0].score, 0);
    await page
      .locator(".controller-team")
      .nth(1)
      .locator("button")
      .nth(1)
      .click();
    await expect(tv.locator(".feedback")).toBeVisible();
    await expect(
      tv.locator(".team-score").first().locator(".animated-counter"),
    ).toHaveAttribute("data-value", "100");
    await tv.screenshot({
      path: `ui-evidence/motion/score-${reducedMotion}.png`,
    });
    await page.getByRole("button", { name: "Pertanyaan Berikutnya" }).click();
    await expect(tv.getByText("Soal 2 / 5", { exact: true })).toBeVisible();
    await page
      .getByRole("button", { name: "Akhiri pertandingan", exact: true })
      .click();
    await page.getByRole("button", { name: "Selesai & lihat hasil" }).click();
    await expect(
      tv.getByTestId("game-results").filter({ visible: true }),
    ).toBeVisible();
    // Replay from the TV avoids the teacher's separate newly earned badge modal.
    await tv.getByRole("button", { name: "Main Lagi", exact: true }).click();
    await expect(
      tv.getByTestId("tv-lobby").filter({ visible: true }),
    ).toBeVisible();
    assert.equal((await state()).rooms[code].teams[0].score, 0);
    pass(
      `${reducedMotion}: room join, synchronized countdown, locked answers, score, next, victory and replay`,
    );

    await page.goto(base);
    await page.waitForTimeout(1000);
    const loops = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect.getComputedTiming().iterations === Infinity,
          ).length,
    );
    if (reducedMotion === "reduce") assert.equal(loops, 0);
    else
      assert(
        loops > 0 && loops <= 9,
        `Unexpected idle motion budget: ${loops}`,
      );
    pass(
      `${reducedMotion}: ${loops} decorative loops; reduced motion preserves essential feedback`,
    );
    await context.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    "ui-evidence/motion-checks.json",
    JSON.stringify({ checks, errors, passed: true }, null, 2),
  );
} finally {
  await browser.close();
}
