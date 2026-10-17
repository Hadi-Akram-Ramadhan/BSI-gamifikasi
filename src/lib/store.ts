"use client";
import { useSyncExternalStore } from "react";
import { questions } from "@/data/content";
export type Team = { name: string; players: string[]; score: number };
export type Room = {
  code: string;
  title: string;
  mode: "team" | "individual";
  input: "manual" | "digital";
  topic: string;
  status:
    "waiting" | "countdown" | "question" | "paused" | "reveal" | "finished";
  questionIds: string[];
  index: number;
  seconds: number;
  duration: number;
  deadline: number;
  matchDeadline: number;
  remaining: number;
  matchRemaining: number;
  teams: [Team, Team];
  answers: (number | null)[];
  run?: number;
  rounds: { questionId: string; answers: (number | null)[] }[];
};
export type AppState = {
  name: string;
  avatar: number;
  xp: number;
  stars: number;
  completed: string[];
  rewards: string[];
  badges: number[];
  savings: number;
  target: number;
  goal: string;
  deposits: { amount: number; date: string }[];
  savingsMilestones: string[];
  rooms: Record<string, Room>;
  matches: {
    id?: string;
    code: string;
    title: string;
    scores: number[];
    names: string[];
  }[];
};
export const initial: AppState = {
  name: "",
  avatar: 0,
  xp: 0,
  stars: 0,
  completed: [],
  rewards: [],
  badges: [],
  savings: 0,
  target: 100000,
  goal: "Buku Cerita Impian",
  deposits: [],
  savingsMilestones: [],
  rooms: {},
  matches: [],
};
const KEY = "khalifa-app-v2";
let cached: AppState = initial;
let loaded = false;
let hydrated = false;
let channel: BroadcastChannel | undefined;
const listeners = new Set<() => void>();
function read(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (
        value &&
        typeof value.xp === "number" &&
        Array.isArray(value.badges) &&
        value.rooms
      )
        return { ...initial, ...value };
    }
  } catch {}
  return structuredClone(initial);
}
function emit() {
  listeners.forEach((fn) => fn());
}
function setup() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cached = read();
      emit();
    }
  });
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(KEY);
    channel.onmessage = () => {
      cached = read();
      emit();
    };
  }
}
function subscribe(fn: () => void) {
  setup();
  listeners.add(fn);
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    queueMicrotask(() => {
      cached = read();
      emit();
    });
  }
  return () => {
    listeners.delete(fn);
  };
}
function snapshot() {
  setup();
  return cached;
}
export function useStore() {
  return useSyncExternalStore(subscribe, snapshot, () => initial);
}
export function update(fn: (s: AppState) => void) {
  setup();
  hydrated = true;
  const next = read();
  const before = { xp: next.xp, stars: next.stars, badges: [...next.badges] };
  fn(next);
  cached = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  channel?.postMessage("updated");
  emit();
  const unlocked = next.badges.filter(
    (badge) => !before.badges.includes(badge),
  );
  if (next.xp > before.xp || unlocked.length) {
    window.dispatchEvent(
      new CustomEvent("duel-reward", {
        detail: {
          xp: Math.max(0, next.xp - before.xp),
          stars: Math.max(0, next.stars - before.stars),
          badges: unlocked,
          level:
            Math.floor(next.xp / 500) > Math.floor(before.xp / 500)
              ? Math.floor(next.xp / 500) + 1
              : undefined,
        },
      }),
    );
  }
}
export function reward(key: string, xp = 50, badge?: number) {
  update((s) => {
    if (s.rewards.includes(key)) return;
    s.rewards.push(key);
    s.xp += xp;
    s.stars += 3;
    if (badge !== undefined && !s.badges.includes(badge)) {
      s.badges.push(badge);
    }
  });
}
export function recordSavings(requested = 2000) {
  let amount = 0;
  let milestone = 0;
  let target = 0;
  update((s) => {
    amount = Math.max(0, Math.min(requested, s.target - s.savings));
    if (!amount) return;
    const before = (s.savings / s.target) * 100;
    s.savings += amount;
    s.deposits.unshift({ amount, date: new Date().toISOString() });
    target = s.target;
    for (const threshold of [25, 50, 75, 100]) {
      const key = `${s.goal}:${s.target}:${threshold}`;
      if (
        before < threshold &&
        (s.savings / s.target) * 100 >= threshold &&
        !s.savingsMilestones.includes(key)
      ) {
        s.savingsMilestones.push(key);
        milestone = threshold;
      }
    }
  });
  if (milestone)
    window.dispatchEvent(
      new CustomEvent("duel-milestone", { detail: { milestone } }),
    );
  if (milestone === 100) reward(`saving-${target}`, 50, 1);
  return { amount, milestone };
}
export function completeLesson(slug: string) {
  update((s) => {
    if (!s.completed.includes(slug)) s.completed.push(slug);
  });
  reward(
    `lesson-${slug}`,
    50,
    slug === "kenal-uang" ? 0 : slug === "rencana-target" ? 3 : undefined,
  );
  update((s) => {
    if (s.completed.length === 6 && !s.badges.includes(6)) s.badges.push(6);
  });
}
export function resetDemo() {
  update((s) => Object.assign(s, structuredClone(initial)));
}
export function createRoom(
  config: Pick<
    Room,
    "title" | "mode" | "input" | "topic" | "seconds" | "duration"
  >,
  count: number,
) {
  const code = `CERDAS${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const pool = questions.filter(
    (q) => config.topic === "all" || q.topic === config.topic,
  );
  const ids = Array.from(
    { length: Math.min(count, pool.length) },
    (_, i) => pool[(i * 7) % pool.length].id,
  );
  update((s) => {
    s.rooms[code] = {
      ...config,
      code,
      status: "waiting",
      questionIds: ids,
      index: 0,
      deadline: 0,
      matchDeadline: 0,
      remaining: 0,
      matchRemaining: 0,
      teams: [
        {
          name: config.mode === "team" ? "Tim Hijau" : "Pemain Hijau",
          players: [],
          score: 0,
        },
        {
          name: config.mode === "team" ? "Tim Oranye" : "Pemain Oranye",
          players: [],
          score: 0,
        },
      ],
      answers: [null, null],
      rounds: [],
    };
  });
  return code;
}
export type GameAction =
  | {
      type:
        | "populate"
        | "start"
        | "pause"
        | "resume"
        | "reveal"
        | "next"
        | "finish"
        | "tick"
        | "replay";
    }
  | { type: "answer"; team: number; answer: number; round: number }
  | { type: "join"; team: number; name: string };
function finish(s: AppState, r: Room) {
  r.status = "finished";
  if (!s.matches.some((m) => (m.id || m.code) === `${r.code}-${r.run || 0}`)) {
    s.matches.unshift({
      id: `${r.code}-${r.run || 0}`,
      code: r.code,
      title: r.title,
      scores: r.teams.map((t) => t.score),
      names: r.teams.map((t) => t.name),
    });
    s.xp += 50;
    s.stars += 3;
    if (!s.badges.includes(4)) s.badges.push(4);
  }
}
function reveal(r: Room) {
  if (r.status !== "question") return;
  const q = questions.find((q) => q.id === r.questionIds[r.index]);
  r.teams.forEach((team, i) => {
    if (r.answers[i] === q?.correct) team.score += 100;
  });
  r.rounds.push({
    questionId: r.questionIds[r.index],
    answers: [...r.answers],
  });
  r.status = "reveal";
}
export async function gameAction(code: string, action: GameAction) {
  const run = () =>
    update((s) => {
      const r = s.rooms[code];
      if (!r) return;
      const now = Date.now();
      if (action.type === "populate" && r.status === "waiting")
        r.teams.forEach((t, i) => {
          t.players =
            r.mode === "team"
              ? i === 0
                ? ["Regu Hijau 1", "Regu Hijau 2"]
                : ["Regu Oranye 1", "Regu Oranye 2"]
              : [i === 0 ? "Pemain Hijau" : "Pemain Oranye"];
          if (r.mode === "individual") t.name = t.players[0];
        });
      if (
        action.type === "join" &&
        r.status === "waiting" &&
        (r.mode === "team" || r.teams[action.team]?.players.length === 0)
      ) {
        const t = r.teams[action.team];
        if (t && !t.players.includes(action.name)) {
          t.players.push(action.name);
          if (r.mode === "individual") t.name = action.name;
        }
      }
      if (
        action.type === "start" &&
        r.status === "waiting" &&
        r.teams.every((t) => t.players.length)
      ) {
        r.status = "countdown";
        r.deadline = now + 3000;
      }
      if (action.type === "tick") {
        if (r.status === "countdown" && now >= r.deadline) {
          r.status = "question";
          r.deadline = now + r.seconds * 1000;
          r.matchDeadline = now + r.duration * 60000;
        }
        if (r.status === "question" && now >= r.deadline) reveal(r);
        if (
          (r.status === "question" || r.status === "reveal") &&
          now >= r.matchDeadline
        ) {
          if (r.status === "question") reveal(r);
          finish(s, r);
        }
      }
      if (
        action.type === "answer" &&
        r.status === "question" &&
        action.round === r.index &&
        now < r.deadline &&
        now < r.matchDeadline &&
        r.answers[action.team] === null &&
        action.answer >= 0 &&
        action.answer < 4
      ) {
        r.answers[action.team] = action.answer;
        if (r.answers.every((a) => a !== null)) reveal(r);
      }
      if (action.type === "reveal") reveal(r);
      if (action.type === "pause" && r.status === "question") {
        r.remaining = Math.max(0, r.deadline - now);
        r.matchRemaining = Math.max(0, r.matchDeadline - now);
        r.status = "paused";
      }
      if (action.type === "resume" && r.status === "paused") {
        r.deadline = now + r.remaining;
        r.matchDeadline = now + r.matchRemaining;
        r.status = "question";
      }
      if (action.type === "next" && r.status === "reveal") {
        if (r.index + 1 >= r.questionIds.length) finish(s, r);
        else {
          r.index++;
          r.answers = [null, null];
          r.deadline = now + r.seconds * 1000;
          r.status = "question";
        }
      }
      if (action.type === "finish" && r.status !== "finished") {
        if (r.status === "question") reveal(r);
        finish(s, r);
      }
      if (action.type === "replay" && r.status === "finished") {
        r.run = (r.run || 0) + 1;
        r.status = "waiting";
        r.index = 0;
        r.answers = [null, null];
        r.rounds = [];
        r.teams.forEach((t) => (t.score = 0));
      }
    });
  if (typeof navigator !== "undefined" && navigator.locks)
    await navigator.locks.request(KEY, run);
  else run();
}
