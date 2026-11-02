/**
 * Full EAI assessment of a prompt and a traceable verification certificate.
 * Everything is deterministic except the issue timestamp, which is passed in.
 */
import { analyzePrompt, scoreResults, type EaiResult } from "./engine";
import { estimateTaskDensity, type TaskDensity } from "./taskDensity";
import { detectPhases, PHASES, type PhaseCoverage } from "./workflowPhases";

export const RULE_VERSION = "EAI-rules 2.0";

export type ConfidentialityFinding = "email" | "phone" | "iban" | "bsn";

const PII_PATTERNS: Record<ConfidentialityFinding, RegExp> = {
  email: /[\w.+-]+@[\w-]+\.[\w.]+/,
  iban: /\b[A-Z]{2}\d{2}\s?[A-Z]{4}\s?(?:\d\s?){10}\b/,
  phone: /(?:\+31|\b0)[\s-]?6[\s-]?(?:\d[\s-]?){8}\b|\+\d{2}[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{3,4}/,
  bsn: /\b\d{9}\b/,
};

export function checkConfidentiality(prompt: string): ConfidentialityFinding[] {
  return (Object.keys(PII_PATTERNS) as ConfidentialityFinding[]).filter((k) => PII_PATTERNS[k].test(prompt));
}

export interface Assessment {
  results: EaiResult[];
  score: number;
  density: TaskDensity;
  phases: PhaseCoverage;
  confidentiality: ConfidentialityFinding[];
}

export function assessPrompt(prompt: string): Assessment {
  const results = analyzePrompt(prompt);
  return {
    results,
    score: scoreResults(results),
    density: estimateTaskDensity(prompt),
    phases: detectPhases(prompt),
    confidentiality: checkConfidentiality(prompt),
  };
}

export type Verdict = "Certified" | "Conditional" | "Not certified";

export interface Certificate {
  id: string;
  issuedAt: string;
  ruleVersion: string;
  verdict: Verdict;
  reasons: string[];
  assessment: Assessment;
}

/** FNV-1a 32-bit: same prompt + rule version gives the same certificate id. */
function fingerprint(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function decideVerdict(a: Assessment): { verdict: Verdict; reasons: string[] } {
  const reasons: string[] = [];
  const fails = a.results.filter((r) => r.status === "fail");
  fails.forEach((r) => reasons.push(`Rule failed: ${r.rubric}`));
  if (a.confidentiality.length) reasons.push(`Possible personal data: ${a.confidentiality.join(", ")}`);
  if (fails.length || a.confidentiality.length) return { verdict: "Not certified", reasons };

  if (a.density.label === "AI-heavy") reasons.push(`AI does most of the thinking (task density ${Math.round(a.density.value * 100)}%)`);
  if (a.phases.missing.length) reasons.push(`Missing phases: ${a.phases.missing.map((id) => PHASES.find((p) => p.id === id)!.name).join(", ")}`);
  a.results.filter((r) => r.status === "warning").forEach((r) => reasons.push(`Rule warning: ${r.rubric}`));
  return { verdict: reasons.length ? "Conditional" : "Certified", reasons };
}

export function issueCertificate(prompt: string, now: Date = new Date()): Certificate {
  const assessment = assessPrompt(prompt);
  const { verdict, reasons } = decideVerdict(assessment);
  return {
    id: `EAI-${fingerprint(`${RULE_VERSION}|${prompt}`)}`,
    issuedAt: now.toISOString(),
    ruleVersion: RULE_VERSION,
    verdict,
    reasons,
    assessment,
  };
}

/** Plain-text certificate for copying into a file note or audit log. */
export function renderCertificate(c: Certificate): string {
  const a = c.assessment;
  const passed = a.results.filter((r) => r.status === "pass").length;
  return [
    `EAI Verification Certificate ${c.id}`,
    `Issued: ${c.issuedAt}`,
    `Rules: ${c.ruleVersion}`,
    `Verdict: ${c.verdict}`,
    `Score: ${a.score}/100 (${passed}/${a.results.length} rules passed)`,
    `Task density: ${Math.round(a.density.value * 100)}% AI (${a.density.label})`,
    `Phases covered: ${a.phases.covered.length}/${PHASES.length}`,
    `Confidentiality: ${a.confidentiality.length ? a.confidentiality.join(", ") : "no personal data detected"}`,
    ...(c.reasons.length ? ["Notes:", ...c.reasons.map((r) => `- ${r}`)] : []),
    "Checked by rules only; the lawyer remains responsible for the final decision.",
  ].join("\n");
}
