/**
 * The four legal process phases a professional prompt should walk through,
 * in order. Detection is keyword based and deterministic.
 */

export interface Phase {
  id: "facts" | "analysis" | "counter" | "signoff";
  name: string;
  keywords: string[];
  instruction: string;
}

export const PHASES: Phase[] = [
  {
    id: "facts",
    name: "1. Fact extraction",
    keywords: ["fact", "extract", "timeline", "chronolog", "parties involved", "documents provided"],
    instruction: "Extract the facts only (parties, dates, documents, amounts). No interpretation yet.",
  },
  {
    id: "analysis",
    name: "2. Analysis & legal basis",
    keywords: ["legal basis", "legal framework", "statute", "case law", "applicable rule", "analysis", "analyze", "analyse"],
    instruction: "Apply the legal framework to the facts, citing the legal basis for each step.",
  },
  {
    id: "counter",
    name: "3. Counterarguments",
    keywords: ["counterargument", "devil's advocate", "opposing view", "other party", "alternative interpretation"],
    instruction: "Give the strongest counterarguments and at least one alternative interpretation.",
  },
  {
    id: "signoff",
    name: "4. Sign-off & decision",
    keywords: ["approve", "approval", "sign-off", "sign off", "lawyer decides", "final decision"],
    instruction: "Stop and hand over: the lawyer reviews, decides, and signs off. AI does not decide.",
  },
];

export interface PhaseCoverage {
  covered: Phase["id"][];
  missing: Phase["id"][];
  /** First phase not yet covered; null when all four are present. */
  next: Phase | null;
}

export function detectPhases(prompt: string): PhaseCoverage {
  const t = prompt.toLowerCase();
  const covered: Phase["id"][] = [];
  const missing: Phase["id"][] = [];
  for (const p of PHASES) (p.keywords.some((k) => t.includes(k)) ? covered : missing).push(p.id);
  return { covered, missing, next: PHASES.find((p) => missing.includes(p.id)) ?? null };
}

/** Section added to an improved prompt when one or more phases are missing. */
export function workflowSection(): string {
  return ["Workflow (work in this order, pause after each phase)", ...PHASES.map((p) => `- ${p.name}: ${p.instruction}`)].join("\n");
}
