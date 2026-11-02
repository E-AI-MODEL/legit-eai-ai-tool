# AGENTS.md

- All pages are open (no login); hidden access is a double-tap on the logo via `useDoubleTap` (timestamp-based, because iOS has no reliable dblclick).
- Prompt analysis, improvement and generation run client-side in `src/lib/eai/engine.ts` (deterministic symbolic rules); there is no backend — keep it that way unless the user asks for one.
