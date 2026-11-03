export interface Scenario {
  name: string;
  goal: string;
  microSkills: string[];
  prompt: string;
  output: string;
  tips?: string;
  warnings?: string;
  example?: unknown[];
}

export interface WorkflowPhase {
  number: number;
  title: string;
  description: string;
  scenarios: Scenario[];
}

/** Starting points for the Prompt Generator, grouped by legal workflow phase. */
export const generatorPhases: WorkflowPhase[] = [
  {
    number: 1,
    title: "Intake & Fact Gathering",
    description: "Collect facts, clarify scope, and map evidence and stakeholders.",
    scenarios: [
      {
        name: "Client Interview Planner",
        goal: "Prepare a structured interview outline to surface facts, assumptions, and objectives.",
        microSkills: ["Issue spotting", "Clarifying questions", "Goal alignment"],
        prompt: "Draft a client interview outline for [matter/topic]. Include: (1) opening context, (2) key facts to confirm, (3) stakeholders and roles, (4) documents to request, (5) follow‑ups.",
        output: "Bullet checklist with headings (no tables)",
        tips: "Keep questions neutral; capture unknowns separately.",
        warnings: "Do not infer facts; mark uncertainties for confirmation."
      },
      {
        name: "Document & Evidence Request List",
        goal: "Create a prioritized list of documents and data sources with purpose and owner.",
        microSkills: ["Evidence mapping", "Relevance justification", "Prioritization"],
        prompt: "Create a document/evidence request list for [matter/topic]. For each item, specify purpose, data owner, access constraints, and urgency.",
        output: "Prioritized bullet list with purpose and owner per item",
        tips: "Group by custodian or system; note privacy constraints.",
        warnings: "Avoid collecting excessive personal data; flag sensitive items."
      }
    ,
      {
        name: "Assumptions & Unknowns Map",
        goal: "Surface assumptions, missing inputs, and decisions needed before work proceeds.",
        microSkills: ["Assumption logging", "Requirement elicitation", "Scope control"],
        prompt: "List assumptions and unknowns for [matter/topic]. For each: state assumption/unknown, why it matters, what evidence would confirm, and next action.",
        output: "Two-section list: (A) Assumptions, (B) Unknowns — each with confirm-evidence and action",
        tips: "Separate facts from beliefs; label source or confidence.",
        warnings: "Do not invent facts; propose neutral questions to confirm."
      },
      {
        name: "Stakeholder Mapping",
        goal: "Identify stakeholders, roles, incentives, and influence to plan outreach.",
        microSkills: ["Stakeholder analysis", "Incentive mapping", "Communication planning"],
        prompt: "Identify stakeholders for [matter/topic]. For each: role, interests, likely concerns, influence level, preferred channel, and next step.",
        output: "Stakeholder list grouped by function with influence and next action",
        tips: "Include internal and external (counterparty, regulator).",
        warnings: "Avoid assumptions about motives; verify with client."
      },
      {
        name: "Evidence Traceability Plan",
        goal: "Plan how each claim will be supported by specific evidence and chain-of-custody.",
        microSkills: ["Evidence mapping", "Traceability", "Risk control"],
        prompt: "Create an evidence traceability plan for [claim/issue]. Map claim → facts → sources/documents → owner → access path → sensitivity.",
        output: "Traceability bullets per claim with source and owner",
        tips: "Capture identifiers (file name, custodian, date).",
        warnings: "Respect confidentiality and privacy constraints."
      }
    ]
  },
  {
    number: 2,
    title: "Clause Drafting & Redlining",
    description: "Draft alternatives, spot ambiguity, and propose redlines with rationale.",
    scenarios: [
      {
        name: "Ambiguity Spotting",
        goal: "Detect vagueness and risk in a clause and propose revisions.",
        microSkills: ["Ambiguity detection", "Risk articulation", "Precise drafting"],
        prompt: "Analyze this clause for ambiguity: [paste clause]. Return: (1) flagged phrase, (2) risk explanation, (3) precise rewording with rationale.",
        output: "Three-part bullet response per issue (flag, risk, revision)",
        tips: "Prefer objective terms (who/what/when/how much).",
        warnings: "Avoid expanding scope beyond the parties' intent."
      },
      {
        name: "Alternative Clause Drafting",
        goal: "Draft 2–3 clause options with pros/cons for negotiation.",
        microSkills: ["Option generation", "Trade‑off analysis", "Negotiation positioning"],
        prompt: "Draft 2–3 alternative phrasings for a clause about [topic]. For each, provide intended legal effect, key risks, and when to prefer it.",
        output: "Side‑by‑side bullet options with effect, risks, and use‑case",
        tips: "Vary strength and flexibility across options.",
        warnings: "Do not state as legal advice; mark jurisdictional sensitivities."
      }
    ,
      {
        name: "Constraint-First Clause Spec",
        goal: "Translate business constraints into a clause specification before drafting.",
        microSkills: ["Requirements translation", "Precision drafting", "Risk framing"],
        prompt: "Turn business constraints for [clause topic] into a clause spec: actors, triggers, obligations, time limits, remedies, exceptions, definitions.",
        output: "Clause specification bullets ready for drafting",
        tips: "Prefer measurable triggers and timeboxes.",
        warnings: "Do not add obligations beyond authority."
      },
      {
        name: "Redline Rationale Explainer",
        goal: "Explain each proposed redline with legal effect and negotiation angle.",
        microSkills: ["Change rationale", "Negotiation strategy", "Risk articulation"],
        prompt: "Given clause text and proposed edits for [topic], list each change, intended legal effect, risk addressed, counterparty concern, and fallback wording.",
        output: "Change log bullets per edit with effect and fallback",
        tips: "Group edits by theme (liability, IP, data, termination).",
        warnings: "Keep tone neutral and client-aligned."
      },
      {
        name: "Definitions Harmonization Audit",
        goal: "Check defined terms across document for consistency and scope creep.",
        microSkills: ["Consistency checking", "Term scoping", "Cross-referencing"],
        prompt: "Audit defined terms for [agreement]. Identify mismatches, undefined terms, cross-references, and propose corrected definitions.",
        output: "Findings list with corrected definition suggestions",
        tips: "Anchor on capitalized terms and where they appear.",
        warnings: "Do not alter negotiated meaning without flagging."
      }
    ]
  },
  {
    number: 3,
    title: "Research & Authority Check",
    description: "Frame questions, structure a memo, and check sources and jurisdictions.",
    scenarios: [
      {
        name: "Research Memo Skeleton",
        goal: "Produce a memo outline with issues, rules, analysis steps, and open questions.",
        microSkills: ["IRAC structuring", "Scope control", "Assumption tracking"],
        prompt: "Create a research memo skeleton for [issue/jurisdiction]. Include issues, governing rules to verify, key tests, factors, and evidence needed.",
        output: "Memo outline with bullet headings and tasks",
        tips: "Separate holdings from dicta; list unknowns to confirm.",
        warnings: "Do not fabricate citations; mark placeholder sources."
      },
      {
        name: "Jurisdiction Comparison Plan",
        goal: "Plan a quick comparison across 2–3 jurisdictions for a discrete issue.",
        microSkills: ["Comparative analysis", "Scope limits", "Result logging"],
        prompt: "Design a comparison plan for [issue] across [jurisdictions]. Specify key differences to check, thresholds/tests, and a consistent note‑taking format.",
        output: "Comparison checklist with consistent note format",
        tips: "Anchor on definitions and burden of proof.",
        warnings: "Call out conflicts‑of‑law triggers explicitly."
      }
    ,
      {
        name: "Search Strategy with Queries",
        goal: "Design a targeted search plan with positive/negative queries and sources.",
        microSkills: ["Query design", "Source selection", "Jurisdiction control"],
        prompt: "Create a research plan for [issue/jurisdiction]. Include initial queries, exclusions, authoritative sources, update steps, and stop conditions.",
        output: "Plan bullets with query examples and stop criteria",
        tips: "Prioritize primary sources; log search strings.",
        warnings: "Do not rely on unverified secondary sources."
      },
      {
        name: "Citation & Quotation Check",
        goal: "Verify citations and extract exact quotes with pincites.",
        microSkills: ["Citation verification", "Evidence integrity", "Note-taking"],
        prompt: "For citations related to [issue], list case/statute, holding summary, precise quote with pincite, and relevance note.",
        output: "Verification bullets per authority with quote and pincite",
        tips: "Differentiate holding vs dicta clearly.",
        warnings: "No fabricated citations; mark unresolved items."
      },
      {
        name: "Hypothesis-Driven Analysis Plan",
        goal: "Frame hypotheses and tests before deep research to avoid scope drift.",
        microSkills: ["Hypothesis framing", "Test design", "Result logging"],
        prompt: "State 2–3 hypotheses for [issue], for each: test to run, evidence needed, decision threshold, and what would falsify it.",
        output: "Hypothesis list with test, evidence, threshold, falsifier",
        tips: "Keep tests observable and jurisdiction-specific.",
        warnings: "Revise hypotheses as evidence emerges."
      }
    ]
  },
  {
    number: 4,
    title: "Risk Assessment & Compliance",
    description: "Identify risks, assign levels, and propose mitigations and owners.",
    scenarios: [
      {
        name: "Matter Risk Register",
        goal: "Build a concise risk register with level, impact, mitigation, and owner.",
        microSkills: ["Risk taxonomy", "Mitigation design", "Ownership clarity"],
        prompt: "List key legal risks for [context]. For each risk: describe, likelihood/impact (L/M/H), mitigation action, owner, and review date.",
        output: "Risk register bullets grouped by category",
        tips: "Tie mitigations to contract clauses or policies.",
        warnings: "Avoid numerical scoring unless supported by data."
      },
      {
        name: "GDPR/DPA Readiness Checklist",
        goal: "Outline a pragmatic checklist for data processing arrangements.",
        microSkills: ["Compliance mapping", "Data inventory", "Gap spotting"],
        prompt: "Create a checklist to assess DPA readiness for [processing activity]. Include roles, purposes, legal bases, transfers, subprocessors, security, and retention.",
        output: "Sectioned bullet checklist with reviewer notes",
        tips: "Flag items needing DPO input.",
        warnings: "Do not store sensitive data without necessity."
      }
    ,
      {
        name: "Control Effectiveness Review",
        goal: "Assess current controls for likelihood/impact reduction and gaps.",
        microSkills: ["Control mapping", "Gap analysis", "Mitigation planning"],
        prompt: "Evaluate controls for [risk context]. For each risk: current control, effectiveness (L/M/H) with reason, gap, and improvement action.",
        output: "Risk → control → gap → action bullets",
        tips: "Tie actions to owners and timelines.",
        warnings: "Avoid numeric scores without support."
      },
      {
        name: "What-If Risk Scenarios",
        goal: "Test plausible scenarios to see failure modes and contingencies.",
        microSkills: ["Scenario planning", "Stress testing", "Contingency design"],
        prompt: "Create 3 what-if scenarios for [context]. For each: trigger, sequence, impact, early indicators, contingency, and recovery step.",
        output: "Scenario bullets with indicators and contingency",
        tips: "Use realistic triggers; consider dependencies.",
        warnings: "Do not promise outcomes; present ranges."
      },
      {
        name: "Regulatory Change Monitor Plan",
        goal: "Plan how to monitor regulatory updates and trigger reviews.",
        microSkills: ["Regulatory tracking", "Threshold definition", "Operationalization"],
        prompt: "Design a monitoring plan for [regime/topic]. Include sources, review cadence, triggers for escalation, and change implementation steps.",
        output: "Monitoring plan bullets with triggers and cadence",
        tips: "Use official sources and industry alerts.",
        warnings: "Assign clear owners for actions."
      }
    ]
  },
  {
    number: 5,
    title: "Negotiation & Strategy",
    description: "Prepare positions, concessions, and fallback terms.",
    scenarios: [
      {
        name: "Negotiation Playbook",
        goal: "Define must‑haves, tradeables, and walk‑away points with reasons.",
        microSkills: ["BATNA/WATNA", "Priority ranking", "Concession planning"],
        prompt: "Draft a negotiation playbook for [agreement/topic]. Include objectives, prioritized terms, acceptable ranges, fallback options, and talking points.",
        output: "Playbook bullets with priorities and ranges",
        tips: "Link each stance to a business rationale.",
        warnings: "Mark positions that require client approval."
      },
      {
        name: "Term Sheet Options",
        goal: "Offer compact option sets to accelerate agreement on key terms.",
        microSkills: ["Option framing", "Risk/benefit summary", "Client alignment"],
        prompt: "Create 2–3 concise term‑sheet options for [deal/topic] covering pricing, liability, IP, data, and termination.",
        output: "Option bullets per theme with short rationale",
        tips: "Keep each option internally consistent.",
        warnings: "Note dependencies between terms."
      }
    ,
      {
        name: "Concession Ladder",
        goal: "Define staged concessions with conditions and asks in return.",
        microSkills: ["Concession planning", "Give-get mapping", "Priority control"],
        prompt: "Build a concession ladder for [deal/topic]. For each rung: offer, condition, ask-in-return, risk, and last acceptable fallback.",
        output: "Rung-by-rung bullets with give-get and fallback",
        tips: "Align with business value and risk appetite.",
        warnings: "Do not concede without reciprocal value."
      },
      {
        name: "Counterparty Persona Strategy",
        goal: "Tailor messaging and proposals to counterparty roles and incentives.",
        microSkills: ["Persona analysis", "Messaging", "Objection handling"],
        prompt: "Create negotiation personas for [deal]. For each persona: objectives, likely objections, value levers, and tailored talking points.",
        output: "Persona profiles with objections and levers",
        tips: "Base on observed behavior, not stereotypes.",
        warnings: "Keep professional and neutral."
      },
      {
        name: "Negotiation Questions Bank",
        goal: "Prepare calibrated questions to reveal constraints and priorities.",
        microSkills: ["Question design", "Active listening", "Reframing"],
        prompt: "Generate calibrated questions for [topic] to uncover constraints, hidden priorities, and BATNA/WATNA.",
        output: "Question list grouped by objective",
        tips: "Prefer open-ended, non-leading questions.",
        warnings: "Avoid disclosing client positions prematurely."
      }
    ]
  },
  {
    number: 6,
    title: "Client Communication & Deliverables",
    description: "Translate analysis into concise client‑ready outputs.",
    scenarios: [
      {
        name: "Client Email Summary",
        goal: "Summarize the situation, options, and next steps in plain English.",
        microSkills: ["Plain language", "Action orientation", "Expectation setting"],
        prompt: "Draft a client email summarizing [matter]. Include brief context, 2–3 options with pros/cons, recommended next steps, and decisions required.",
        output: "Email outline bullets with headings",
        tips: "Lead with what the client needs to do next.",
        warnings: "Avoid legalese; flag uncertainties clearly."
      },
      {
        name: "Executive Brief",
        goal: "Produce a one‑page brief for senior stakeholders.",
        microSkills: ["Synthesis", "Prioritization", "Risk framing"],
        prompt: "Create a one‑page brief on [topic] with sections: Context, Key Issues, Options, Recommendation, Risks, Timeline, Owner.",
        output: "One‑page bullet brief with fixed headings",
        tips: "Keep each bullet actionable and measurable.",
        warnings: "Do not include confidential details beyond need‑to‑know."
      }
    ,
      {
        name: "Decision Log",
        goal: "Track key decisions, rationale, owner, and follow-ups for governance.",
        microSkills: ["Record-keeping", "Governance", "Accountability"],
        prompt: "Create a decision log template for [matter]. Columns: decision, rationale, options considered, owner, date, follow-up.",
        output: "Decision log bullet structure with the columns",
        tips: "Keep entries action-oriented and time-bound.",
        warnings: "Exclude confidential details not needed."
      },
      {
        name: "Executive Slide Outline",
        goal: "Structure a short slide deck for senior review.",
        microSkills: ["Storylining", "Prioritization", "Clarity"],
        prompt: "Draft a 6-8 slide outline for [topic] with title and bullet points: Context, Issues, Options, Recommendation, Risks, Timeline.",
        output: "Slide-by-slide bullet outline",
        tips: "Lead with recommendation; one message per slide.",
        warnings: "Avoid dense text; keep it skimmable."
      },
      {
        name: "Client FAQ",
        goal: "Prepare a FAQ addressing common stakeholder questions and decisions.",
        microSkills: ["Expectation setting", "Plain language", "Objection handling"],
        prompt: "Create a client FAQ for [matter]. Include recurring questions, concise answers, decision impacts, and who to contact.",
        output: "FAQ list grouped by theme",
        tips: "Use plain English; link to next steps.",
        warnings: "Avoid legal advice; keep within engagement scope."
      }
    ]
  }
];
