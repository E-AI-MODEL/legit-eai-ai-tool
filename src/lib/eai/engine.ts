/**
 * EAI rule engine — runs fully in the browser, no backend.
 * Symbolic rules decide quality; output is deterministic for the same input.
 */

import { detectPhases, workflowSection } from "./workflowPhases";

export type EaiStatus = "pass" | "warning" | "fail";

export interface EaiRubric {
  rubric: string;
  flag: string;
  check: string;
  advice: string;
}

export interface EaiResult extends EaiRubric {
  status: EaiStatus;
}

export const RUBRICS: EaiRubric[] = [
  {
    rubric: "Cognitive Ownership & Traceability",
    flag: "🟠 Traceability missing",
    check: "Prompt does not require users to reconstruct or justify their own reasoning; no trace-back or justification mapping.",
    advice: "Add a step for user to annotate, explain, or justify acceptance/rejection of AI output.",
  },
  {
    rubric: "Agency & Didactic Controllability",
    flag: "🚨 Agency risk",
    check: "Unclear or missing specification of who decides (AI or human); no explicit review/approval workflow.",
    advice: "Define exact roles: when AI suggests, when human reviews/approves, and where handover occurs.",
  },
  {
    rubric: "Reverse Scaffolding/Task Density",
    flag: "⚠️ Reverse scaffolding",
    check: "AI is assigned most or all thinking, drafting, and review steps; user is passive.",
    advice: "Distribute key steps: require user to plan, draft, or reflect before/after AI involvement.",
  },
  {
    rubric: "Sycophancy & Drift Awareness",
    flag: "🟡 Drift risk",
    check: "Prompt lacks user-AI comparison, critique, or challenge step; risk of passive alignment.",
    advice: "Ask user to compare their reasoning to AI, challenge differences, and justify agreement/disagreement.",
  },
  {
    rubric: "Compliance, Audit & Logging",
    flag: "🔒 Audit trail missing",
    check: "No mention of how decisions or outputs will be logged for audit/compliance.",
    advice: "Specify who logs decisions, changes, and rationale; require an audit trail.",
  },
  {
    rubric: "Bias, Inclusion & Professional Neutrality",
    flag: "🚨 Potential bias",
    check: "Prompt uses absolute/biased terms, or lacks instruction for alternatives/perspectives.",
    advice: "Use neutral language; require multiple viewpoints or explicit alternative interpretations.",
  },
  {
    rubric: "Output Specification & Structure",
    flag: "⚪ Output format missing",
    check: "Output structure is not specified or is ambiguous.",
    advice: "State required format: table, memo, checklist, log; assign section reviewers if needed.",
  },
  {
    rubric: "Problem Complexity & Visible Reasoning",
    flag: "⚠️ Shallow reasoning",
    check: "Prompt requests only final answer, no breakdown, no trace or alternative solutions.",
    advice: "Request stepwise reasoning, breakdowns, and explicit reasoning traces.",
  },
  {
    rubric: "Error & Failure Analysis",
    flag: "🟠 Error awareness missing",
    check: "No error detection, correction, or reflection step in the prompt.",
    advice: "Add a requirement to identify, reflect on, and correct mistakes or edge cases.",
  },
  {
    rubric: "Legal Learning Mode",
    flag: "🟣 Reflection missing",
    check: "Prompt does not ask for user reflection, learning summary, or uncertainty analysis.",
    advice: "Require summary of insights, open questions, or next steps for deeper learning.",
  },
];

export const RUBRIC_KEYWORDS: Record<string, string[]> = {
  "Cognitive Ownership & Traceability": ["justify", "explain", "reasoning", "trace", "annotate", "reconstruct", "source", "cite"],
  "Agency & Didactic Controllability": ["review", "approve", "decide", "human", "final decision", "handover", "sign-off", "lawyer confirms"],
  "Reverse Scaffolding/Task Density": ["plan", "draft", "reflect", "before", "after", "user", "my own", "i will"],
  "Sycophancy & Drift Awareness": ["compare", "critique", "challenge", "disagree", "counterargument", "devil's advocate"],
  "Compliance, Audit & Logging": ["log", "record", "audit", "track", "document", "action log"],
  "Bias, Inclusion & Professional Neutrality": ["consider", "alternative", "perspective", "viewpoint", "neutral", "both parties"],
  "Output Specification & Structure": ["format", "table", "list", "structure", "memo", "checklist", "bullet", "sections"],
  "Problem Complexity & Visible Reasoning": ["step", "reasoning", "breakdown", "trace", "explain how", "stepwise"],
  "Error & Failure Analysis": ["error", "mistake", "correct", "check", "verify", "edge case", "risk"],
  "Legal Learning Mode": ["reflection", "learn", "insight", "summary", "open question", "uncertain"],
};

const BIASED_TERMS = ["always", "never", "obviously", "clearly", "definitely", "undeniably"];
const AI_DOMINANCE = ["ai will", "ai should", "ai must", "do everything", "write the whole", "decide for me"];

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

/** Deterministic rubric check of a prompt. */
export function analyzePrompt(prompt: string): EaiResult[] {
  const t = prompt.toLowerCase();
  return RUBRICS.map((r) => {
    const keys = RUBRIC_KEYWORDS[r.rubric] ?? [];
    const hit = has(t, keys);
    let status: EaiStatus;
    switch (r.rubric) {
      case "Agency & Didactic Controllability":
      case "Compliance, Audit & Logging":
        status = hit ? "pass" : "fail";
        break;
      case "Reverse Scaffolding/Task Density": {
        const dominant = has(t, AI_DOMINANCE);
        status = hit && !dominant ? "pass" : hit ? "warning" : "fail";
        break;
      }
      case "Bias, Inclusion & Professional Neutrality": {
        const biased = has(t, BIASED_TERMS);
        status = !biased && hit ? "pass" : !biased ? "warning" : "fail";
        break;
      }
      default:
        status = hit ? "pass" : "warning";
    }
    return { ...r, status };
  });
}

/** Professional section added to a prompt for each rubric that did not pass. */
const FIX_SECTIONS: Record<string, string> = {
  "Cognitive Ownership & Traceability":
    "Traceability\n- Cite the source (statute, case law, contract clause, document) for every legal statement.\n- Mark each point as Fact, Interpretation, or Assumption.\n- I will annotate which conclusions I accept or reject and why.",
  "Agency & Didactic Controllability":
    "Roles & Human Control\n- AI: extracts, structures, and suggests. AI does not decide.\n- Lawyer: reviews, amends, and approves every conclusion before use.\n- Stop at each decision point and ask for my explicit approval.",
  "Reverse Scaffolding/Task Density":
    "Task Division\n- Before you start: ask me for my own initial view and key concerns.\n- Build on my view rather than replacing it.\n- Leave the final legal assessment and client advice to me.",
  "Sycophancy & Drift Awareness":
    "Critical Challenge\n- Compare your analysis with my initial view and list the differences.\n- Give the strongest counterargument (devil's advocate) to the main conclusion.\n- Do not agree with me by default; flag where my reasoning is weak.",
  "Compliance, Audit & Logging":
    "Audit Trail\n- End with an Action Log: decisions taken, by whom (AI suggestion / lawyer decision), date, and rationale.\n- Keep client data confidential; flag any personal data that should be redacted.",
  "Bias, Inclusion & Professional Neutrality":
    "Neutrality\n- Use neutral, non-absolute language.\n- Present the position of all parties involved and at least one alternative interpretation.",
  "Output Specification & Structure":
    "Output Format\n- Use headed sections with bullet points: Facts, Legal Framework, Analysis, Risks, Options, Open Points.\n- Keep it concise and in plain professional English.",
  "Problem Complexity & Visible Reasoning":
    "Visible Reasoning\n- Reason step by step: facts → applicable rule → application → conclusion.\n- Make every intermediate step explicit; no unexplained conclusions.",
  "Error & Failure Analysis":
    "Error & Risk Check\n- Identify possible errors, missing facts, and edge cases.\n- State the level of certainty per conclusion (high / medium / low) and what would change it.",
  "Legal Learning Mode":
    "Reflection & Hand-off\n- Close with: 3 key insights, 3 open questions, and the items I must verify or approve.",
};

function stripNoise(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Improve a prompt: keep the user's own text as the task, add only the
 * professional EAI sections for rubrics that did not pass.
 */
export function improvePrompt(prompt: string, results: EaiResult[] = analyzePrompt(prompt)): string {
  const task = stripNoise(prompt);
  const missing = results.filter((r) => r.status !== "pass").map((r) => FIX_SECTIONS[r.rubric]).filter(Boolean);

  const parts = [
    "Role\n- Act as a careful legal research and drafting assistant supporting a qualified lawyer. You support; the lawyer decides.",
    `Task\n${task}`,
    ...missing,
    ...(detectPhases(task).missing.length ? [workflowSection()] : []),
    "Start\n- Confirm your understanding of the task in one line, list any missing information you need, then proceed.",
  ];
  return parts.join("\n\n");
}

/** Build a complete professional prompt from a short topic description. */
export function generatePrompt(topic: string): string {
  const t = topic.trim();
  return improvePrompt(t, RUBRICS.map((r) => ({ ...r, status: "warning" as EaiStatus })));
}

export function scoreResults(results: EaiResult[]): number {
  if (!results.length) return 0;
  const w = { pass: 100, warning: 55, fail: 15 } as const;
  return Math.round(results.reduce((a, r) => a + w[r.status], 0) / results.length);
}
