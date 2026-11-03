# AGENTS.md

- All pages are open (no login); hidden access is a double-tap on the logo via `useDoubleTap` (timestamp-based, because iOS has no reliable dblclick).
- Prompt analysis, improvement and generation run client-side in `src/lib/eai/engine.ts` (deterministic symbolic rules); there is no backend — keep it that way unless the user asks for one.
- EAI rule modules live together in `src/lib/eai/` (engine, taskDensity, workflowPhases, certificate, checkpoints) and stay pure/deterministic so they can be unit-tested; rule tests are in `src/lib/eai/eai.test.ts` (`bun run test`).
- Every copy action goes through `copyWithFeedback` in `src/lib/feedback.ts` (buzz + dim + bleep, styles in `index.css`) so feedback stays identical everywhere.
- There is no mobile/desktop view switcher; layouts rely on normal responsive breakpoints only (the switcher overlay was removed on request).
- Colors and fonts come only from semantic tokens in `src/index.css` / `tailwind.config.ts` (incl. `success`/`warning`); pages use no raw palette classes so one theme change restyles everything.
- The hidden section (internal code name SAGA, never shown in UI) and the Prompt Checker share `components/eai/PromptWorkbench`; every tool shows `components/eai/EaiCockpit`, and the Task Density Audit uses `densityFromSteps` from `taskDensity.ts`, so all tools report the same numbers.
- Hidden-section presets and Generator output must stay Certified (no reasons) and below 70% AI work; `src/lib/eai/presets.test.ts` enforces this for every preset and scenario.
