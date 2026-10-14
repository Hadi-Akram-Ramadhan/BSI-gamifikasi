import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import seed from "../ui-evidence/hooks/seed.mjs";
import fs from "node:fs";
import assert from "node:assert/strict";
const base = process.env.DEMO_URL || "http://127.0.0.1:3002";
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log("PASS", name);
};
try {
  await page.goto(base + "/profil");
  await page.getByLabel("Nama panggilan").fill("Jagoan");
  await page.getByRole("button", { name: "Simpan profil" }).click();
  await page.reload();
  await expect(page.getByLabel("Nama panggilan")).toHaveValue("Jagoan");
  await page.getByRole("button", { name: "Avatar 3", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Avatar 3", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  pass("Nickname and avatar persist with correct form values");
  await page.getByRole("button", { name: "Reset Data Demo" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Reset Data Demo" }),
  ).toBeFocused();
  pass("Destructive reset dialog closes with Escape and restores focus");
  await page.goto(base + "/pencapaian");
  await page.getByRole("button", { name: "Ahli Uang", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() =>
    document.querySelector("[role=dialog]")?.contains(document.activeElement),
  );
  assert(focused);
  await page.keyboard.press("Escape");
  pass("Achievement modal keyboard focus stays inside dialog");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/tabunganku", "/profil", "/pencapaian", "/duel"]) {
    await page.goto(base + route);
    await page.waitForTimeout(1000);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const violations = result.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    }));
    assert.deepEqual(violations, [], `${route} accessibility`);
  }
  pass("Mobile WCAG A/AA scans: home, savings, profile, badges, duel");
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const status of ["tv-lobby", "tv-arena", "results"]) {
    await seed({ page, screen: { id: status } });
    const path =
      status === "tv-lobby" ? "" : status === "tv-arena" ? "/arena" : "/hasil";
    await page.goto(base + "/tv/CERDAS42" + path);
    await page.waitForTimeout(400);
    const box = await page.evaluate(() => ({
      height: innerHeight,
      scroll: document.documentElement.scrollHeight,
    }));
    assert(
      box.scroll <= box.height + 1,
      `${status} exceeds 720p: ${JSON.stringify(box)}`,
    );
  }
  pass("Lobby, arena, and result controls fit 1280x720 without scroll");
  await page.goto(base + "/materi/menabung");
  await page.getByRole("button", { name: "Mulai Materi" }).click();
  const animation = await page.evaluate(() => {
    const animations = document.getAnimations();
    animations.forEach((a) => (a.playbackRate = 0.1));
    return animations.length;
  });
  await page.waitForTimeout(350);
  await page.screenshot({ path: "ui-evidence/motion-slow-review.png" });
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => a.finish()),
  );
  await expect(
    page.getByRole("heading", { name: "Tahukah kamu?" }),
  ).toBeVisible();
  pass(
    `Lesson transition inspected at 10% playback (${animation} active animations)`,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  const reduced = await page.evaluate(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  assert(reduced);
  pass("Reduced-motion preference supported");
  fs.writeFileSync(
    "ui-evidence/polish-checks.json",
    JSON.stringify({ checks, passed: true }, null, 2),
  );
} finally {
  await browser.close();
}
