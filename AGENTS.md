<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ui-evidence
<!-- ui-evidence:agents:begin -->
Use ui-evidence for UI before/after review in this repo.

- If setup is missing, read `ui-evidence/installation.md` and complete the installation.
- Prefer the local skill bundle in `.agents/skills/ui-evidence/` when the user asks for UI comparison, before/after screenshots, or review artifacts.
- Use `npx ui-evidence` as the deterministic engine.
- Persist config in `ui-evidence/config.yaml` and only create hooks when deterministic state requires them.
- Default human-facing output is `review/index.html`.
<!-- ui-evidence:agents:end -->
