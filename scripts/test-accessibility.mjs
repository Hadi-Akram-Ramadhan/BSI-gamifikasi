import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import seed from "../ui-evidence/hooks/seed.mjs";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const results = [];
for (const route of [
  "/",
  "/materi",
  "/materi/berbagi",
  "/tabunganku",
  "/guru/game/CERDAS42",
  "/tv/CERDAS42/arena",
  "/join",
]) {
  await seed({
    page,
    screen: { id: route.includes("arena") ? "tv-arena" : "controller" },
  });
  await page.goto((process.env.DEMO_URL || "http://localhost:3001") + route);
  await page.locator("main").waitFor();
  // Inspect settled content, not an intermediate opacity during card entry.
  await page.waitForTimeout(1000);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({
    route,
    violations: scan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  console.log(
    route,
    results.at(-1).violations.map((v) => ({ id: v.id, count: v.nodes.length })),
  );
}
fs.writeFileSync(
  "ui-evidence/accessibility-checks.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
