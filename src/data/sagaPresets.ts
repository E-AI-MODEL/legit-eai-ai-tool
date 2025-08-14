
export interface LegalPreset {
  id: string;
  label: string;
  category: string;
  jurisdiction: string;
  output_format: string;
  criteria_refs?: string[];
  prompt_template: string;
  complexity?: 'basic' | 'intermediate' | 'advanced';
  tags?: string[];
}

export const sagaPresets: LegalPreset[] = [
  {
    id: "nda_review_grid",
    label: "NDA — Review (Facts vs Analysis)",
    category: "Contracts",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Firm Guideline: NDA-v3"],
    complexity: "intermediate",
    tags: ["review", "confidentiality", "analysis"],
    prompt_template: "Hi — plan: create a clear NDA review for [matter]. I will extract facts, analyze impacts, flag decision points, and include sources and an action log.\n\nFacts (Extract)\n- Term (ISO dates), termination window (days), mutual vs one-way (boolean), governing law, venue, confidentiality scope, carve-outs, non-solicit, IP.\n- Quote the clause snippet and add a pinpoint citation for each.\n\nAnalysis (Interpretation)\n- Compare against: Firm Guideline: NDA-v3.\n- Deviations ≤5 bullets; plain-English impact; uncertainty notes; 1–2 alternatives with trade-offs.\n\nDecision points — Human approval required\n- Pause if one-way NDA, venue mismatch, or carve-outs exceed guideline.\n\nOutputs\n- Themed bullets ready for email/memo.\n\nSources & Action Log\n- List sources with pinpoints; summarize steps/tools.\n\nTone & Privacy\n- Neutral, plain English. Avoid PII; request redacted excerpts only.\n\nReflection\n- 3 insights; 3 open questions.\n\nHuman Review Hand-off\n- List items to confirm and pause."
  },
  {
    id: "dpa_review_grid",
    label: "DPA — GDPR Essentials",
    category: "Contracts",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["GDPR Arts. 28–32", "EDPB guidance"],
    complexity: "advanced",
    tags: ["GDPR", "data protection", "compliance"],
    prompt_template: "Hi — plan: review the DPA for GDPR essentials.\n\nFacts (Extract)\n- Roles, sub-processing, transfer mechanism (SCCs/TIA), security annex, breach notice SLA, audit rights, deletion/return.\n- Quote + pinpoint.\n\nAnalysis (Interpretation)\n- Compare to GDPR 28–32 + firm policy. Flag gaps; risk level (low/med/high); uncertainty notes; 1–2 remediation options.\n\nDecision points — Human approval required\n- Pause if missing SCCs/TIA, no audit rights, weak breach SLA.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "msa_redline_draft",
    label: "MSA — Tracked Changes + Comments",
    category: "Contracts",
    jurisdiction: "NL",
    output_format: "tracked_changes",
    criteria_refs: ["Firm Playbook: MSA-2025"],
    complexity: "advanced",
    tags: ["redline", "MSA", "comments"],
    prompt_template: "Hi — plan: produce tracked changes and comments.\n\nAssumptions\n- Note any missing inputs (pricing model, liability cap, SLAs).\n\nDraft — Tracked Changes\n- Align with Firm Playbook: MSA-2025.\n- Label [must-fix] / [optional]; explain briefly.\n\nAlternatives\n- Provide 1–2 fallback clauses with trade-offs for each must-fix.\n\nDecision points — Human approval required\n- Pause on liability cap, indemnities, governing law, termination for convenience.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "sow_scope_check",
    label: "SOW — Scope & Deliverables Check",
    category: "Contracts",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["Firm Playbook: SOW-2025"],
    complexity: "intermediate",
    tags: ["SOW", "scope", "deliverables"],
    prompt_template: "Hi — plan: check scope clarity and risk in the SOW.\n\nFacts (Extract)\n- Deliverables, acceptance tests, change control, payment milestones, IP, dependencies.\n\nAnalysis (Interpretation)\n- Ambiguities; scope creep risks; acceptance coverage; alternatives.\n\nDecision points — Human approval required\n- Pause if acceptance undefined or IP ambiguous.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "dora_it_contract",
    label: "DORA — IT Services Contract Scan",
    category: "Regulatory",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["DORA 2025 checklist"],
    complexity: "advanced",
    tags: ["DORA", "IT services", "compliance"],
    prompt_template: "Hi — plan: scan for DORA-critical requirements.\n\nFacts (Extract)\n- ICT third-party risk, incident reporting windows, testing, resilience measures.\n\nAnalysis\n- Gaps vs DORA; remediation options with trade-offs.\n\nDecision points — Human approval required\n- Pause if incident windows or testing regime missing.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "mipa_assets",
    label: "M&A — Purchase Agreement (Assets)",
    category: "Transactions",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Firm M&A Playbook"],
    complexity: "advanced",
    tags: ["M&A", "assets", "purchase"],
    prompt_template: "Hi — plan: review a Dutch asset purchase agreement.\n\nFacts (Extract)\n- Assets list, excluded assets, price, adjustments, reps & warranties, indemnities, covenants, closing conditions.\n\nAnalysis\n- Deviations vs playbook; risk bullets; alternatives.\n\nDecision points — Human approval required\n- Pause on uncapped indemnity or undefined adjustments.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "mshare_spa",
    label: "M&A — SPA Redline Hints",
    category: "Transactions",
    jurisdiction: "EU",
    output_format: "tracked_changes",
    criteria_refs: ["Firm M&A Clauses 2025"],
    complexity: "advanced",
    tags: ["M&A", "SPA", "redline"],
    prompt_template: "Hi — plan: propose tracked changes and comments to SPA clauses most often negotiated.\n\nDraft — Tracked Changes\n- Reps materiality; sandbagging; escrow; MAC; earn-out.\n\nAlternatives & Trade-offs\n- Provide 2 options where helpful.\n\nDecision points — Human approval required\n- Pause on MAC or indemnity baskets.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "litigation_case_memo",
    label: "Litigation — Case Assessment Memo",
    category: "Disputes",
    jurisdiction: "NL",
    output_format: "headings",
    complexity: "intermediate",
    tags: ["litigation", "case assessment", "memo"],
    prompt_template: "Hi — plan: prepare a concise case memo.\n\nFacts (Extract)\n- Parties, timeline (ISO), claims/defenses, exhibits (pinpoints).\n\nIssues & Law\n- Cite statutes/cases; uncertainty notes.\n\nAnalysis\n- Arguments for/against; likely counter-arguments; 1–2 paths with trade-offs.\n\nDecision points — Human approval required\n- Settlement posture, discovery scope, expert retention.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "pre_mediation_brief",
    label: "Disputes — Pre‑Mediation Brief",
    category: "Disputes",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "intermediate",
    tags: ["mediation", "settlement", "brief"],
    prompt_template: "Hi — plan: prepare a neutral pre‑mediation brief.\n\nSections\n- Background; positions; key interests; BATNA/WATNA; settlement ranges; confidential points.\n\nDecision points — Human approval required\n- Validate settlement range boundaries.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "investigation_plan",
    label: "Internal Investigation — Plan",
    category: "Investigations",
    jurisdiction: "EU",
    output_format: "headings",
    complexity: "advanced",
    tags: ["investigation", "internal", "plan"],
    prompt_template: "Hi — plan: outline an internal investigation.\n\nSections\n- Scope & questions; sources & collection; legal constraints; timeline; risks & mitigations; decision points (pause); reporting format; owner/contact.\n\nSources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "whistle_review",
    label: "Whistleblower Intake — First Pass",
    category: "Investigations",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["EU Whistleblower Directive"],
    complexity: "advanced",
    tags: ["whistleblower", "intake", "review"],
    prompt_template: "Hi — plan: structure an initial review of a whistleblower report.\n\nFacts (Extract)\n- Allegations, dates, persons, evidence provided (pinpoints).\n\nAnalysis\n- Urgency, legal constraints, confidentiality measures.\n\nDecision points — Human approval required\n- Escalation, interim safeguards, investigator assignment.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "privacy_tia",
    label: "Privacy — TIA Outline",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "headings",
    criteria_refs: ["EDPB TIA factors"],
    complexity: "advanced",
    tags: ["privacy", "TIA", "transfer"],
    prompt_template: "Hi — plan: create a Transfer Impact Assessment outline.\n\nSections\n- Data categories; destinations; safeguards; residual risks; mitigation options; decision points (pause).\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "cookie_policy_review",
    label: "Privacy — Cookie Policy Review",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["ePrivacy", "GDPR"],
    complexity: "intermediate",
    tags: ["cookies", "privacy", "policy"],
    prompt_template: "Hi — plan: review cookie policy basics.\n\nFacts (Extract)\n- Categories, purposes, retention, third parties, consent design.\n\nAnalysis\n- Compliance gaps; redesign suggestions; alternatives.\n\nDecision points — Human approval required\n- Non-essential cookies approach.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "employment_settlement",
    label: "Employment — Settlement Agreement Scan",
    category: "Employment",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Dutch employment law checklist"],
    complexity: "intermediate",
    tags: ["employment", "settlement", "agreement"],
    prompt_template: "Hi — plan: scan a Dutch settlement agreement.\n\nFacts (Extract)\n- Termination date, consideration, confidentiality, non-disparagement, references, tax wording.\n\nAnalysis\n- Risk items; compliance notes; 1–2 alternatives.\n\nDecision points — Human approval required\n- Tax wording; releases.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "employment_policy",
    label: "Employment — Policy Update Note",
    category: "Employment",
    jurisdiction: "EU",
    output_format: "headings",
    complexity: "basic",
    tags: ["employment", "policy", "update"],
    prompt_template: "Hi — plan: summarize the policy update.\n\nSections\n- What changed; implications; who is affected; decision points (pause); next steps; owner.\n\nSources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "ip_license_check",
    label: "IP — License Agreement Scan",
    category: "IP",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["IP Playbook 2025"],
    complexity: "intermediate",
    tags: ["IP", "license", "agreement"],
    prompt_template: "Hi — plan: check an IP license.\n\nFacts (Extract)\n- Field of use, territory, exclusivity, sublicensing, royalties, improvements, termination.\n\nAnalysis\n- Playbook deviations; risk bullets; alternatives.\n\nDecision points — Human approval required\n- Exclusivity or sublicensing changes.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "trademark_clearance",
    label: "IP — Trademark Clearance Memo",
    category: "IP",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "intermediate",
    tags: ["trademark", "clearance", "memo"],
    prompt_template: "Hi — plan: prepare a trademark clearance memo.\n\nFacts (Extract)\n- Marks compared, Nice classes, search hits (pinpoints).\n\nAnalysis\n- Likelihood of confusion; registry notes; alternatives.\n\nDecision points — Human approval required\n- Filing strategy and classes.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "gdpr_breach_note",
    label: "Breach — Initial Note to Client",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["GDPR Arts. 33–34"],
    complexity: "advanced",
    tags: ["GDPR", "breach", "notification"],
    prompt_template: "Hi — plan: draft an initial breach note.\n\nFacts (Extract)\n- What happened, when, data types, data subjects, containment.\n\nAnalysis\n- Notification thresholds; risks; options.\n\nDecision points — Human approval required\n- Notify DPA? Notify data subjects? Timing.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "procurement_rfp_review",
    label: "Procurement — RFP Legal Scan",
    category: "Commercial",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "basic",
    tags: ["procurement", "RFP", "review"],
    prompt_template: "Hi — plan: scan the RFP for legal constraints.\n\nFacts (Extract)\n- Mandatory terms, liability limits, IP claims, privacy/security asks.\n\nAnalysis\n- Risks & negotiation levers; alternatives.\n\nDecision points — Human approval required\n- Non-negotiables.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "supplier_dd",
    label: "Supplier Due Diligence — Legal",
    category: "Commercial",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "intermediate",
    tags: ["supplier", "due diligence", "legal"],
    prompt_template: "Hi — plan: outline supplier legal DD.\n\nFacts (Extract)\n- Corporate data, sanctions, litigation, compliance attestations.\n\nAnalysis\n- Red flags; missing documents; alternatives.\n\nDecision points — Human approval required\n- Go/no‑go criteria.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "esg_clause_review",
    label: "ESG — Clause Review",
    category: "ESG",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["ESG Policy 2025"],
    complexity: "intermediate",
    tags: ["ESG", "clause", "review"],
    prompt_template: "Hi — plan: review ESG clauses for feasibility/compliance.\n\nFacts (Extract)\n- Reporting duties, audit rights, targets, remedies.\n\nAnalysis\n- Risk/feasibility; alternatives.\n\nDecision points — Human approval required\n- Targets and audit thresholds.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "sanctions_screening_note",
    label: "Sanctions — Screening Note",
    category: "Compliance",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "basic",
    tags: ["sanctions", "screening", "compliance"],
    prompt_template: "Hi — plan: prepare a sanctions screening note.\n\nFacts (Extract)\n- Parties, jurisdictions, screening hits.\n\nAnalysis\n- Risk rating; clearance options.\n\nDecision points — Human approval required\n- Proceed/hold pathways.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "antitrust_dawnraid_card",
    label: "Antitrust — Dawn Raid Card",
    category: "Compliance",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "basic",
    tags: ["antitrust", "dawn raid", "card"],
    prompt_template: "Hi — plan: prepare a quick card.\n\nSections\n- Rights, do's/don'ts, internal contacts, first steps.\n\nDecision points — Human approval required\n- Escalation path.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "merger_board_brief",
    label: "M&A — Board Brief 1‑Pager",
    category: "Transactions",
    jurisdiction: "EU",
    output_format: "headings",
    complexity: "advanced",
    tags: ["M&A", "board", "brief"],
    prompt_template: "Hi — plan: create a one‑page board brief.\n\nSections\n- What's happening; options; risks; decision points; recommendation; next steps; owner.\n\nSources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "client_faq",
    label: "Client FAQ — Matter‑Specific",
    category: "Client Comms",
    jurisdiction: "NL",
    output_format: "headings",
    complexity: "basic",
    tags: ["client", "FAQ", "communication"],
    prompt_template: "Hi — plan: prepare a clean client FAQ for [matter].\n\nThemes\n- Process & Timing; Costs & Billing; Legal Risks; Client Responsibilities; Communications.\n\nFor each FAQ item\n- Plain question; concise answer; decision impact; who to contact.\n\nAlternatives & Trade-offs\n- Provide 1–2 where relevant.\n\nDecision points — Human approval required\n- Pause where rights or duties change.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "client_email_update",
    label: "Client Email — Update & Next Steps",
    category: "Client Comms",
    jurisdiction: "NL",
    output_format: "bullets",
    complexity: "basic",
    tags: ["client", "email", "update"],
    prompt_template: "Hi — plan: draft a short client update.\n\nSections\n- What changed; open items; decision points (pause); next steps; when you will report back.\n\nTone & Privacy\n- Plain, calm; avoid PII.\n\nSources & Action Log\n- As above."
  },
  {
    id: "press_statement_legal",
    label: "External — Press Holding Statement",
    category: "Client Comms",
    jurisdiction: "EU",
    output_format: "bullets",
    complexity: "intermediate",
    tags: ["press", "statement", "external"],
    prompt_template: "Hi — plan: propose a holding statement with legal guardrails.\n\nSections\n- Facts we can confirm; what is under review; next update time; contact.\n\nDecision points — Human approval required\n- Approvals and legal risk lines.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "outside_counsel_guidelines",
    label: "Outside Counsel Guidelines — Compliance",
    category: "Client Comms",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["Client OCG 2025"],
    complexity: "intermediate",
    tags: ["outside counsel", "guidelines", "compliance"],
    prompt_template: "Hi — plan: check engagement letter vs Client OCG 2025.\n\nFacts (Extract)\n- Billing rules, staffing, conflicts, approvals, reporting cadence, confidentiality, data security.\n\nAnalysis\n- Deviations; impact; remedies; alternatives.\n\nDecision points — Human approval required\n- Items needing client pre‑approval.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "legal_research_bounded",
    label: "Legal Research — Bounded Sources",
    category: "Research",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Firm DB", "Official statute site"],
    complexity: "intermediate",
    tags: ["research", "legal", "bounded"],
    prompt_template: "Hi — plan: answer using only approved sources.\n\nFacts (Extract)\n- Exact passages with pinpoint citations.\n\nInterpretation\n- Explain the rule in plain English; apply to [matter]; uncertainty and gaps.\n\nAlternatives & Trade-offs\n- 1–2 pathways; implications.\n\nDecision points — Human approval required\n- Escalate if no on‑point authority.\n\nOutputs, Sources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  },
  {
    id: "compare_term_sheets",
    label: "Compare — Term Sheets",
    category: "Research",
    jurisdiction: "EU",
    output_format: "table",
    complexity: "basic",
    tags: ["compare", "term sheets", "analysis"],
    prompt_template: "Hi — plan: compare term sheets in a compact table.\n\nFacts (Extract)\n- Line‑by‑line key fields with pinpoints.\n\nAnalysis\n- Material differences, risks, negotiation levers.\n\nDecision points — Human approval required\n- Pause on any non‑standard term.\n\nOutputs\n- 1 table + 5 bullets summary.\n\nSources & Action Log, Tone & Privacy, Reflection, Hand-off\n- As above."
  }
];

export const presetCategories = [
  { id: "Contracts", name: "Contracts", icon: "FileText", description: "Review and analyze contractual documents" },
  { id: "Transactions", name: "Transactions", icon: "Briefcase", description: "M&A and transaction support" },
  { id: "Disputes", name: "Disputes", icon: "Scale", description: "Litigation and dispute resolution" },
  { id: "Investigations", name: "Investigations", icon: "Search", description: "Internal investigations and compliance" },
  { id: "Privacy", name: "Privacy", icon: "Shield", description: "Data protection and privacy matters" },
  { id: "Employment", name: "Employment", icon: "Users", description: "Employment law and HR matters" },
  { id: "IP", name: "IP", icon: "Lightbulb", description: "Intellectual property matters" },
  { id: "Commercial", name: "Commercial", icon: "Building", description: "Commercial and procurement matters" },
  { id: "ESG", name: "ESG", icon: "Leaf", description: "Environmental and sustainability" },
  { id: "Compliance", name: "Compliance", icon: "CheckCircle", description: "Regulatory compliance matters" },
  { id: "Client Comms", name: "Client Comms", icon: "MessageSquare", description: "Client communication and updates" },
  { id: "Research", name: "Research", icon: "BookOpen", description: "Legal research and analysis" },
  { id: "Regulatory", name: "Regulatory", icon: "AlertTriangle", description: "Regulatory compliance and reviews" },
  { id: "Risk", name: "Risk", icon: "AlertCircle", description: "Risk assessment and management" },
  { id: "Policy", name: "Policy", icon: "FileCheck", description: "Policy development and review" }
];
