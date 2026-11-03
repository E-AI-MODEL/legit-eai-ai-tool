export interface LegalPreset {
  id: string;
  label: string;
  category: string;
  jurisdiction: string;
  output_format: string;
  criteria_refs?: string[];
  prompt_template: string;
  tags?: string[];
  complexity?: string;
}

export const presetCategories = [
  { id: "Contracts", name: "Contracts", icon: "FileText", description: "Contract review and drafting" },
  { id: "Transactions", name: "M&A", icon: "Briefcase", description: "Mergers and acquisitions" },
  { id: "Disputes", name: "Disputes", icon: "Scale", description: "Litigation and dispute resolution" },
  { id: "Investigations", name: "Investigations", icon: "Search", description: "Internal investigations" },
  { id: "Privacy", name: "Privacy", icon: "Shield", description: "GDPR and privacy compliance" },
  { id: "Employment", name: "Employment", icon: "Users", description: "Employment law matters" },
  { id: "IP", name: "IP", icon: "Lightbulb", description: "Intellectual property" },
  { id: "Commercial", name: "Commercial", icon: "Building", description: "Commercial transactions" },
  { id: "ESG", name: "ESG", icon: "Leaf", description: "ESG and sustainability" },
  { id: "Compliance", name: "Compliance", icon: "CheckCircle", description: "Regulatory compliance" },
  { id: "Client Comms", name: "Client Comms", icon: "MessageSquare", description: "Client communications" },
  { id: "Research", name: "Research", icon: "BookOpen", description: "Legal research" },
  { id: "Risk", name: "Risk", icon: "AlertTriangle", description: "Risk management" },
  { id: "Policy", name: "Policy", icon: "FileCheck", description: "Policy development" },
  { id: "Assist", name: "Assist", icon: "AlertCircle", description: "General assistance" }
];

export const sagaPresets: LegalPreset[] = [
  {
    id: "nda_review_grid",
    label: "NDA — Review (Facts vs Analysis)",
    category: "Contracts",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Firm Guideline: NDA-v3"],
    tags: ["contracts", "confidentiality", "review"],
    complexity: "intermediate",
    prompt_template: `Hi — I need a systematic NDA review for this matter. I'll extract key facts, analyze against our guidelines, flag decision points, and provide complete documentation.

**Facts (Extract)**
Please identify and extract:
- Contract term (start/end dates in ISO format)
- Termination window (number of days notice required)
- Structure: mutual or one-way confidentiality (specify which party is disclosing)
- Governing law and jurisdiction/venue clauses
- Confidentiality scope (what information is covered)
- Carve-outs and exceptions (public information, independently developed, etc.)
- Non-solicitation or non-compete provisions
- Intellectual property treatment and ownership

For each item, quote the exact clause language and provide pinpoint citations (section/page numbers).

**Analysis (Interpretation)**
Compare all terms against our Firm Guideline: NDA-v3 standard positions:
- List any deviations from guideline in 5 bullets or fewer
- Explain impact of each deviation in plain English
- Note any unclear or ambiguous language that creates uncertainty
- Provide 1-2 alternative approaches with trade-offs for problematic terms

**Decision Points — Human Approval Required**
Pause and seek approval before proceeding if:
- One-way NDA heavily favors counterparty
- Venue/jurisdiction differs from our standard preferences
- Confidentiality carve-outs exceed guideline parameters
- Term length exceeds our standard maximums

**Outputs**
Deliver analysis in themed bullet points suitable for email or memo format.

**Counterarguments (Other Party's View)**
- Strongest counterargument the other party will raise against our preferred term and carve-outs
- Alternative interpretation of the confidentiality scope and when a Dutch court might follow it (reasonableness and fairness, art. 6:248 BW)
- Where both parties' positions are commercially reasonable and what would shift the balance
- Risks that weaken my conclusion if the NDA turns out to be one-way in practice
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I first mark which extracted facts I accept before any deviation analysis starts.
- I decide which deviations we accept, negotiate or reject.
- I write the covering note to the client myself.

**Sources & Action Log**
- List all source documents with pinpoint citations
- Document analysis steps and any tools used
- Note assumptions made and information limitations

**Communication & Privacy Standards**
- Use neutral, professional language with appropriate qualifiers
- Apply terms like "appears," "suggests," "likely" rather than absolute statements
- Protect PII by requesting redacted document excerpts only
- Maintain attorney-client privilege throughout

**Reflection & Quality Control**
Provide:
- 3 key insights from this analysis
- 3 critical questions requiring clarification
- Recommendations for next steps

**Human Review Hand-off**
List specific items requiring partner confirmation before client communication and any approvals needed before proceeding.`
  },
  {
    id: "dpa_review_grid",
    label: "DPA — GDPR Essentials",
    category: "Contracts",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["GDPR Arts. 28–32", "EDPB guidance"],
    tags: ["privacy", "GDPR", "data processing"],
    complexity: "advanced",
    prompt_template: `Hi — I need a comprehensive GDPR compliance review of this Data Processing Agreement. I'll systematically check all essential requirements and flag any gaps.

**Facts (Extract)**
Please identify and extract with exact quotes and pinpoint citations:
- Data controller vs processor roles and responsibilities
- Sub-processing arrangements and approval mechanisms
- International transfer mechanisms (SCCs, adequacy decisions, TIA requirements)
- Security measures and technical/organizational safeguards
- Data breach notification SLAs and procedures
- Audit rights and inspection procedures
- Data deletion and return obligations
- Processing purposes and data categories

**Analysis (Interpretation)**
Compare against GDPR Articles 28-32 and current EDPB guidance:
- Identify gaps in mandatory Article 28 requirements
- Assess security measures against Article 32 standards
- Evaluate transfer mechanisms for Chapter V compliance
- Risk level assessment (low/medium/high) for each gap
- Note areas of regulatory uncertainty
- Provide 1-2 remediation options for each significant gap

**Decision Points — Human Approval Required**
Pause for approval if:
- International transfers lack adequate safeguards (SCCs/TIA missing)
- No meaningful audit rights provided
- Breach notification SLA exceeds regulatory timelines
- Sub-processing approval mechanisms inadequate

**Outputs**
Professional bullet-point analysis ready for client communication.

**Counterarguments (Other Party's View)**
- Strongest counterargument the processor will raise on audit rights, sub-processor approval and liability caps
- Alternative interpretation of the controller/processor roles (art. 4 and 28 GDPR) and its consequences
- Where both parties can live with a compromise on breach notification timing
- Risks that weaken my conclusion if the processor also acts as an independent controller
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the controller/processor qualification before the clause analysis.
- I decide which processor positions are acceptable for this client.

**Sources & Action Log**
- GDPR articles and EDPB guidance consulted with specific references
- Document analysis methodology and tools used
- Assumptions and limitations noted

**Communication & Privacy Standards**
- Neutral, measured language avoiding absolute compliance guarantees
- Request redacted excerpts only to protect confidential information
- Maintain privilege and work product protections

**Reflection & Quality Control**
- 3 insights on DPA adequacy and risk profile
- 3 open questions requiring legal/business clarification
- Recommended remediation priority sequence

**Human Review Hand-off**
Items requiring partner sign-off and client consultation before implementation.`
  },
  {
    id: "msa_redline_draft",
    label: "MSA — Tracked Changes + Comments",
    category: "Contracts",
    jurisdiction: "NL",
    output_format: "tracked_changes",
    criteria_refs: ["Firm Playbook: MSA-2025"],
    tags: ["contracts", "services", "redlines"],
    complexity: "advanced",
    prompt_template: `Hi — I need to prepare tracked changes and comments for this Master Service Agreement to align with our 2025 playbook standards.

**Assumptions & Missing Information**
Document any missing critical inputs:
- Pricing model and fee structure details
- Liability cap amounts and calculation basis
- Service level agreements and performance metrics
- Specific deliverables and acceptance criteria

**Draft — Tracked Changes**
Apply changes aligned with Firm Playbook: MSA-2025:
- Label each change as [MUST-FIX] or [OPTIONAL]
- Provide brief rationale for each modification
- Focus on: liability allocation, indemnification, IP ownership, termination rights, governing law, dispute resolution
- Ensure compliance with our risk tolerance and client protection standards

**Alternatives & Trade-offs**
For each [MUST-FIX] item, provide:
- 1-2 fallback clause options if counterparty resists
- Business and legal trade-offs for each alternative
- Risk assessment for compromise positions

**Decision Points — Human Approval Required**
Pause and seek approval before finalizing positions on:
- Liability cap amounts and scope
- Mutual vs one-way indemnification provisions
- Governing law and jurisdiction selection
- Termination for convenience rights and notice periods

**Outputs**
Word-compatible tracked changes document with comprehensive comment explanations ready for negotiation.

**Counterarguments (Other Party's View)**
- Strongest counterargument the supplier will raise against each priority redline
- Alternative interpretation of the liability and indemnity clauses under Dutch law
- Where both parties' positions are reasonable and a fallback position exists
- Risks that weaken our redlines if the supplier has stronger bargaining power
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I first confirm the key facts of the deal (parties, term, fees, liability caps) before any redline.
- I choose the negotiation position per clause before any wording is drafted.
- I approve each tracked change before it goes to the other side.

**Sources & Action Log**
- Firm Playbook: MSA-2025 sections referenced
- Analysis methodology and comparison tools used
- Client-specific modifications noted

**Communication & Privacy Standards**
- Professional, negotiation-ready language
- Avoid absolute positions that eliminate flexibility
- Protect confidential terms through appropriate redactions

**Quality Control & Reflection**
- 3 key insights on agreement risk profile
- 3 critical questions for business stakeholder input
- Negotiation strategy recommendations

**Human Review Hand-off**
Partner approval requirements and client consultation points before commencing negotiations.`
  },
  {
    id: "sow_scope_check",
    label: "SOW — Scope & Deliverables Check",
    category: "Contracts",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["Firm Playbook: SOW-2025"],
    tags: ["scope", "deliverables", "projects"],
    complexity: "intermediate",
    prompt_template: `Hi — I need a thorough scope and deliverables analysis of this Statement of Work to identify risks and ambiguities.

**Facts (Extract)**
Please extract with specific citations:
- Detailed deliverables list and specifications
- Acceptance testing criteria and procedures
- Change control and scope modification processes
- Payment milestones tied to deliverable completion
- Intellectual property creation and ownership terms
- Dependencies on client-provided resources or third parties
- Timeline and critical path requirements

**Analysis (Interpretation)**
Assess against SOW best practices:
- Identify scope ambiguities that could lead to disputes
- Evaluate scope creep risk factors and vulnerabilities
- Assess adequacy of acceptance criteria coverage
- Review change control mechanism effectiveness
- Analyze IP allocation fairness and clarity
- Note dependency risks and mitigation gaps

Provide alternative approaches for problematic areas with trade-off analysis.

**Decision Points — Human Approval Required**
Pause for approval if:
- Acceptance criteria are undefined or overly subjective
- IP ownership terms are ambiguous or unfavorable
- Dependencies create significant delivery risks
- Change control processes inadequate for scope protection

**Outputs**
Professional bullet-point analysis suitable for project stakeholder review.

**Counterarguments (Other Party's View)**
- Strongest counterargument the supplier will raise that a deliverable is out of scope
- Alternative interpretation of acceptance criteria and milestone definitions
- Where both parties carry part of the risk of unclear dependencies
- Risks that weaken my reading if the MSA order of precedence points the other way
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I mark which deliverables are business-critical before the gap analysis.
- I confirm the scope reading with the business owner myself.
- I decide which gaps are raised with the supplier.
- I set the priority order of the change requests.

**Sources & Action Log**
- SOW playbook standards referenced
- Risk assessment methodology documented
- Client industry benchmarks considered

**Communication & Privacy Standards**
- Clear, project-management friendly language
- Balanced risk assessment avoiding alarmist tone
- Protect proprietary information through appropriate handling

**Quality Control & Reflection**
- 3 insights on project delivery risks and opportunities
- 3 questions requiring clarification from business stakeholders
- Recommended SOW improvements and risk mitigations

**Human Review Hand-off**
Items requiring project management and legal approval before SOW execution.`
  },
  {
    id: "litigation_case_memo",
    label: "Litigation — Case Assessment Memo",
    category: "Disputes",
    jurisdiction: "NL",
    output_format: "headings",
    tags: ["litigation", "assessment", "strategy"],
    complexity: "advanced",
    prompt_template: `Hi — I need to prepare a comprehensive case assessment memo analyzing our litigation position and strategic options.

**Case Overview & Parties**
Document with precise citations:
- All parties and their legal status/capacity
- Complete timeline of relevant events (ISO date format)
- Factual allegations and disputed issues
- Key exhibits and evidence available (with pinpoint references)
- Procedural posture and pending motions

**Legal Issues & Applicable Law**
- Primary legal claims and potential defenses
- Governing statutes, regulations, and case law precedents
- Jurisdictional and venue considerations
- Statute of limitations and procedural deadline analysis
- Areas of legal uncertainty requiring research

**Strengths & Weaknesses Analysis**
Provide balanced assessment:
- Arguments supporting our position with supporting authority
- Potential counterarguments and opposing counsel likely strategies
- Evidence gaps and discovery needs
- Witness availability and credibility factors
- Settlement leverage and alternatives

**Strategic Options & Recommendations**
Present 1-2 strategic pathways:
- Litigation approach and key decision points
- Discovery scope and timeline considerations
- Motion practice strategy and timing
- Settlement posture and negotiation leverage
- Resource requirements and budget implications
- Risk-reward analysis for each option

**Decision Points — Human Approval Required**
Seek guidance on:
- Overall case strategy and resource allocation
- Settlement authority and negotiation parameters
- Discovery scope and expert witness retention
- Motion filing strategy and timing

**Counterarguments (Other Party's View)**
- Strongest counterargument the opposing party will raise on liability and causation
- Alternative interpretation of the key evidence and how a court might weigh it
- Where both parties face litigation risk that favours settlement
- Risks that weaken my assessment of the chances of success
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide the litigation strategy and the advice to the client.

**Sources & Action Log**
- Legal authorities researched and cited
- Factual investigation completed
- Consultation with client and witnesses documented

**Communication & Privacy Standards**
- Measured legal analysis avoiding outcome guarantees
- Protect attorney-client privilege and work product
- Client-ready professional presentation

**Quality Control & Reflection**
- 3 key strategic insights and case themes
- 3 critical questions requiring additional investigation
- Risk mitigation priorities and next steps

**Human Review Hand-off**
Partner consultation requirements and client decision points before proceeding with litigation strategy.`
  },
  {
    id: "dora_it_contract",
    label: "DORA — IT Services Contract Scan",
    category: "Regulatory",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["DORA 2025 checklist"],
    tags: ["regulatory", "financial services", "IT"],
    complexity: "advanced",
    prompt_template: `Hi — I need to scan this IT services contract for DORA (Digital Operational Resilience Act) compliance requirements that apply to financial institutions in the EU.

**Facts (Extract)**
Please identify and extract with pinpoint citations:
- ICT third-party risk management provisions
- Incident reporting windows and notification procedures
- Business continuity and disaster recovery requirements
- Testing obligations and penetration testing rights
- Operational resilience measures and SLAs
- Data location and processing restrictions
- Audit rights and regulatory access provisions
- Termination and exit planning requirements

**Analysis (Interpretation)**
Compare against DORA requirements effective from January 2025:
- Assess gaps versus mandatory ICT risk management framework
- Evaluate incident reporting compliance with regulatory timelines
- Review testing and audit provisions for adequacy
- Analyze operational resilience and continuity measures
- Check data localization and processing restrictions
- Identify areas where regulatory guidance is still developing

For each gap, provide 1-2 remediation options with trade-offs.

**Decision Points — Human Approval Required**
Pause for approval if:
- Incident notification windows exceed DORA requirements
- Testing and audit regime insufficient for regulatory compliance
- Operational resilience measures inadequate for critical services
- Data processing locations create regulatory risk

**Outputs**
Professional bullet-point analysis highlighting DORA compliance gaps and remediation priorities.

**Counterarguments (Other Party's View)**
- Strongest counterargument the ICT provider will raise against the DORA art. 30 clauses
- Alternative interpretation of whether the service supports a critical or important function
- Where both parties can agree on exit, audit and subcontracting terms
- Risks that weaken my conclusion if the regulator applies a stricter reading
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm whether the function is critical or important before the clause scan.
- I decide which gaps are mandatory to close before signing.
- I agree the remediation plan with the client's compliance officer myself.

**Sources & Action Log**
- DORA articles and technical standards referenced
- Industry guidance and regulatory pronouncements consulted
- Client risk classification and materiality thresholds applied

**Communication & Privacy Standards**
- Regulatory-focused language appropriate for compliance teams
- Balanced risk assessment avoiding unnecessary alarm
- Protect confidential contract terms and client information

**Quality Control & Reflection**
- 3 insights on DORA readiness and implementation priorities
- 3 questions requiring regulatory affairs input
- Recommended compliance timeline and next steps

**Human Review Hand-off**
Items requiring regulatory counsel approval and client risk committee consultation.`
  },
  {
    id: "mipa_assets",
    label: "M&A — Purchase Agreement (Assets)",
    category: "Transactions",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Firm M&A Playbook"],
    tags: ["M&A", "acquisitions", "assets"],
    complexity: "advanced",
    prompt_template: `Hi — I need to review this Dutch asset purchase agreement against our M&A playbook standards and identify key risks and negotiation points.

**Facts (Extract)**
Please extract with specific citations:
- Assets included in transaction scope and excluded assets list
- Purchase price structure and adjustment mechanisms
- Representations and warranties scope and materiality thresholds
- Indemnification provisions (caps, baskets, survival periods)
- Pre-closing and post-closing covenants
- Closing conditions and termination rights
- Employee transfer arrangements under Dutch law
- Regulatory approvals and third-party consents required

**Analysis (Interpretation)**
Compare against Firm M&A Playbook standards:
- Assess asset definition completeness and transfer risks
- Evaluate purchase price adjustment fairness and mechanics
- Review representations scope for gaps in seller coverage
- Analyze indemnification terms for buyer protection adequacy
- Check covenant restrictions for operational flexibility
- Identify closing condition risks and mitigation strategies

Provide alternative approaches for problematic terms with trade-off analysis.

**Decision Points — Human Approval Required**
Pause for approval on:
- Uncapped indemnification exposure or unusual survival periods
- Purchase price adjustments with undefined calculation methods
- Material adverse change definitions and carve-outs
- Key employee retention and non-compete arrangements

**Outputs**
Professional bullet-point analysis suitable for client deal team review.

**Counterarguments (Other Party's View)**
- Strongest counterargument the seller will raise on warranties, indemnities and the asset list
- Alternative interpretation of the transferred liabilities and employees (art. 7:662 BW transfer of undertaking)
- Where both parties can meet on the escrow or price adjustment mechanism
- Risks that weaken my conclusion if due diligence findings are incomplete
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the asset and liability list with the client before the analysis.
- I decide which warranties are deal-breakers.
- I set the negotiation priorities for the next draft.

**Sources & Action Log**
- M&A Playbook sections and precedent provisions referenced
- Dutch law requirements and transfer procedures considered
- Market terms and client transaction history benchmarked

**Communication & Privacy Standards**
- Deal-focused language appropriate for business stakeholders
- Balanced risk assessment supporting informed decision-making
- Protect transaction confidentiality and sensitive terms

**Quality Control & Reflection**
- 3 insights on deal structure and risk allocation
- 3 questions requiring business and tax input
- Recommended negotiation priorities and fallback positions

**Human Review Hand-off**
Partner approval requirements and client consultation points before negotiation commencement.`
  },
  {
    id: "mshare_spa",
    label: "M&A — SPA Redline Hints",
    category: "Transactions",
    jurisdiction: "EU",
    output_format: "tracked_changes",
    criteria_refs: ["Firm M&A Clauses 2025"],
    tags: ["M&A", "share purchase", "redlines"],
    complexity: "advanced",
    prompt_template: `Hi — I need to prepare strategic redlines and negotiation comments for the most commonly negotiated clauses in this share purchase agreement.

**Priority Redline Areas**
Focus tracked changes and comments on:
- Representations and warranties materiality qualifiers and knowledge standards
- Sandbagging provisions and buyer's pre-closing knowledge
- Escrow arrangements and indemnification mechanics
- Material adverse change definitions and carve-outs
- Earn-out provisions and post-closing adjustments
- Break-up fees and reverse break-up fee provisions

**Draft — Tracked Changes**
For each provision, provide:
- [MUST-HAVE] vs [NEGOTIABLE] designation
- Specific redline language aligned with Firm M&A Clauses 2025
- Brief rationale for each modification
- Cross-references to related provisions requiring conforming changes

**Alternatives & Trade-offs**
For contentious provisions, offer 2 alternative approaches:
- Market-standard fallback positions
- Business and legal implications of each alternative
- Negotiation leverage and timing considerations

**Decision Points — Human Approval Required**
Pause for approval before finalizing positions on:
- Material adverse change thresholds and disproportionality tests
- Indemnification baskets, caps, and survival periods
- Specific indemnification carve-outs (tax, environmental, employment)
- Earn-out calculation methodology and dispute resolution

**Outputs**
Word-compatible tracked changes with comprehensive comment explanations ready for counterparty exchange.

**Counterarguments (Other Party's View)**
- Strongest counterargument the seller will raise against each redline hint
- Alternative interpretation of locked box versus completion accounts mechanics
- Where both parties' positions on the W&I insurance gap are reasonable
- Risks that weaken the hints if the buyer's leverage is limited
- Legal basis for each hint (Dutch Civil Code provisions or market practice), so the analysis stays checkable
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I choose which redline hints go into the markup.

**Sources & Action Log**
- Firm M&A Clauses 2025 playbook provisions
- Recent market precedents and negotiation outcomes
- Client deal history and risk tolerance factors

**Communication & Privacy Standards**
- Professional negotiation language maintaining relationship focus
- Strategic positioning without revealing all fallback options
- Protect deal confidentiality and sensitive valuation information

**Quality Control & Reflection**
- 3 key insights on deal dynamics and negotiation leverage
- 3 critical questions for business team input
- Recommended negotiation sequence and timing strategy

**Human Review Hand-off**
Partner approval on negotiation strategy and client consultation on key business terms.`
  },
  {
    id: "pre_mediation_brief",
    label: "Disputes — Pre-Mediation Brief",
    category: "Disputes",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["mediation", "settlement", "ADR"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to prepare a strategic pre-mediation brief to guide our settlement discussions and maximize negotiation effectiveness.

**Background & Dispute Overview**
Provide neutral summary:
- Parties and their business relationship history
- Core disputed issues and legal claims
- Timeline of key events leading to mediation (ISO dates)
- Previous settlement discussions and positions taken
- Mediation format, mediator background, and scheduled timeline

**Position Analysis**
Document each party's stated positions:
- Our client's primary demands and minimum acceptable terms
- Counterparty's stated position and likely underlying interests
- Legal strengths and weaknesses for each side
- Factual disputes and areas of agreement
- Expert opinions and key evidence supporting each position

**Interest-Based Assessment**
Identify underlying business interests:
- Our client's core business needs and relationship priorities
- Counterparty's likely business drivers and constraints
- Shared interests and potential value-creation opportunities
- Non-monetary terms that could provide value to both sides
- Future business relationship considerations

**BATNA/WATNA Analysis**
Assess alternatives to settlement:
- Best Alternative to Negotiated Agreement (our strongest litigation outcome)
- Worst Alternative to Negotiated Agreement (our weakest litigation scenario)
- Counterparty's likely BATNA/WATNA assessment
- Litigation costs, timing, and business disruption factors
- Reputational and relationship impact of continued dispute

**Settlement Strategy & Ranges**
Develop negotiation approach:
- Opening position and supporting rationale
- Target settlement range with supporting analysis
- Minimum acceptable terms and walk-away points
- Concession strategy and timing considerations
- Package deal options and creative settlement structures

**Decision Points — Human Approval Required**
Seek guidance on:
- Settlement authority limits and approval requirements
- Confidential information sharing boundaries
- Key business terms requiring client input during mediation

**Outputs**
Professional bullet-point brief suitable for mediation team preparation.

**Counterarguments (Other Party's View)**
- Strongest counterargument the other party will bring to the mediation
- Alternative interpretation of the dispute and the facts the other side relies on
- Where both parties have interests that allow a settlement zone
- Risks that weaken our position if the mediation fails and the case goes to court
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I set the settlement mandate and walk-away point with the client myself.
- I decide what is shared with the mediator.

**Sources & Action Log**
- Case files and evidence reviewed
- Precedent settlements and market comparables researched
- Client consultation and business impact assessment completed

**Communication & Privacy Standards**
- Balanced assessment supporting effective negotiation
- Protect mediation confidentiality and settlement privilege
- Maintain professional relationship focus throughout process

**Quality Control & Reflection**
- 3 insights on settlement dynamics and opportunities
- 3 questions requiring client input before mediation
- Recommended mediation tactics and relationship management

**Human Review Hand-off**
Partner consultation on settlement authority and client approval for negotiation parameters.`
  },
  {
    id: "investigation_plan",
    label: "Internal Investigation — Plan",
    category: "Investigations",
    jurisdiction: "EU",
    output_format: "headings",
    tags: ["investigation", "compliance", "internal"],
    complexity: "advanced",
    prompt_template: `Hi — I need to develop a comprehensive internal investigation plan that ensures thorough fact-finding while managing legal and business risks.

**Investigation Scope & Objectives**
Define investigation parameters:
- Specific allegations or concerns requiring investigation
- Key legal and compliance questions to be answered
- Timeline of events requiring examination (ISO date ranges)
- Geographic scope and business units involved
- Regulatory or legal obligations driving investigation timing
- Success criteria and deliverables expected

**Information Sources & Collection Strategy**
Identify evidence gathering approach:
- Documents and electronic records requiring review
- Key witnesses and interview priorities
- Third-party information sources and external records
- Expert analysis or forensic review requirements
- Preservation obligations and litigation hold considerations
- Data privacy and cross-border transfer restrictions

**Legal Constraints & Compliance Requirements**
Address regulatory framework:
- Applicable privilege protections and common interest considerations
- Employee rights and works council consultation requirements (EU)
- Data protection obligations under GDPR
- Regulatory reporting obligations and timing requirements
- Potential conflicts of interest and management participation
- External counsel engagement and independence requirements

**Investigation Timeline & Milestones**
Develop project plan:
- Phase 1: Document preservation and initial witness interviews
- Phase 2: Detailed fact development and expert analysis
- Phase 3: Findings analysis and remediation planning
- Key decision points and progress reporting schedule
- Resource allocation and team assignments
- Contingency planning for scope expansion or complications

**Risk Management & Mitigation**
Address investigation risks:
- Privilege waiver and disclosure risks
- Employee relations and retention concerns
- Business disruption and operational impact
- Regulatory and enforcement exposure
- Reputational and public relations considerations
- Insurance coverage and cost management

**Decision Points — Human Approval Required**
Seek guidance on:
- Investigation scope boundaries and resource allocation
- External counsel selection and engagement terms
- Employee suspension or administrative leave decisions
- Regulatory notification timing and content
- Public disclosure and stakeholder communication

**Reporting & Communication Plan**
Structure information flow:
- Internal reporting format and frequency
- Board or committee briefing requirements
- Regulatory communication strategy and timing
- Employee communication and change management
- External stakeholder and media response planning

**Outputs & Deliverables**
Define investigation products:
- Factual findings report with supporting evidence
- Legal analysis and compliance assessment
- Remediation recommendations and implementation plan
- Process improvements and control enhancements
- Regulatory response strategy and submissions

**Counterarguments (Other Party's View)**
- Strongest counterargument the person under investigation could raise about process or fairness
- Alternative interpretation of the initial allegations and innocent explanations
- Where both parties' interests (employer and employee) must be balanced, including privacy
- Risks that weaken the plan, such as evidence contamination or breach of hearing rights
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I approve the scope and the list of interviewees before the plan is finalised.
- I decide on any data collection that touches employee privacy.

**Sources & Action Log**
- Investigation planning resources and precedents consulted
- Regulatory guidance and best practices reviewed
- Client consultation and stakeholder input documented

**Communication & Privacy Standards**
- Maintain investigation confidentiality and work product protection
- Balance thoroughness with efficiency and cost management
- Protect employee privacy and rights throughout process

**Quality Control & Reflection**
- 3 insights on investigation risks and success factors
- 3 questions requiring immediate stakeholder input
- Recommended investigation team structure and governance

**Human Review Hand-off**
Partner approval on investigation scope, budget, and external counsel engagement strategy.`
  },
  {
    id: "whistle_review",
    label: "Whistleblower Intake — First Pass",
    category: "Investigations",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["EU Whistleblower Directive"],
    tags: ["whistleblower", "compliance", "reporting"],
    complexity: "advanced",
    prompt_template: `Hi — I need to conduct an initial assessment of this whistleblower report in compliance with EU Whistleblower Directive requirements and determine appropriate next steps.

**Facts (Extract)**
Document with precise details:
- Nature of allegations and specific misconduct claimed
- Timeline of reported events (ISO dates) and ongoing conduct
- Persons allegedly involved and their organizational roles
- Evidence provided by reporter and additional evidence referenced
- Reporter's identity (if disclosed) and relationship to organization
- Previous internal reports or external complaints on same issues
- Potential harm to organization, employees, or public interest

**Initial Risk Assessment**
Evaluate urgency and materiality:
- Potential legal, regulatory, or compliance violations implicated
- Immediate risks requiring urgent intervention or safeguards
- Scope of potential organizational or public harm
- Regulatory reporting obligations and timing requirements
- Reputational and business impact considerations
- Criminal conduct implications requiring law enforcement referral

**Confidentiality & Protection Measures**
Address whistleblower protections:
- Reporter anonymity preservation and identity protection
- Secure communication channels and document handling
- Potential retaliation risks and protective measures needed
- Conflict of interest assessment for investigation team
- Information sharing limitations and need-to-know restrictions
- GDPR compliance for personal data processing

**Preliminary Investigation Planning**
Outline initial response:
- Immediate fact-finding priorities and information gathering
- Key witnesses and document sources requiring review
- External expertise or forensic analysis requirements
- Investigation timeline and resource allocation needs
- Regulatory notification requirements and timing
- Business continuity and operational risk mitigation

**Decision Points — Human Approval Required**
Seek immediate guidance on:
- Investigation scope and external counsel engagement
- Employee suspension or administrative action decisions
- Regulatory notification timing and content
- Board or management reporting requirements
- Law enforcement referral considerations

**Outputs**
Professional bullet-point assessment suitable for senior management and board briefing.

**Counterarguments (Other Party's View)**
- Strongest counterargument that the report falls outside the Whistleblower Protection Act (Wbk) scope
- Alternative interpretation of the reported facts and possible good-faith explanations
- Where both parties' interests (reporter protection and accused's rights) conflict
- Risks that weaken the first assessment, such as incomplete or anonymous information
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide whether the report is admitted and who is informed.
- I confirm the confidentiality measures for the reporter myself.

**Sources & Action Log**
- EU Whistleblower Directive requirements and national implementing legislation
- Organization's whistleblower policy and procedures
- Initial evidence review and preliminary interviews conducted

**Communication & Privacy Standards**
- Strict confidentiality maintenance protecting reporter identity
- Balanced assessment avoiding premature conclusions
- Protect investigation integrity and legal privilege

**Quality Control & Reflection**
- 3 insights on allegations credibility and investigation priorities
- 3 critical questions requiring immediate senior management input
- Recommended protective measures and investigation next steps

**Human Review Hand-off**
Immediate partner consultation on investigation strategy and senior management notification requirements.`
  },
  {
    id: "privacy_tia",
    label: "Privacy — TIA Outline",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "headings",
    criteria_refs: ["EDPB TIA factors"],
    tags: ["privacy", "data transfers", "TIA"],
    complexity: "advanced",
    prompt_template: `Hi — I need to create a comprehensive Transfer Impact Assessment (TIA) outline for international data transfers to assess and document adequacy of protection measures.

**Transfer Overview & Context**
Document transfer details:
- Data categories and volume of personal data involved
- Data subjects affected and their reasonable expectations
- Purpose and legal basis for international transfer
- Third country destinations and onward transfer arrangements
- Transfer duration and frequency (one-time vs ongoing)
- Technical transfer methods and security measures employed

**Third Country Assessment**
Evaluate destination country protection:
- Legal framework for data protection and individual rights
- Government access laws and surveillance programs
- Independence and effectiveness of supervisory authorities
- Available legal remedies for data subjects
- Rule of law and respect for fundamental rights
- Practical enforceability of protection measures

**Supplementary Measures Analysis**
Assess additional safeguards:
- Technical measures: encryption, pseudonymization, key management
- Organizational measures: access controls, staff training, audit procedures
- Contractual measures: Standard Contractual Clauses, additional commitments
- Certification schemes and codes of conduct applicability
- Effectiveness assessment of combined protection measures

**Residual Risk Evaluation**
Identify remaining concerns:
- Gaps in legal protection despite supplementary measures
- Practical enforceability limitations in third country
- Risk likelihood and potential impact on data subjects
- Specific vulnerabilities related to data categories or use cases
- Mitigation strategies for identified residual risks

**Alternative Transfer Options**
Consider available alternatives:
- Adequacy decision jurisdictions for data processing
- Different technical implementation reducing transfer risks
- Data minimization opportunities and local processing options
- Derogation availability under GDPR Article 49
- Business impact assessment of alternative approaches

**Decision Points — Human Approval Required**
Seek guidance on:
- Acceptable risk tolerance levels for international transfers
- Business necessity assessment and alternative evaluation
- Additional safeguards implementation and cost implications
- Regulatory consultation strategy for complex cases

**Implementation & Monitoring Plan**
Structure ongoing compliance:
- Supplementary measures implementation timeline
- Regular review and assessment schedule
- Monitoring procedures for effectiveness verification
- Documentation and record-keeping requirements
- Incident response procedures for transfer-related breaches
- Training and awareness programs for transfer stakeholders

**Outputs & Documentation**
Provide structured deliverables:
- Complete TIA report with risk assessment and conclusions
- Implementation checklist for supplementary measures
- Contractual provisions and technical specifications
- Monitoring and review procedures documentation
- Regulatory filing materials if consultation required

**Counterarguments (Other Party's View)**
- Strongest counterargument that the supplementary measures are not effective against third-country access
- Alternative interpretation of the third-country law and practice (Schrems II, EDPB Recommendations 01/2020)
- Where both parties (exporter and importer) share responsibility for the measures
- Risks that weaken my conclusion if the importer's practice differs from the contract
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the transfer map and data categories before the assessment.
- I decide whether the residual risk is acceptable.
- I sign the TIA conclusion myself.

**Sources & Action Log**
- EDPB TIA guidelines and case-specific guidance
- Third country legal analysis and government access laws
- Technical security standards and industry best practices
- Client business requirements and risk tolerance assessment

**Communication & Privacy Standards**
- Technical accuracy balanced with business accessibility
- Conservative risk assessment protecting data subject rights
- Clear documentation supporting transfer decision rationale

**Quality Control & Reflection**
- 3 insights on transfer risks and protection adequacy
- 3 questions requiring technical or business input
- Recommended supplementary measures and implementation priorities

**Human Review Hand-off**
Privacy counsel approval on risk assessment conclusions and regulatory consultation strategy.`
  },
  {
    id: "cookie_policy_review",
    label: "Privacy — Cookie Policy Review",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["ePrivacy", "GDPR"],
    tags: ["cookies", "ePrivacy", "consent"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to review this cookie policy and consent implementation for compliance with EU ePrivacy Directive and GDPR requirements.

**Facts (Extract)**
Please identify and document:
- Cookie categories used (strictly necessary, performance, functional, targeting)
- Specific purposes for each cookie type and data processing activities
- Data retention periods for each cookie category
- Third-party cookies and external service providers involved
- Consent mechanism implementation and user interface design
- Cookie information provided to users and withdrawal options
- Cross-border data transfers through cookie implementations

**Compliance Assessment**
Evaluate against ePrivacy and GDPR requirements:
- Consent requirement compliance for non-essential cookies
- Information transparency and user notification adequacy
- Consent mechanism validity (specific, informed, freely given, unambiguous)
- Withdrawal mechanism effectiveness and accessibility
- Data minimization and purpose limitation compliance
- Legitimate interest assessments where applicable

**Consent Design Review**
Assess user experience and legal compliance:
- Cookie banner design and information presentation
- Granular consent options and category selection
- Pre-ticked boxes and default settings compliance
- Consent refresh and re-consent mechanisms
- Mobile and cross-device consent synchronization
- Impact of consent withdrawal on website functionality

**Third-Party Integration Issues**
Review external service compliance:
- Third-party cookie policies and privacy practices
- Data processing agreements with service providers
- Cross-border transfer adequacy for analytics and advertising services
- Vendor management and compliance monitoring procedures
- Consent passing and signal transmission to third parties

**Gap Analysis & Recommendations**
Identify compliance improvements:
- Policy language updates and technical corrections
- Consent mechanism enhancements and user interface improvements
- Documentation and record-keeping improvements
- Staff training and compliance procedures
- Regular review and update schedules

Provide 1-2 implementation alternatives with trade-offs for major gaps.

**Decision Points — Human Approval Required**
Seek guidance on:
- Non-essential cookie business necessity and elimination options
- Consent mechanism design changes and development costs
- Third-party service replacements for compliance improvements
- Risk tolerance for transitional compliance measures

**Outputs**
Professional bullet-point analysis with prioritized recommendations suitable for privacy and IT teams.

**Counterarguments (Other Party's View)**
- Strongest counterargument the client's marketing team will raise against stricter consent
- Alternative interpretation of 'strictly necessary' cookies under art. 11.7a Telecommunicatiewet
- Where both parties (business and regulator expectations) can meet on analytics cookies
- Risks that weaken my conclusion if the actual site behaviour differs from the policy
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I verify the actual cookie scan against the policy myself.
- I decide which changes are mandatory before the next release.

**Sources & Action Log**
- ePrivacy Directive and national implementing legislation
- GDPR provisions and supervisory authority guidance
- Industry best practices and regulatory enforcement examples
- Technical implementation review and user testing results

**Communication & Privacy Standards**
- Clear technical guidance accessible to non-legal stakeholders
- Balanced compliance assessment supporting business operations
- Protect user privacy while maintaining website functionality

**Quality Control & Reflection**
- 3 insights on compliance risks and improvement opportunities
- 3 questions requiring IT and business stakeholder input
- Recommended implementation timeline and resource requirements

**Human Review Hand-off**
Privacy counsel approval on compliance assessment and IT team consultation on technical implementation feasibility.`
  },
  {
    id: "employment_settlement",
    label: "Employment — Settlement Agreement Scan",
    category: "Employment",
    jurisdiction: "NL",
    output_format: "bullets",
    criteria_refs: ["Dutch employment law checklist"],
    tags: ["employment", "settlement", "termination"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to review this Dutch employment settlement agreement for legal compliance and risk assessment before finalization.

**Facts (Extract)**
Please identify and extract with citations:
- Termination date and notice period compliance
- Severance consideration amount and calculation basis
- Confidentiality and non-disclosure provisions scope
- Non-disparagement clauses affecting both parties
- Reference and recommendation letter arrangements
- Tax treatment clauses and withholding procedures
- General release scope and excluded claims
- Non-compete and non-solicitation restrictions (if any)

**Dutch Law Compliance Check**
Assess against mandatory requirements:
- Dismissal law compliance and UWV notification if required
- Minimum notice periods and severance calculation accuracy
- Works council consultation requirements (if applicable)
- Discrimination law compliance and equal treatment considerations
- Non-compete restrictions enforceability under Dutch law
- Tax optimization opportunities and withholding obligations
- Pension and benefits continuation or settlement
- Immigration status implications for foreign employees

**Risk Assessment**
Evaluate potential issues:
- Enforceability of restrictive covenants under Dutch law
- Tax treatment disputes and additional liability exposure
- Confidentiality scope and trade secret protection adequacy
- Reference letter commitments and potential defamation risks
- Excluded claims and potential future disputes
- Settlement payment structure and installment risks

Provide 1-2 alternative approaches for problematic terms with trade-offs.

**Decision Points — Human Approval Required**
Seek guidance on:
- Tax treatment confirmation and optimization strategies
- General release scope and excluded statutory claims
- Non-compete enforceability and business necessity
- Settlement amount and payment structure approval

**Outputs**
Professional bullet-point analysis highlighting compliance issues and recommended modifications.

**Counterarguments (Other Party's View)**
- Strongest counterargument the employee or their lawyer will raise on the settlement terms
- Alternative interpretation of the transition payment and notice period calculation
- Where both parties can compromise on non-compete and reference clauses
- Risks that weaken the agreement, such as unemployment benefit (WW) eligibility issues
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the employment facts and dates with the client before the scan.
- I decide which terms we accept or renegotiate.

**Sources & Action Log**
- Dutch employment law statutory requirements
- Recent case law and enforcement trends
- Tax regulations and withholding obligations
- Client employment policies and precedent settlements

**Communication & Privacy Standards**
- Confidential handling of employee personal information
- Balanced risk assessment supporting informed decision-making
- Professional language appropriate for HR and business stakeholders

**Quality Control & Reflection**
- 3 insights on settlement terms and enforceability
- 3 questions requiring HR and tax input
- Recommended modifications and risk mitigation measures

**Human Review Hand-off**
Employment counsel approval on compliance assessment and tax advisor consultation on optimization opportunities.`
  },
  {
    id: "employment_policy",
    label: "Employment — Policy Update Note",
    category: "Employment",
    jurisdiction: "EU",
    output_format: "headings",
    tags: ["employment", "policy", "compliance"],
    complexity: "basic",
    prompt_template: `Hi — I need to prepare a comprehensive policy update communication explaining recent employment law changes and their practical implications.

**Policy Changes Overview**
Summarize key modifications:
- Specific legal or regulatory requirements driving updates
- Effective dates and implementation timeline
- Previous policy provisions being modified or replaced
- New obligations and requirements being introduced
- Scope of coverage (employee categories, geographic regions)

**Business Impact Analysis**
Assess practical implications:
- Operational changes required for compliance
- Cost implications and resource requirements
- Training and communication needs for managers and employees
- Technology or process modifications necessary
- Risk mitigation benefits and compliance improvements

**Affected Stakeholders**
Identify impact on different groups:
- Employee categories subject to new requirements
- Management responsibilities and decision-making changes
- HR team implementation and administration duties
- Works council consultation requirements (where applicable)
- External service provider or vendor implications

**Implementation Requirements**
Detail compliance steps:
- Manager training and awareness programs needed
- Employee communication and acknowledgment procedures
- System updates and documentation changes required
- Monitoring and compliance verification processes
- Timeline for full implementation and effectiveness

**Decision Points — Human Approval Required**
Seek guidance on:
- Resource allocation and implementation budget approval
- Training program scope and delivery methodology
- Employee communication strategy and messaging
- Compliance monitoring and audit procedures

**Communication Strategy**
Structure stakeholder engagement:
- Management briefing materials and talking points
- Employee communication plan and FAQ development
- Works council presentation and consultation process
- External communication needs (if any)
- Ongoing support and question handling procedures

**Outputs & Next Steps**
Define deliverables and timeline:
- Policy documentation updates and distribution
- Training materials development and delivery schedule
- Compliance monitoring and reporting procedures
- Regular review and update schedule establishment
- Success metrics and effectiveness measurement

**Counterarguments (Other Party's View)**
- Strongest counterargument the works council will raise against the policy change (art. 27 WOR)
- Alternative interpretation of whether the change requires employee consent
- Where both parties (employer and employees) can agree on transition arrangements
- Risks that weaken the policy if it conflicts with the applicable CAO
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I check the applicable CAO and existing policies myself.
- I decide whether works council consent is sought before rollout.

**Sources & Action Log**
- Legal and regulatory developments driving changes
- Industry best practices and peer organization approaches
- Client business requirements and operational constraints
- Consultation with employment counsel and HR leadership

**Communication & Privacy Standards**
- Clear, accessible language for all stakeholder levels
- Consistent messaging across all communication channels
- Protect confidential business information and employee data

**Quality Control & Reflection**
- 3 insights on implementation challenges and success factors
- 3 questions requiring HR and business leadership input
- Recommended timeline and resource allocation priorities

**Human Review Hand-off**
HR leadership approval on communication strategy and training program development.`
  },
  {
    id: "ip_license_check",
    label: "IP — License Agreement Scan",
    category: "IP",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["IP Playbook 2025"],
    tags: ["IP", "licensing", "agreements"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to review this intellectual property license agreement against our IP playbook standards and identify key risks and opportunities.

**Facts (Extract)**
Please identify and extract with citations:
- Licensed IP scope and specific rights granted
- Field of use restrictions and permitted applications
- Territory limitations and geographic scope
- Exclusivity arrangements (exclusive, non-exclusive, sole license)
- Sublicensing rights and approval requirements
- Royalty structure and payment terms
- Performance milestones and diligence obligations
- Improvement rights and derivative work ownership
- Term duration and renewal provisions
- Termination rights and consequences

**IP Playbook Compliance**
Compare against IP Playbook 2025 standards:
- License scope adequacy for intended business use
- Field of use restrictions alignment with business strategy
- Royalty rates and structure competitiveness
- Exclusivity justification and market impact
- Sublicensing flexibility for business development
- Performance obligations feasibility and enforcement
- Improvement ownership allocation fairness
- Termination protection and transition rights

**Risk Assessment**
Evaluate potential concerns:
- IP validity and enforceability risks
- Competitive restrictions and market foreclosure
- Performance milestone achievability and penalty exposure
- Royalty calculation disputes and audit rights
- Termination triggers and business continuity risks
- Sublicensing limitations affecting partnerships
- Improvement ownership creating future conflicts

Provide alternative approaches for problematic terms with trade-offs.

**Decision Points — Human Approval Required**
Pause for approval on:
- Exclusivity grants affecting market strategy
- Sublicensing restrictions limiting business flexibility
- Performance milestones with significant penalty exposure
- Improvement ownership allocations affecting R&D strategy

**Outputs**
Professional bullet-point analysis suitable for business and R&D team review.

**Counterarguments (Other Party's View)**
- Strongest counterargument the licensor will raise on scope, exclusivity and sublicensing
- Alternative interpretation of the licensed field of use and territory
- Where both parties can agree on improvements and ownership of derivatives
- Risks that weaken my conclusion if the licensor's title to the IP is unclear
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the business use of the licensed IP before the scan.
- I decide which licence terms are acceptable.

**Sources & Action Log**
- IP Playbook 2025 standards and precedent provisions
- Market licensing terms and industry benchmarks
- Client IP portfolio and business strategy alignment
- Technical and commercial feasibility assessment

**Communication & Privacy Standards**
- Technical accuracy balanced with business accessibility
- Competitive intelligence protection and confidentiality
- Clear guidance supporting informed business decisions

**Quality Control & Reflection**
- 3 insights on licensing strategy and market positioning
- 3 questions requiring business development and R&D input
- Recommended negotiation priorities and alternative structures

**Human Review Hand-off**
IP counsel approval on licensing strategy and business team consultation on commercial terms.`
  },
  {
    id: "trademark_clearance",
    label: "IP — Trademark Clearance Memo",
    category: "IP",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["trademark", "clearance", "IP"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to prepare a trademark clearance analysis assessing potential conflicts and registration risks for this proposed mark.

**Facts (Extract)**
Document search and analysis details:
- Proposed trademark and specific design elements
- Goods and services classification (Nice classes) for intended use
- Geographic scope for protection and use (EU, national, Madrid Protocol)
- Prior trademark search results and identified conflicting marks
- Common law usage and unregistered rights research
- Domain name availability and social media handle status
- Client's intended use timeline and market launch plans

**Conflict Analysis**
Assess identified prior rights:
- Identical or highly similar registered trademarks
- Likelihood of confusion analysis for each potential conflict
- Different goods/services classes and cross-class protection scope
- Well-known mark status and broader protection implications
- Pending trademark applications and potential conflicts
- Opposition and cancellation proceeding risks
- Enforcement history and trademark owner activity levels

**Clearance Assessment**
Provide risk evaluation:
- Overall clearance recommendation (clear, caution, high risk)
- Specific conflict areas requiring attention or avoidance
- Filing strategy recommendations and class selection
- Geographic filing priorities and budget optimization
- Timeline considerations and expedited examination options
- Monitoring and watch service recommendations

**Alternative Options**
If conflicts identified, provide alternatives:
- Trademark modification options reducing conflict risk
- Alternative brand names or mark variations for consideration
- Narrowed goods/services descriptions limiting exposure
- Geographic limitations or staged expansion approach
- Coexistence agreement potential with conflicting mark owners

**Decision Points — Human Approval Required**
Seek guidance on:
- Risk tolerance levels for identified potential conflicts
- Filing strategy and geographic scope priorities
- Budget allocation for trademark prosecution and maintenance
- Brand modification acceptance if conflicts cannot be resolved

**Outputs**
Professional bullet-point clearance memo suitable for brand and marketing team review.

**Counterarguments (Other Party's View)**
- Strongest counterargument an earlier rights holder could raise (likelihood of confusion)
- Alternative interpretation of the similarity of goods and services in the relevant classes
- Where both parties could coexist through a coexistence agreement
- Risks that weaken the clearance opinion if unregistered rights exist
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide the clearance risk level communicated to the client.
- I choose whether to file, modify the mark or seek coexistence.

**Sources & Action Log**
- EU and national trademark database searches conducted
- Professional trademark search services and tools used
- Common law research and industry publication review
- Domain name and digital presence availability check

**Communication & Privacy Standards**
- Clear risk communication avoiding absolute guarantees
- Protect confidential brand strategy and launch timing
- Accessible guidance for non-legal brand stakeholders

**Quality Control & Reflection**
- 3 insights on trademark landscape and competitive positioning
- 3 questions requiring brand strategy and marketing input
- Recommended filing timeline and budget allocation

**Human Review Hand-off**
IP counsel approval on clearance assessment and brand team consultation on alternative options.`
  },
  {
    id: "gdpr_breach_note",
    label: "Breach — Initial Note to Client",
    category: "Privacy",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["GDPR Arts. 33–34"],
    tags: ["data breach", "GDPR", "incident"],
    complexity: "advanced",
    prompt_template: `Hi — I need to prepare an initial data breach assessment and client communication addressing immediate response requirements and regulatory obligations.

**Incident Overview**
Document breach details with precision:
- Date and time of breach discovery and estimated occurrence
- Nature of security incident and attack vectors involved
- Personal data categories affected and number of data subjects
- Geographic scope and cross-border implications
- Current containment status and ongoing risks
- Preliminary root cause analysis and vulnerability assessment
- Business operations impact and service disruption extent

**GDPR Notification Assessment**
Evaluate regulatory reporting obligations:
- Likelihood of high risk to rights and freedoms of data subjects
- Data categories sensitivity and potential harm assessment
- Technical and organizational measures in place pre-breach
- Residual risks after containment and mitigation efforts
- 72-hour supervisory authority notification timeline compliance
- Individual notification requirements under Article 34
- Documentation and evidence preservation for regulatory submissions

**Immediate Response Actions**
Detail containment and mitigation steps:
- Security incident containment and system isolation measures
- Forensic investigation planning and evidence preservation
- Affected data subject identification and impact assessment
- Communication strategy for internal stakeholders and customers
- Business continuity planning and service restoration priorities
- Legal counsel engagement and privilege protection measures

**Risk Assessment & Implications**
Analyze potential consequences:
- Regulatory enforcement risk and potential administrative fines
- Individual compensation claims and class action exposure
- Business interruption and customer relationship impact
- Reputational damage and competitive implications
- Insurance coverage activation and claims procedures
- Third-party vendor liability and recovery options

**Decision Points — Human Approval Required**
Seek immediate guidance on:
- Supervisory authority notification timing and content strategy
- Individual notification approach and communication messaging
- Public disclosure requirements and media response planning
- Law enforcement reporting for criminal activity investigation
- Insurance carrier notification and claims initiation

**Regulatory Compliance Timeline**
Structure immediate obligations:
- 72-hour DPA notification deadline and submission preparation
- Individual notification timing if high-risk threshold met
- Internal breach register documentation requirements
- Board and senior management reporting obligations
- Ongoing cooperation with supervisory authority investigation

**Outputs**
Professional bullet-point assessment suitable for senior management and board briefing.

**Counterarguments (Other Party's View)**
- Strongest counterargument that the breach is notifiable to the AP within 72 hours (art. 33 GDPR)
- Alternative interpretation of the risk to data subjects and whether art. 34 notification applies
- Where both parties (client and processor) carry notification duties
- Risks that weaken the initial assessment because facts are still developing
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide whether and when the breach is notified.
- I approve the wording of the note before it reaches the client.

**Sources & Action Log**
- GDPR Articles 33-34 and supervisory authority guidance
- Incident response procedures and forensic investigation findings
- Insurance policy review and coverage assessment
- Legal precedents and regulatory enforcement trends

**Communication & Privacy Standards**
- Factual accuracy while acknowledging ongoing investigation
- Protect incident response privilege and work product
- Balance transparency with legal strategy considerations

**Quality Control & Reflection**
- 3 insights on breach severity and response effectiveness
- 3 critical questions requiring immediate stakeholder input
- Recommended next steps and resource allocation priorities

**Human Review Hand-off**
Immediate privacy counsel consultation and senior management approval for regulatory notification strategy.`
  },
  {
    id: "procurement_rfp_review",
    label: "Procurement — RFP Legal Scan",
    category: "Commercial",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["procurement", "RFP", "commercial"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to scan this Request for Proposal for legal constraints and risks before we submit our response and pricing.

**Facts (Extract)**
Please identify and document with citations:
- Mandatory contract terms and non-negotiable provisions
- Liability caps, limitations, and indemnification requirements
- Intellectual property ownership and licensing terms
- Data protection and privacy requirements (GDPR compliance)
- Security standards and audit rights provisions
- Payment terms, milestone structure, and penalty clauses
- Termination rights and early exit provisions
- Governing law, jurisdiction, and dispute resolution requirements

**Legal Risk Assessment**
Evaluate proposal requirements:
- Terms conflicting with our standard contracting positions
- Unlimited liability exposure or inadequate risk allocation
- IP terms affecting our proprietary technology or client work
- Data processing obligations creating regulatory compliance risks
- Security requirements exceeding our current capabilities
- Performance guarantees or service level commitments
- Penalty structures and financial exposure assessment

**Commercial Terms Analysis**
Review business and financial provisions:
- Payment structure and cash flow implications
- Performance bonds, guarantees, or security requirements
- Change control mechanisms and scope expansion risks
- Resource commitment obligations and exclusivity provisions
- Subcontracting restrictions and approved vendor requirements
- Insurance coverage requirements and cost implications

**Negotiation Strategy**
Identify leverage points and alternatives:
- Terms likely to be negotiable based on market standards
- Alternative language proposals for problematic provisions
- Risk mitigation strategies through operational measures
- Pricing adjustments reflecting increased risk or compliance costs
- Qualification language protecting our position during proposal

**Decision Points — Human Approval Required**
Seek guidance on:
- Risk tolerance for non-negotiable terms exceeding our standards
- Pricing adjustments reflecting legal and compliance costs
- Resource allocation for enhanced security or compliance measures
- Subcontracting strategy and approved vendor partnerships

**Outputs**
Professional bullet-point analysis supporting bid/no-bid decision and proposal development.

**Counterarguments (Other Party's View)**
- Strongest counterargument the contracting authority will raise against our clarification questions
- Alternative interpretation of the award criteria and knock-out requirements (Aanbestedingswet 2012)
- Where both parties benefit from adjusted liability or termination terms
- Risks that weaken our bid if we deviate from the mandatory terms
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide which clarification questions are submitted.
- I approve any deviation from the tender terms.

**Sources & Action Log**
- Standard contract terms and risk allocation preferences
- Market practice research and competitive intelligence
- Compliance and security capability assessment
- Insurance coverage review and cost estimation

**Communication & Privacy Standards**
- Clear risk communication supporting business decision-making
- Protect competitive pricing strategy and proposal approach
- Accessible guidance for proposal team and business stakeholders

**Quality Control & Reflection**
- 3 insights on competitive positioning and risk management
- 3 questions requiring business development and operations input
- Recommended proposal strategy and risk mitigation measures

**Human Review Hand-off**
Commercial counsel approval on risk assessment and proposal team consultation on business terms.`
  },
  {
    id: "supplier_dd",
    label: "Supplier Due Diligence — Legal",
    category: "Commercial",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["due diligence", "suppliers", "vendor"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to conduct legal due diligence on this supplier to assess regulatory compliance, contractual risks, and business relationship suitability.

**Corporate & Regulatory Status**
Verify basic compliance requirements:
- Corporate registration status and good standing verification
- Required licenses and regulatory authorizations for services
- Financial stability indicators and credit worthiness assessment
- Insurance coverage adequacy and policy verification
- Tax compliance status and withholding obligations
- Data protection registration and GDPR compliance status
- Industry-specific certifications and quality standards compliance

**Sanctions & Compliance Screening**
Assess regulatory risk factors:
- Sanctions list screening (EU, US, UN consolidated lists)
- Anti-money laundering and terrorist financing risk assessment
- Beneficial ownership identification and PEP screening
- Geographic risk factors and jurisdiction-specific concerns
- Industry sector risk assessment and enhanced due diligence needs
- Corruption and bribery risk indicators and mitigation measures

**Litigation & Disputes History**
Review legal exposure and reputation:
- Pending or recent litigation involving supplier
- Regulatory enforcement actions and compliance violations
- Bankruptcy, insolvency, or financial distress history
- IP disputes, trademark infringement, or licensing conflicts
- Employment law violations or significant labor disputes
- Environmental violations or sustainability compliance issues

**Contractual Risk Assessment**
Evaluate agreement terms and conditions:
- Standard contract terms and risk allocation provisions
- Limitation of liability and indemnification adequacy
- Data protection and confidentiality provisions compliance
- Intellectual property licensing and ownership clarity
- Service level commitments and performance guarantees
- Termination provisions and business continuity planning

**Gap Analysis & Red Flags**
Identify areas requiring attention:
- Missing documentation or incomplete compliance evidence
- Inconsistent information or verification difficulties
- High-risk jurisdictions or beneficial ownership concerns
- Regulatory compliance gaps or pending enforcement matters
- Financial stability concerns or insurance coverage inadequacy
- Contractual terms creating unacceptable risk exposure

Provide alternative approaches for addressing identified gaps.

**Decision Points — Human Approval Required**
Seek guidance on:
- Risk tolerance for identified compliance or financial concerns
- Enhanced monitoring or audit requirements for ongoing relationship
- Contract modifications required before engagement commencement
- Alternative supplier evaluation if risks cannot be adequately mitigated

**Outputs**
Professional bullet-point assessment supporting vendor approval decision and ongoing risk management.

**Counterarguments (Other Party's View)**
- Strongest counterargument the supplier will raise against our red-flag findings
- Alternative interpretation of the supplier's compliance documents and certifications
- Where both parties can address gaps through contractual safeguards
- Risks that weaken my conclusion if the public sources are outdated
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I confirm the due diligence scope and risk appetite with the client first.
- I decide which findings are escalated.
- I approve the go/no-go recommendation.

**Sources & Action Log**
- Corporate registries and regulatory database searches
- Sanctions screening tools and watchlist databases
- Commercial credit reports and financial analysis
- Legal database searches and public record review

**Communication & Privacy Standards**
- Objective risk assessment based on available evidence
- Protect confidential supplier information and competitive intelligence
- Clear recommendations supporting informed business decisions

**Quality Control & Reflection**
- 3 insights on supplier risk profile and mitigation strategies
- 3 questions requiring procurement and business team input
- Recommended approval conditions and ongoing monitoring procedures

**Human Review Hand-off**
Commercial counsel approval on risk assessment and procurement team consultation on alternative suppliers.`
  },
  {
    id: "esg_clause_review",
    label: "ESG — Clause Review",
    category: "ESG",
    jurisdiction: "EU",
    output_format: "bullets",
    criteria_refs: ["ESG Policy 2025"],
    tags: ["ESG", "sustainability", "compliance"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to review these ESG (Environmental, Social, Governance) clauses for feasibility, compliance risk, and alignment with our sustainability commitments.

**Facts (Extract)**
Please identify and document with citations:
- Environmental performance targets and measurement criteria
- Social responsibility commitments and community impact requirements
- Governance standards and transparency reporting obligations
- Supply chain sustainability and due diligence requirements
- Reporting frequency, format, and verification requirements
- Audit rights and third-party assessment provisions
- Remediation procedures and corrective action timelines
- Performance penalties and incentive mechanisms

**ESG Compliance Assessment**
Evaluate against current regulations and standards:
- EU Corporate Sustainability Reporting Directive (CSRD) alignment
- Taxonomy Regulation compliance for environmental activities
- Due diligence obligations under proposed EU legislation
- Industry-specific ESG standards and certification requirements
- Client ESG Policy 2025 alignment and internal consistency
- International framework compliance (GRI, SASB, TCFD)

**Feasibility & Risk Analysis**
Assess implementation challenges:
- Data collection and measurement capability requirements
- Resource allocation and system development needs
- Third-party verification and audit cost implications
- Performance target achievability within specified timelines
- Supply chain monitoring and compliance verification challenges
- Regulatory compliance risk if targets or standards not met
- Reputational risk from public reporting and transparency requirements

**Commercial Impact Assessment**
Review business implications:
- Cost implications for compliance monitoring and reporting
- Operational changes required for target achievement
- Supply chain modification and vendor qualification impacts
- Competitive advantage or disadvantage from commitments
- Customer and stakeholder relationship benefits
- Investment requirements for sustainability improvements

**Alternative Approaches**
If clauses present challenges, provide options:
- Modified targets or timelines reducing implementation risk
- Alternative measurement methodologies or standards
- Phased implementation approach with interim milestones
- Shared responsibility structures with counterparty support
- Limited scope or pilot program approaches

**Decision Points — Human Approval Required**
Seek guidance on:
- ESG target ambition levels and timeline feasibility
- Resource allocation and investment approval for compliance
- Supply chain modification requirements and vendor impacts
- Public reporting and transparency commitment levels

**Outputs**
Professional bullet-point analysis suitable for sustainability and business leadership review.

**Counterarguments (Other Party's View)**
- Strongest counterargument the counterparty will raise against the ESG obligations and audit rights
- Alternative interpretation of the clause against CSRD and CSDDD expectations
- Where both parties can agree on proportionate, measurable commitments
- Risks that weaken the clause, such as greenwashing exposure or unenforceable wording
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide which ESG commitments the client can realistically meet.
- I approve the final clause wording.

**Sources & Action Log**
- ESG Policy 2025 and internal sustainability commitments
- EU sustainability regulations and guidance documents
- Industry benchmarks and best practice standards
- Internal capability assessment and resource planning

**Communication & Privacy Standards**
- Balanced assessment supporting informed ESG strategy decisions
- Protect competitive sustainability initiatives and planning
- Clear guidance accessible to sustainability and business teams

**Quality Control & Reflection**
- 3 insights on ESG commitment feasibility and strategic alignment
- 3 questions requiring sustainability and operations team input
- Recommended implementation approach and resource requirements

**Human Review Hand-off**
ESG counsel approval on compliance assessment and sustainability team consultation on operational feasibility.`
  },
  {
    id: "sanctions_screening_note",
    label: "Sanctions — Screening Note",
    category: "Compliance",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["sanctions", "compliance", "screening"],
    complexity: "advanced",
    prompt_template: `Hi — I need to prepare a sanctions screening assessment for this transaction/relationship to ensure compliance with EU, US, and international sanctions regimes.

**Facts (Extract)**
Document screening details with precision:
- Parties involved and their corporate structure/beneficial ownership
- Geographic jurisdictions and business operation locations
- Industry sectors and specific business activities involved
- Transaction value, structure, and payment mechanisms
- Goods, services, or technology transfer elements
- Timeline and ongoing relationship duration
- Previous sanctions screening results and compliance history

**Sanctions Risk Assessment**
Screen against applicable regimes:
- EU consolidated sanctions list and restrictive measures
- US OFAC SDN list and sectoral sanctions programs
- UN Security Council sanctions and country-specific measures
- UK sanctions list and post-Brexit specific requirements
- Industry-specific sanctions (defense, technology, energy, financial)
- Secondary sanctions risk from US extraterritorial application
- Beneficial ownership screening and ultimate ownership analysis

**Compliance Analysis**
Evaluate regulatory obligations:
- Prohibited transactions and activities identification
- License requirements and available exemptions
- Due diligence obligations and enhanced screening requirements
- Reporting obligations to relevant authorities
- Record-keeping and documentation requirements
- Ongoing monitoring and periodic re-screening obligations

**Risk Rating & Recommendations**
Provide clear assessment:
- Overall compliance risk level (low/medium/high/prohibited)
- Specific risk factors and mitigation requirements
- Enhanced due diligence recommendations for elevated risk
- Compliance monitoring and ongoing screening procedures
- Documentation and record-keeping requirements
- Training and awareness needs for transaction participants

**Decision Points — Human Approval Required**
Seek guidance on:
- Risk tolerance for elevated-risk but permissible transactions
- Enhanced due diligence scope and resource allocation
- Legal opinion requirements for complex sanctions analysis
- Ongoing monitoring frequency and review procedures

**Outputs**
Professional bullet-point screening note supporting transaction approval decision and ongoing compliance.

**Counterarguments (Other Party's View)**
- Strongest counterargument that the counterparty is not owned or controlled by a listed person
- Alternative interpretation of the ownership and control test under EU sanctions guidance
- Where both parties' compliance positions differ (EU, UK, US regimes)
- Risks that weaken the screening result if ownership data is incomplete
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide whether the transaction may proceed.
- I approve any escalation to the compliance officer.

**Sources & Action Log**
- Sanctions database searches and screening tools used
- Legal analysis of applicable sanctions regimes
- Industry guidance and regulatory interpretation sources
- Client sanctions compliance policies and procedures

**Communication & Privacy Standards**
- Clear compliance guidance avoiding unnecessary business disruption
- Protect confidential transaction details and business relationships
- Accessible recommendations for compliance and business teams

**Quality Control & Reflection**
- 3 insights on sanctions landscape and compliance requirements
- 3 questions requiring compliance and business team input
- Recommended approval pathway and ongoing monitoring procedures

**Human Review Hand-off**
Sanctions counsel approval on compliance assessment and business team consultation on transaction structure.`
  },
  {
    id: "antitrust_dawnraid_card",
    label: "Antitrust — Dawn Raid Card",
    category: "Compliance",
    jurisdiction: "EU",
    output_format: "bullets",
    tags: ["antitrust", "dawn raid", "competition"],
    complexity: "advanced",
    prompt_template: `Hi — I need to create a quick reference card for employees on how to respond to an unannounced competition authority inspection (dawn raid).

**Employee Rights & Obligations**
Immediate response guidelines:
- Right to request identification and inspection warrant/authorization
- Obligation to cooperate with legitimate inspection activities
- Right to have legal counsel present during proceedings
- Prohibition on obstruction or interference with inspection
- Right to request copies of documents taken by authorities
- Obligation to provide accurate information when directly questioned
- Protection against self-incrimination and privilege considerations

**Do's — Immediate Actions**
Essential steps for employees:
- Immediately notify designated legal counsel and management contacts
- Escort inspectors at all times and monitor their activities
- Request to see official authorization and identification
- Provide reasonable cooperation with document requests
- Make contemporaneous notes of inspector activities and requests
- Preserve all relevant documents and electronic records
- Maintain professional, courteous demeanor throughout process

**Don'ts — Actions to Avoid**
Critical mistakes to prevent:
- Do not obstruct, hinder, or refuse cooperation with inspectors
- Do not destroy, alter, or hide any documents or electronic files
- Do not volunteer information beyond direct questions asked
- Do not speculate, guess, or provide opinions on legal interpretations
- Do not discuss the inspection with unauthorized personnel
- Do not sign any documents without legal counsel review
- Do not allow unsupervised access to privileged legal communications

**Internal Contacts & Communication**
Emergency contact information:
- Legal Department: [24-hour contact details]
- General Counsel: [direct line and mobile]
- Competition Law Counsel: [immediate response contact]
- Senior Management: [CEO/COO notification chain]
- External Competition Counsel: [law firm emergency contacts]
- IT Department: [document preservation and system support]

**Document Handling Procedures**
Evidence preservation requirements:
- Immediate litigation hold activation and document preservation
- Electronic system backup and forensic preservation measures
- Physical document securing and inventory preparation
- Privileged communication identification and protection
- IT system access logging and user activity monitoring
- Chain of custody procedures for documents provided to authorities

**Decision Points — Immediate Escalation Required**
Contact legal counsel immediately if:
- Inspectors request access to privileged legal communications
- Employees are asked to provide sworn statements or formal interviews
- Inspectors attempt to access personal devices or private information
- Any disputes arise regarding scope of inspection authority
- Criminal enforcement authorities become involved
- Media attention or public relations issues develop

**Post-Inspection Procedures**
Follow-up actions required:
- Comprehensive debrief with legal counsel within 24 hours
- Document inventory and copy request follow-up
- Employee interview and information gathering process
- Regulatory response strategy development and timeline
- Board and senior management comprehensive briefing
- Insurance notification and coverage assessment

**Communication Guidelines**
Internal and external messaging:
- Restrict information sharing to need-to-know basis only
- Coordinate all external communications through legal counsel
- Prepare factual holding statements for media inquiries
- Employee communication and confidentiality reminders
- Client and business partner notification protocols
- Regulatory cooperation strategy and timeline communication

**Counterarguments (Other Party's View)**
- Strongest counterargument the authority (ACM or European Commission) will raise about the scope of the inspection
- Alternative interpretation of legal professional privilege for in-house documents
- Where both parties' interests allow cooperation without waiving rights
- Risks that weaken the company's position, such as obstruction or seal breaches
- Legal basis for each staff instruction (Awb inspection powers, Regulation 1/2003 art. 20-21)
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide which documents are claimed as privileged.
- I approve every instruction given to staff during the inspection.

**Sources & Action Log**
- EU competition law inspection procedures and authority powers
- National implementing legislation and local court decisions
- Industry best practices and response protocols
- Internal compliance policies and emergency procedures

**Communication & Privacy Standards**
- Clear, actionable guidance for high-stress situations
- Protect attorney-client privilege and work product protections
- Professional response maintaining business relationships and reputation

**Quality Control & Reflection**
- 3 insights on inspection preparedness and response effectiveness
- 3 questions requiring immediate legal and management input
- Recommended training and preparation improvements

**Human Review Hand-off**
Competition counsel approval on response procedures and management briefing on preparedness requirements.`
  },
  {
    id: "merger_board_brief",
    label: "M&A — Board Brief 1-Pager",
    category: "Transactions",
    jurisdiction: "EU",
    output_format: "headings",
    tags: ["M&A", "board", "brief"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to create a concise one-page board briefing document summarizing this M&A transaction for board consideration and approval.

**Transaction Overview**
- **What's Happening:** [Transaction type, parties, and strategic rationale]
- **Key Terms:** Purchase price, structure, and material conditions
- **Timeline:** Critical milestones and expected closing date
- **Strategic Fit:** Business rationale and synergy opportunities

**Transaction Structure & Terms**
- **Purchase Price:** Total consideration and payment structure
- **Due Diligence:** Scope completed and material findings summary
- **Representations & Warranties:** Key seller commitments and risk allocation
- **Conditions Precedent:** Regulatory approvals and closing requirements
- **Post-Closing:** Integration planning and management structure

**Risk Assessment & Mitigation**
- **Business Risks:** Market, operational, and integration challenges
- **Legal & Regulatory:** Antitrust, licensing, and compliance considerations
- **Financial:** Valuation support, financing, and cash flow impact
- **Mitigation Strategies:** Risk management and contingency planning

**Strategic Options & Alternatives Considered**
- **Primary Recommendation:** Proceed with transaction as structured
- **Alternative Approaches:** Other transaction structures or strategic options evaluated
- **No-Deal Alternative:** Consequences and strategic implications of not proceeding
- **Competitive Dynamics:** Market positioning and timing considerations

**Board Decision Required**
- **Approval Sought:** Transaction authorization and management directives
- **Key Terms Requiring Ratification:** Purchase price, financing, and deal protection measures
- **Delegation of Authority:** Management signing authority and post-closing decisions
- **Governance Changes:** Board composition or committee structure modifications

**Implementation Next Steps**
- **Immediate Actions:** Legal documentation finalization and regulatory filings
- **Management Responsibilities:** Integration planning and stakeholder communication
- **Board Oversight:** Reporting requirements and milestone reviews
- **Success Metrics:** Performance indicators and value realization tracking

**Recommendation & Conclusion**
- **Management Recommendation:** Clear position on transaction approval
- **Value Creation Thesis:** Expected returns and strategic benefits
- **Risk-Reward Assessment:** Balanced evaluation supporting decision
- **Timing Criticality:** Market window and competitive considerations

**Counterarguments (Other Party's View)**
- Strongest counterargument against the transaction from a board or shareholder perspective
- Alternative interpretation of the valuation and synergy assumptions
- Where both parties' boards share interests and where they diverge
- Risks that weaken the recommendation, such as merger control or integration risks
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide the recommendation presented to the board.

**Sources & Action Log**
- Due diligence findings and third-party advisor reports
- Financial analysis and valuation supporting materials
- Legal documentation review and risk assessment
- Management presentations and strategic planning materials

**Communication & Privacy Standards**
- Board-appropriate level of detail and strategic focus
- Protect transaction confidentiality and negotiation strategy
- Clear decision framework supporting informed board governance

**Quality Control & Reflection**
- 3 insights on transaction value and strategic alignment
- 3 questions requiring board input and guidance
- Recommended board resolution and authorization scope

**Human Review Hand-off**
Corporate counsel approval on board materials and management consultation on strategic presentation.`
  },
  {
    id: "client_faq",
    label: "Client FAQ — Matter-Specific",
    category: "Client Comms",
    jurisdiction: "NL",
    output_format: "headings",
    tags: ["client", "FAQ", "communication"],
    complexity: "basic",
    prompt_template: `Hi — I need to prepare a comprehensive client FAQ document addressing common questions and concerns for this specific legal matter.

**Process & Timeline Questions**
- **Q: What are the key steps in this legal process?**
  A: [Step-by-step process overview with estimated timeframes]
- **Q: How long will this matter take to resolve?**
  A: [Realistic timeline with factors affecting duration]
- **Q: What milestones should we expect and when?**
  A: [Key decision points and deliverable schedule]
- **Q: How will we be kept informed of progress?**
  A: [Communication schedule and reporting procedures]

**Costs & Billing Information**
- **Q: What will this matter cost overall?**
  A: [Budget range and cost factors affecting total fees]
- **Q: How are legal fees calculated and billed?**
  A: [Fee structure, billing frequency, and expense policies]
- **Q: What additional costs should we anticipate?**
  A: [Court fees, expert costs, and other disbursements]
- **Q: Can costs be managed or controlled?**
  A: [Budget management options and cost control measures]

**Legal Risks & Outcomes**
- **Q: What are the main risks we face in this matter?**
  A: [Key risk factors and potential adverse outcomes]
- **Q: What are the likely outcomes or range of results?**
  A: [Possible scenarios and probability assessments]
- **Q: How can we minimize legal risks?**
  A: [Risk mitigation strategies and preventive measures]
- **Q: What decisions will we need to make during the process?**
  A: [Client decision points and approval requirements]

**Client Responsibilities & Requirements**
- **Q: What do you need from us to move forward?**
  A: [Document production, information, and cooperation requirements]
- **Q: What should we do or avoid doing during this process?**
  A: [Client guidance and behavior recommendations]
- **Q: Who should be our main contact for this matter?**
  A: [Communication protocols and designated contacts]
- **Q: How should we handle questions from employees or third parties?**
  A: [Communication guidelines and referral procedures]

**Communication & Confidentiality**
- **Q: How will confidentiality be maintained?**
  A: [Privilege protection and information security measures]
- **Q: Who can we discuss this matter with?**
  A: [Confidentiality boundaries and permitted communications]
- **Q: How should we handle media or public inquiries?**
  A: [Public relations guidelines and response protocols]
- **Q: What records should we maintain?**
  A: [Document retention and case file management]

**Decision Points — Human Approval Required**
Seek guidance on:
- Client decision authority and approval requirements for settlements
- Budget limits and cost escalation approval procedures
- Communication strategy for sensitive or high-profile matters
- Risk tolerance levels and decision-making criteria

**Counterarguments (Other Party's View)**
- Strongest counterargument or misunderstanding the client is likely to raise
- Alternative interpretation of the matter that the client may have heard elsewhere
- Where both parties' positions in the matter should be explained neutrally
- Risks that weaken an answer if facts change, flagged per question
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I approve every answer before the FAQ goes to the client.

**Sources & Action Log**
- Case-specific facts and legal analysis
- Client consultation and requirement gathering
- Industry practice and precedent matter experience
- Court procedures and regulatory requirements research

**Communication & Privacy Standards**
- Clear, accessible language avoiding legal jargon
- Balanced information supporting informed client decisions
- Confidentiality protection and privilege maintenance

**Quality Control & Reflection**
- 3 insights on client needs and communication effectiveness
- 3 questions requiring client input and clarification
- Recommended communication schedule and feedback mechanisms

**Human Review Hand-off**
Partner approval on client communication strategy and matter management approach.`
  },
  {
    id: "client_email_update",
    label: "Client Email — Update & Next Steps",
    category: "Client Comms",
    jurisdiction: "NL",
    output_format: "bullets",
    tags: ["client", "email", "update"],
    complexity: "basic",
    prompt_template: `Hi — I need to draft a professional client update email summarizing recent developments and outlining next steps in this matter.

**Recent Developments & Status Update**
Please summarize what has changed since our last communication:
- Key developments, decisions, or events in the past [time period]
- Progress made on previously identified action items
- New information received or issues discovered
- Third-party responses, court decisions, or regulatory developments
- Timeline adjustments or schedule modifications
- Budget or resource allocation updates

**Current Status & Position**
Provide clear picture of where we stand:
- Overall case/matter progress and current phase
- Outstanding issues requiring resolution
- Our current legal or negotiating position
- Counterparty actions and positions
- Regulatory or court proceeding status
- Any changed circumstances affecting strategy or timeline

**Open Items & Pending Actions**
Identify work still in progress:
- Tasks currently underway and expected completion dates
- Information or decisions still needed from client
- Third-party responses or approvals awaited
- Court deadlines or regulatory submission requirements
- Expert analysis or technical assessments in progress
- Document production or discovery activities continuing

**Decision Points Requiring Client Input**
Highlight areas needing client direction:
- Strategic decisions affecting case direction or settlement approach
- Budget or resource allocation questions requiring approval
- Settlement negotiations or offer evaluations
- Litigation strategy choices or procedural decisions
- Business operations guidance during pending matter resolution
- Communication or public relations strategy considerations

**Next Steps & Timeline**
Outline immediate action plan:
- Specific actions we will take in next [time period]
- Client actions or decisions needed and by when
- Key milestones or deadlines approaching
- Meetings, hearings, or negotiations scheduled
- Document or information production timeline
- Expected next communication or reporting date

**How We Can Help & Support**
Clarify our ongoing role:
- Additional services or expertise available if needed
- Proactive steps we're taking to advance the matter
- Resources or connections we can provide
- Alternative approaches or strategies under consideration
- Risk management or prevention measures being implemented

**Next Communication Schedule**
Set expectations for ongoing updates:
- When you can expect our next substantive update
- Circumstances that would trigger immediate communication
- Preferred communication method and frequency
- Emergency contact information for urgent matters
- Regular reporting schedule for ongoing matters

**Counterarguments (Other Party's View)**
- Strongest counterargument the other party is likely to raise next
- Alternative interpretation of the latest development and what it means for the client
- Where both parties' next steps could lead to a negotiated outcome
- Risks that weaken the proposed next steps, with timing
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide the recommended next steps.
- I send the email myself after review.

**Sources & Action Log**
- Recent case files and correspondence reviewed
- Client consultation notes and instructions
- Third-party communications and responses
- Court filings and regulatory submissions tracked

**Communication & Privacy Standards**
- Professional, clear language appropriate for business stakeholders
- Balanced information delivery avoiding unnecessary alarm
- Confidentiality protection and privilege maintenance throughout

**Quality Control & Reflection**
- 3 insights on matter progress and strategic positioning
- 3 questions requiring client clarification or input
- Recommended client actions and priority focus areas

**Human Review Hand-off**
Partner review of client communication and approval of strategy representation.`
  },
  {
    id: "ai_policy_draft",
    label: "AI Policy — For Legal Team",
    category: "Policy",
    jurisdiction: "EU",
    output_format: "headings",
    criteria_refs: ["AI Policy Baseline 2025"],
    tags: ["AI", "policy", "legal team"],
    complexity: "intermediate",
    prompt_template: `Hi — I need to draft a comprehensive AI policy specifically designed for legal team use, addressing professional responsibility, client confidentiality, and quality standards.

**Approved AI Models & Tools**
Define permitted AI technologies:
- **Enterprise-Grade Platforms:** Pre-approved AI tools with professional licenses and security features
- **Prohibited Consumer Tools:** ChatGPT free, Bard, and other consumer-grade AI platforms without enterprise controls
- **Evaluation Process:** Procedures for assessing new AI tools and obtaining approval for legal team use
- **Integration Requirements:** Technical specifications for AI tool integration with firm systems
- **Vendor Assessment:** Due diligence requirements for AI service providers and data processing agreements

**Data Security & EU Storage Requirements**
Establish data protection standards:
- **EU Data Residency:** Mandatory EU-based data processing and storage for all client information
- **Client Data Prohibition:** Absolute prohibition on inputting client names, matter details, or confidential information
- **Anonymization Standards:** Required data scrubbing and anonymization procedures before AI use
- **Audit Trails:** Comprehensive logging requirements for all AI interactions and data processing
- **Retention Limits:** Maximum data retention periods and deletion requirements for AI platforms

**Professional Responsibility & Ethics**
Address legal profession obligations:
- **Competence Requirements:** Mandatory AI literacy training and competence maintenance for legal professionals
- **Supervision Standards:** Partner oversight requirements for AI-assisted work product
- **Client Disclosure:** When and how to inform clients about AI assistance in legal work
- **Quality Control:** Review procedures ensuring AI output meets professional standards
- **Bias Detection:** Procedures for identifying and mitigating AI bias in legal analysis and recommendations

**Permitted Use Cases & Applications**
Define appropriate AI applications:
- **Research & Analysis:** Legal research, case law analysis, and regulatory guidance synthesis
- **Document Review:** Contract analysis, due diligence support, and document summarization
- **Writing Assistance:** Drafting support, proofreading, and formatting assistance for legal documents
- **Administrative Tasks:** Calendar management, time tracking, and routine correspondence
- **Prohibited Uses:** Final legal advice, client communications, and court filings without human review

**Human Oversight & Quality Assurance**
Establish supervision requirements:
- **Review Standards:** Mandatory human review and verification of all AI-generated content
- **Approval Hierarchies:** Partner sign-off requirements for AI-assisted client deliverables
- **Error Detection:** Procedures for identifying and correcting AI mistakes or hallucinations
- **Professional Judgment:** Requirements for human legal analysis confirming AI recommendations
- **Client Service Standards:** Ensuring AI use enhances rather than compromises client service quality

**Risk Controls & Incident Response**
Address operational risks:
- **Bias Monitoring:** Regular assessment of AI outputs for discrimination or unfair bias
- **Timing Accuracy:** Verification procedures for AI-provided dates, deadlines, and time-sensitive information
- **Tone Appropriateness:** Review requirements ensuring AI-assisted communications maintain professional standards
- **Confidentiality Breaches:** Incident response procedures for inadvertent disclosure of confidential information
- **System Failures:** Business continuity planning for AI tool outages or technical failures

**Training & Competence Development**
Ensure proper AI literacy:
- **Initial Training:** Comprehensive AI literacy program for all legal team members
- **Ongoing Education:** Regular updates on AI developments and best practices
- **Competence Assessment:** Periodic evaluation of AI use skills and professional responsibility compliance
- **Best Practices Sharing:** Internal knowledge sharing and lessons learned documentation
- **External Training:** Participation in professional development and industry AI training programs

**Compliance Monitoring & Reporting**
Establish oversight procedures:
- **Usage Monitoring:** Regular review of AI tool usage patterns and compliance with policy
- **Audit Procedures:** Internal and external audit requirements for AI policy compliance
- **Violation Reporting:** Procedures for reporting policy violations and non-compliance issues
- **Performance Metrics:** Key indicators measuring AI policy effectiveness and compliance rates
- **Continuous Improvement:** Regular policy review and update procedures based on experience and regulatory developments

**Counterarguments (Other Party's View)**
- Strongest counterargument from lawyers who see the policy as too restrictive for daily work
- Alternative interpretation of the EU AI Act duties (AI literacy, art. 4) for a law firm as deployer
- Where both parties (innovation and risk management) can agree on permitted use cases
- Risks that weaken the policy, such as shadow use of consumer tools
Show the reasoning step by step and check each conclusion against the source, so I can trace it.

**My Part (Lawyer)**
- I decide which tools are on the approved list.
- I set the rules on client disclosure myself.
- I approve the final policy text with the managing partner.

**Sources & Action Log**
- AI Policy Baseline 2025 requirements and industry standards
- Legal profession ethical rules and professional responsibility guidance
- EU data protection regulations and AI governance developments
- Law firm best practices and technology risk management protocols

**Communication & Privacy Standards**
- Clear guidance accessible to all legal team members
- Professional responsibility emphasis protecting client interests
- Practical implementation support balancing innovation with risk management

**Quality Control & Reflection**
- 3 insights on AI adoption risks and opportunities for legal practice
- 3 questions requiring technology and risk management input
- Recommended implementation timeline and training program development

**Human Review Hand-off**
Professional responsibility counsel approval on ethics compliance and technology team consultation on implementation feasibility.`
  }
];
