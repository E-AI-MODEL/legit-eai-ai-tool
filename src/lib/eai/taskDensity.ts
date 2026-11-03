/**
 * Task density estimate from prompt text: share of cognitive work assigned to AI.
 * Each actionable line/sentence is classified as human, AI, or shared.
 * TD = (ai + 0.5 * shared) / actionable. Style/format instructions (use, keep, close...) are not counted as work. Same thresholds as the Task Density audit page.
 */

export type DensityLabel = "Human-led" | "Balanced" | "AI-heavy";

export interface TaskDensity {
  value: number; // 0..1, share of work done by AI
  label: DensityLabel;
  human: number;
  ai: number;
  shared: number;
  actionable: number;
}

export const TD_THRESHOLDS = { humanLed: 0.3, balanced: 0.7 } as const;

const HUMAN_SUBJECT = /^(?:[-•*\d.)\s]*)(?:i|we|lawyer|the lawyer|user|the user|human|reviewer|partner)\b/;
const HUMAN_MENTION = /\b(i|me|we|lawyer|user|human|reviewer|partner)\b/;
// "AI" as a topic ("AI literacy training") is not an instruction; only "you" or the AI as acting subject counts.
const AI_MENTION = /\b(you|your)\b|\b(ai|assistant|model)\s+(will|should|must|can|may|to|drafts?|writes?|decides?|reviews?|analy[sz]es?|generates?|suggests?|proposes?|prepares?|checks?)\b/;
const AI_VERB = /^(?:[-•*\d.)\s]*)(write|draft|analy[sz]e|summari[sz]e|list|extract|identify|review|give|create|generate|compare|provide|explain|check|cite|mark|reason|state|present|build|prepare|assess|flag|translate|rewrite|structure|propose|suggest|find|search|outline|calculate|determine|evaluate|research|decide|advise|interpret|negotiate|recommend|conclude)\b/;

export function densityLabel(value: number): DensityLabel {
  if (value < TD_THRESHOLDS.humanLed) return "Human-led";
  if (value < TD_THRESHOLDS.balanced) return "Balanced";
  return "AI-heavy";
}

function units(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .split(/\n|(?<=[.!?;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export type Performer = "human" | "ai" | "shared";

export interface WorkStep {
  text: string;
  performer: Performer;
  /** Relative weight of the step (1 = normal). */
  effort: number;
}

/** Split a prompt into actionable steps and classify who performs each one. */
export function classifyUnits(prompt: string): WorkStep[] {
  const steps: WorkStep[] = [];
  for (const raw of prompt.split(/\n|(?<=[.!?;])\s+/).map((s) => s.trim()).filter(Boolean)) {
    const u = raw.toLowerCase();
    if (HUMAN_SUBJECT.test(u)) {
      steps.push({ text: raw, performer: "human", effort: 1 });
      continue;
    }
    if (!(AI_MENTION.test(u) || AI_VERB.test(u))) continue;
    steps.push({ text: raw, performer: HUMAN_MENTION.test(u) ? "shared" : "ai", effort: 1 });
  }
  return steps;
}

/** TD = (ai effort + 0.5 * shared effort) / total effort. With equal effort this is the per-step count used everywhere. */
export function densityFromSteps(steps: WorkStep[]): TaskDensity {
  const count = (p: Performer) => steps.filter((s) => s.performer === p).length;
  const total = steps.reduce((a, s) => a + s.effort, 0);
  const aiWork = steps.reduce((a, s) => a + (s.performer === "ai" ? s.effort : s.performer === "shared" ? 0.5 * s.effort : 0), 0);
  const value = total ? Math.round((aiWork / total) * 100) / 100 : 0;
  return { value, label: densityLabel(value), human: count("human"), ai: count("ai"), shared: count("shared"), actionable: steps.length };
}

export function estimateTaskDensity(prompt: string): TaskDensity {
  return densityFromSteps(classifyUnits(prompt));
}

/**
 * Fewest steps the lawyer should take back (heaviest AI work first) so the
 * task is no longer AI-heavy. Empty when the split is already acceptable.
 */
export function takeBackAdvice(steps: WorkStep[]): number[] {
  const working = steps.map((s) => ({ ...s }));
  const order = working
    .map((s, i) => ({ i, w: s.performer === "ai" ? s.effort : s.performer === "shared" ? 0.5 * s.effort : 0 }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w);
  const picked: number[] = [];
  for (const { i } of order) {
    if (densityFromSteps(working).label !== "AI-heavy") break;
    working[i].performer = "human";
    picked.push(i);
  }
  return picked;
}
