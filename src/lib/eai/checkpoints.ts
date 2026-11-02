/**
 * Human-in-the-loop checkpoints shown live while the lawyer writes a prompt.
 * Pure and deterministic: each checkpoint is open or closed based on the text.
 */
import { analyzePrompt, type EaiResult } from "./engine";
import { checkConfidentiality } from "./certificate";
import { detectPhases } from "./workflowPhases";

export interface Checkpoint {
  id: "sources" | "lawyerDecides" | "privacy" | "counter" | "audit";
  label: string;
  ok: boolean;
  hint: string;
}

const passed = (results: EaiResult[], rubric: string) => results.find((r) => r.rubric === rubric)?.status === "pass";

export function humanCheckpoints(prompt: string): Checkpoint[] {
  const t = prompt.toLowerCase();
  const results = analyzePrompt(prompt);
  const pii = checkConfidentiality(prompt);
  return [
    {
      id: "sources",
      label: "Sources required",
      ok: /\b(source|sources|cite|citation|statute|case law|article \d)/.test(t),
      hint: "Ask the AI to cite a source for every legal statement.",
    },
    {
      id: "lawyerDecides",
      label: "Lawyer decides",
      ok: passed(results, "Agency & Didactic Controllability"),
      hint: "Say that the lawyer reviews and approves; the AI does not decide.",
    },
    {
      id: "privacy",
      label: "No personal data",
      ok: pii.length === 0,
      hint: pii.length ? `Remove or redact: ${pii.join(", ")}.` : "No personal data detected.",
    },
    {
      id: "counter",
      label: "Counterarguments",
      ok: detectPhases(prompt).covered.includes("counter"),
      hint: "Ask for the strongest counterargument or alternative view.",
    },
    {
      id: "audit",
      label: "Audit trail",
      ok: passed(results, "Compliance, Audit & Logging"),
      hint: "Ask for an action log of decisions and who made them.",
    },
  ];
}
