# Motion implementation and verification — 13 October 2026

The existing Next.js 16.4 / React 19.3 app now uses shared Motion presets plus CSS for lightweight decoration. The brighter palette and expanded homepage spacing are retained. No dependencies were installed.

## Implemented

- Home: coordinated title/copy/CTA/Koini entrance, short button feedback, three decorative coins, cloud drift, star twinkle, and mascot blinking/floating. Seven desktop idle loops; mobile removes coins and cloud/star motion.
- Shared controls: press feedback, interactive topic/game cards, animated progress from its previous value, and counters that update DOM text without React renders on every animation frame.
- Learning: staggered world cards, directional lesson navigation, money counting illustration, an interactive savings example, answer checkmarks and supportive Koini reactions, quiz question transitions, and completion rewards.
- Mini-games: animated coin entry, classification drag/drop with a tap alternative, responsive jar deposits, story transitions, and the added Belanja Cerdas game with a real local basket and Rp10.000 budget. Results show the actual challenge score and provide replay/back actions.
- Rewards: XP/star toast, level-up notice, queued achievement dialogs, short bounded confetti and sparkles. Events derive from changes committed to the store. Existing rewards and badges do not unlock again on refresh.
- Classroom: stable player identities with join/layout animation, animated player counts, synchronized 3–2–1 countdown and a brief non-blocking MULAI overlay, answer-lock indicators without premature correctness, animated scores, round transitions, and victory/replay feedback.
- Savings: coin into jar, fill/progress/amount updates, only changed grid boxes animate, and persistent 25/50/75/100 percent milestone keys.
- Profile/leaderboard: avatar cross-fade, statistical counters, podium entrance, ranking-tab transitions, and badge entrance. Radix keeps focus management, Escape handling, and modal interaction blocking.

## Reusable code and modified surfaces

- `src/lib/motion.ts`: durations, springs, fade, slide, pop, stagger, hover, press, and directional lesson presets.
- `src/components/game-motion.tsx`: MotionLink, AnimatedCard, AnimatedPage, QuestionTransition, AnimatedCounter, ScoreIncrease, AnimatedCheck, SparkleEffect, ConfettiCelebration, GameCountdown, MatchStart, AnimatedSavingsJar, and SavingBox.
- Existing components updated: `art.tsx`, `home.tsx`, `learning.tsx`, `classroom.tsx`, `progress-pages.tsx`, `reward-feedback.tsx`, and `shell.tsx`.
- Shared presentation: `src/app/globals.css`. State/event changes: `src/lib/store.ts` (reward delta events and persisted savings milestones). Legacy local storage merges defaults for the new milestone field.

## Three refinement passes

1. **Consistency:** shared presets and reduced-motion guards; removed competing CSS/Motion progress transitions; kept global shell/store outside route transitions.
2. **Game feel:** verified real answers, scores, duplicate protection, drag/drop, fast repeated deposits, milestone persistence, and replay. Added friendly shopping budget feedback without shake or delay.
3. **Visual/accessibility:** inspected seven surfaces at representative sizes, checked the lesson at 10% playback, and reviewed reward/countdown/score screenshots. Fixed invalid ARIA on counters. Accessibility scans now wait for entrance motion to settle rather than sampling transient opacity. Made modal panels opaque during entrance to avoid overlapping mascot imagery through a fading panel.

## Review coverage (full, requested motion scope)

| Category | Evidence | Result |
| --- | --- | --- |
| Typography | Mobile quiz, savings, cards; counters and 1920px TV scores | Stationary readable copy; tabular counters |
| Surfaces | 21 ui-evidence captures; dialog and reward frames | No new clipping observed; 720p TV checks pass |
| Animation | Normal and reduced-motion test runs; 10% lesson transition; real score/countdown interactions | State-driven, finite celebrations; reduced mode has zero idle loops |
| Icons | Correct-answer check, avatar state, Koini expressions | Static labels remain available alongside motion |
| Performance | Counter lifecycle, CSS particle budget, interval/listener cleanup, 7 desktop/0 reduced idle loops | No per-frame React updates or added animation packages; physical TV FPS not measured |

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | Shared progress/counters and classroom scores | Values changed instantly | Interruptible visual interpolation from actual previous state | Makes score/progress changes legible |
| MEDIUM | Savings | Static art and repeated completion confetti on revisit | State-driven jar and persisted milestone metadata | Feedback corresponds to newly completed work |
| MEDIUM | Reward flow | Some badge changes bypassed reward feedback | Store-delta events and queued accessible unlock dialogs | No lost unlocks or duplicate reward grants |
| MEDIUM | Counter semantics | Label on a generic span | Explicit named group | Accessible counter value |
| LOW | Dialog entry | Transparent panel overlapped the underlying mascot | Opaque panel with scale/slide; overlay still fades | Cleaner transition |

Considered but rejected: heavy particle/game engines (unnecessary bundle and rendering cost); frozen App Router internals for page exit (unsafe with streaming/retained routes); an independent CSS countdown (could diverge from the game's timestamps); continuous decoration in the TV question area (reading stays calm).

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build` pass.
- `scripts/test-demo.mjs`: core lesson/quiz/four original mini-games; savings persistence; five-round manual match; digital simultaneous submissions; duplicate protection; deadline expiry; unknown room; 15 routes at 360/390/768/1440; no browser exceptions.
- `scripts/test-motion.mjs`: both normal and reduced motion. Home/card interactions, forward/back lessons, 8/8 Refleksi quiz, XP/unlock, refresh protection, all four savings milestones, drag/drop and tap, shopping budget/completion, room creation/join, countdown, locked answers, scores, next question, victory/replay, and idle-loop budget. No browser exceptions.
- `scripts/test-accessibility.mjs`: seven desktop WCAG A/AA scans, zero violations.
- `scripts/test-polish.mjs`: five mobile WCAG A/AA scans, dialog keyboard/focus, profile persistence, 1280x720 TV fit, 10% lesson transition, and reduced-motion preference pass.
- Before: `ui-evidence/screenshots/snapshots/20261012-163146--motion-before/review/index.html`.
- After: `ui-evidence/screenshots/snapshots/20261013-003802--motion-after/review/index.html` — 21 captures (home, worlds, quiz, classification mini-game, savings, TV arena, results at 390x844, 1440x900, and 1920x1080).
- Event frames: `ui-evidence/motion/`; structured checks: `ui-evidence/motion-checks.json`.

## Try it

Use the active preview at http://127.0.0.1:3002. Open a lesson and move forward/back; complete `/kuis/refleksi` for a new badge; record savings; play `/mini-games/belanja-cerdas`; create a teacher room and watch the TV tab through countdown, scoring, next round, result, and replay. Enable the operating system's reduced-motion preference and repeat.

Reproduce after `npm run build` and starting production on port 3002:

```powershell
$env:DEMO_URL='http://127.0.0.1:3002'
node scripts/test-demo.mjs
node scripts/test-motion.mjs
node scripts/test-accessibility.mjs
node scripts/test-polish.mjs
npx ui-evidence snapshot --config ui-evidence/config.yaml --stage primary-flow --screens 'home,worlds,quiz,mini-game,savings,tv-arena,results' --viewports 'mobile-390,desktop-1440,tv-1920' --label motion-review
```

## Deliberate limits

Cross-page navigation uses safe entry transitions; it does not retain stale outgoing App Router trees for an exit animation. Lesson/question/tab transitions do have controlled exits. Sound effects beyond the existing opt-in control were not added (optional in the brief). This remains a local browser prototype; physical classroom hardware, Safari, and guaranteed 60 FPS have not been verified. No backend or cross-device networking was added.

Verdict: approve for the tested local Chromium prototype; physical-device performance and other browsers remain unverified.
