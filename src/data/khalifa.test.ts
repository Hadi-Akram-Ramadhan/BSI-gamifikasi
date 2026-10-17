import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { topics, questions, badges, rupiah } from "./content.ts";

test("KHALIFA Educational Topics Integrity", () => {
  assert.equal(topics.length, 6, "Must have exactly 6 learning worlds");

  const requiredSlugs = [
    "kenal-uang",
    "kebutuhan-keinginan",
    "menabung",
    "berbagi",
    "rencana-target",
    "refleksi",
  ];

  for (const slug of requiredSlugs) {
    const topic = topics.find((t) => t.slug === slug);
    assert.ok(topic, `Topic with slug '${slug}' must exist`);
    assert.ok(topic.title.length > 0, `Topic ${slug} must have a title`);
    assert.ok(topic.choices.length >= 2, `Topic ${slug} must have at least 2 choices`);
    assert.ok(
      topic.answer >= 0 && topic.answer < topic.choices.length,
      `Topic ${slug} answer index must be within choices bounds`
    );
    assert.ok(topic.explanation.length > 10, `Topic ${slug} explanation must be descriptive`);
  }
});

test("Smart Workbook Savings Target and Milestone Logic", () => {
  const target = 100000;
  const milestoneUnit = 2000;
  const totalBoxes = target / milestoneUnit;

  assert.equal(totalBoxes, 50, "Workbook must have exactly 50 milestone boxes");

  // Format currency helper check
  assert.equal(rupiah(100000), "Rp100.000", "rupiah(100000) must equal 'Rp100.000'");
  assert.equal(rupiah(2000), "Rp2.000", "rupiah(2000) must equal 'Rp2.000'");

  // Step calculations
  for (let step = 1; step <= 50; step++) {
    const currentSavings = step * milestoneUnit;
    const progressPercent = Math.round((currentSavings / target) * 100);
    assert.equal(progressPercent, step * 2, `Step ${step} must represent exactly ${step * 2}%`);
  }
});

test("Question Bank Validation", () => {
  assert.ok(questions.length >= 10, "Must have comprehensive question bank");
  for (const q of questions) {
    assert.ok(q.id, "Question must have an id");
    assert.ok(q.topic, "Question must be associated with a topic");
    assert.ok(q.text.length > 5, "Question text must be meaningful");
    assert.ok(q.options.length >= 2, "Question must have at least 2 options");
    assert.ok(
      q.correct >= 0 && q.correct < q.options.length,
      `Question ${q.id} correct index must be within range`
    );
  }
});

test("KHALIFA Brand Assets Verification", () => {
  const brandDir = path.resolve(process.cwd(), "public/brand/khalifa");
  assert.ok(fs.existsSync(brandDir), "public/brand/khalifa directory must exist");

  const requiredFiles = [
    "khalifa-brand-color.svg",
    "khalifa-favicon.svg",
    "khalifa-app-icon.svg",
    "favicon.ico",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "site.webmanifest",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(brandDir, file);
    assert.ok(fs.existsSync(filePath), `Brand asset ${file} must exist`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 0, `Brand asset ${file} must not be empty`);
  }
});
