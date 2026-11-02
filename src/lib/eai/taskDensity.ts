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
const HUMAN_MENTION = /\b(i|me|my|we|lawyer|user|human|reviewer|partner)\b/;
const AI_MENTION = /\b(you|your|ai|assistant|model)\b/;
const AI_VERB = /^(?:[-•*\d.)\s]*)(write|draft|analy[sz]e|summari[sz]e|list|extract|identify|review|give|create|generate|compare|provide|explain|check|cite|mark|reason|state|present|build|prepare|assess|flag|translate|rewrite|structure|propose|suggest|find|search|outline|calculate|determine|evaluate)\b/;

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

export function estimateTaskDensity(prompt: string): TaskDensity {
  let human = 0;
  let ai = 0;
  let shared = 0;
  for (const u of units(prompt)) {
    if (HUMAN_SUBJECT.test(u)) {
      human++;
      continue;
    }
    const aiAct = AI_MENTION.test(u) || AI_VERB.test(u);
    if (!aiAct) continue;
    if (HUMAN_MENTION.test(u)) shared++;
    else ai++;
  }
  const actionable = human + ai + shared;
  const value = actionable ? (ai + 0.5 * shared) / actionable : 0;
  const rounded = Math.round(value * 100) / 100;
  return { value: rounded, label: densityLabel(rounded), human, ai, shared, actionable };
}
