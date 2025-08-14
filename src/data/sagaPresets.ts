
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
    prompt_template: `Hi — I need you to create a comprehensive NDA review that extracts key facts and provides clear analysis with proper decision points.

**Your Role & Approach**
You are a legal analyst reviewing this NDA. Extract facts systematically, analyze against our guidelines, and flag decision points that require human approval. Use neutral language and provide alternatives where relevant.

**Facts (Extract) — Required Fields**
For each field below, quote the exact clause and provide pinpoint citation:
- Contract term (start/end dates in ISO format)
- Termination window (number of days notice required)
- Mutual vs one-way confidentiality (boolean: mutual/one-way)
- Governing law and jurisdiction/venue
- Definition of confidential information (scope and boundaries)
- Carve-outs (standard exceptions: public domain, independently developed, etc.)
- Non-solicitation clauses (if any)
- Intellectual property provisions
- Return/destruction obligations
- Remedies (injunctive relief, damages)

**Analysis (Interpretation) — Compare Against Firm Guideline NDA-v3**
- List deviations from our standard terms (max 5 bullet points)
- Plain-English impact of each deviation
- Risk level for each deviation (low/medium/high)
- Note any ambiguous language or unclear terms
- Provide 1-2 alternative approaches with trade-offs for high-risk items

**Decision Points — Human Approval Required**
Pause and seek approval before proceeding if you encounter:
- One-way NDAs (we prefer mutual)
- Venue outside Netherlands
- Carve-outs that exceed our standard exceptions
- Unlimited duration or unreasonable terms
- Broad definition of confidential information

**Output Requirements**
- Format: Bulleted sections with clear headings
- Style: Professional but accessible, suitable for email to client
- Length: Concise analysis, avoid legal jargon
- Include uncertainty notes where interpretation is unclear

**Sources & Action Log**
- List all sources with pinpoint citations (clause numbers, page references)
- Summarize analysis steps and tools used
- Note any assumptions made during review

**Privacy & Tone Guidelines**
- Use neutral, professional language
- Avoid certainty words (guaranteed, always, never)
- Request redacted excerpts only, avoid PII in examples
- Use "appears," "suggests," "likely" for interpretations

**Reflection & Next Steps**
Before finalizing, provide:
- 3 key insights from this review
- 3 open questions that need clarification
- Items requiring client confirmation before advice is final

**Human Review Hand-off**
List specific items that need partner review and approval before sending to client.`
  },
  {
    id: "litigation_strategy_memo",
    label: "Litigation — Strategy Memo",
    category: "Disputes", 
    jurisdiction: "NL",
    output_format: "headings",
    complexity: "advanced",
    tags: ["litigation", "strategy", "analysis"],
    prompt_template: `Hi — I need you to prepare a comprehensive litigation strategy memo that analyzes our position and outlines tactical options.

**Your Role & Approach**
You are a litigation strategist analyzing this case. Extract key facts systematically, identify legal issues, analyze strengths/weaknesses, and propose strategic options with clear trade-offs.

**Case Facts (Extract) — Key Elements**
Document with pinpoint citations:
- Parties (full legal names, roles, relationships)
- Timeline of key events (ISO dates)
- Claims asserted by each party
- Legal bases for claims (statutes, contracts, case law)
- Defenses available
- Key evidence and exhibits
- Witness information (without PII)
- Procedural posture and deadlines

**Legal Issues & Applicable Law**
- Primary legal questions to be resolved
- Governing statutes and regulations with citations
- Relevant case law and precedents
- Jurisdictional considerations
- Statute of limitations analysis
- Note areas of legal uncertainty

**Strengths & Weaknesses Analysis**
For our position:
- Strong factual arguments (with evidence support)
- Favorable legal precedents
- Credible witnesses and documentation
- Potential weaknesses and opponent's likely challenges

For opponent's position:
- Their strongest arguments
- Evidence they likely possess
- Legal theories they may advance
- Vulnerabilities we can exploit

**Strategic Options & Trade-offs**
Present 2-3 strategic approaches:

Option 1: [Aggressive/Settlement/Defensive]
- Tactical steps and timeline
- Resource requirements (time, cost, personnel)
- Likelihood of success
- Risks and potential downsides
- Client impact considerations

Option 2: [Alternative approach]
- [Same analysis framework]

**Decision Points — Human Approval Required**
Seek approval before:
- Filing any motions or pleadings
- Settlement discussions above/below specified thresholds
- Discovery scope decisions
- Expert witness retention
- Media or public relations strategy

**Resource Planning**
- Estimated timeline for key phases
- Budget considerations and cost projections
- Staffing recommendations
- External resources needed (experts, consultants)

**Risk Assessment**
- Best case scenario outcomes
- Worst case scenario outcomes
- Most likely scenario outcomes
- Factors that could change our assessment

**Privacy & Communication Guidelines**
- Maintain attorney-client privilege
- Avoid PII in written communications
- Use secure channels for sensitive information
- Clear protocols for client updates

**Sources & Action Log**
- Document review completed
- Legal research conducted
- Consultations held
- Analysis assumptions and limitations

**Reflection & Strategic Insights**
- 3 key strategic insights
- 3 critical questions needing answers
- Factors that could shift our recommendation

**Human Review Hand-off**
Items requiring partner approval:
- Strategic direction recommendation
- Budget and resource allocation
- Settlement authority parameters
- Public relations considerations`
  },
  {
    id: "contract_redline_comprehensive",
    label: "MSA — Professional Redline + Comments",
    category: "Contracts",
    jurisdiction: "EU",
    output_format: "tracked_changes", 
    complexity: "advanced",
    tags: ["redline", "MSA", "negotiation"],
    prompt_template: `Hi — I need you to produce comprehensive tracked changes and comments for this MSA that align with our firm playbook and protect client interests.

**Your Role & Approach**
You are a commercial contracts specialist. Review this MSA systematically, apply our standard positions from the Firm Playbook MSA-2025, and provide clear redlines with strategic comments.

**Pre-Review Assessment**
First, identify and note:
- Missing key terms (pricing model, liability caps, service levels)
- Document structure and organization issues
- Immediate red flags or unusual provisions
- Applicable law and jurisdiction

**Redline Strategy — Apply Firm Playbook MSA-2025**

**CRITICAL PROVISIONS (Must-Fix Priority)**
For each provision below, provide tracked changes with rationale:

1. **Liability & Indemnification**
   - Cap overall liability at appropriate level
   - Carve out uncapped liability for breach of confidentiality, IP infringement, gross negligence
   - Ensure mutual indemnification structure
   - Comment: [Risk level and negotiation approach]

2. **Intellectual Property**
   - Clarify IP ownership (pre-existing vs. developed)
   - Include appropriate IP indemnification
   - Address derivative works and improvements
   - Comment: [Client IP protection strategy]

3. **Service Levels & Performance**
   - Define measurable service level requirements
   - Include remedies for SLA failures
   - Address service credits and termination rights
   - Comment: [Business continuity implications]

4. **Data Protection & Security**
   - GDPR compliance provisions
   - Data processing terms and safeguards
   - Breach notification requirements
   - Comment: [Regulatory compliance approach]

5. **Termination & Transition**
   - Include termination for convenience rights
   - Define reasonable notice periods
   - Address data return/deletion obligations
   - Include transition assistance provisions
   - Comment: [Exit strategy considerations]

**STANDARD PROVISIONS (Optional but Recommended)**
- Payment terms and invoice procedures
- Change management process
- Dispute resolution mechanisms
- Force majeure provisions
- Amendment procedures

**Alternative Approaches**
For each must-fix item, provide:
- Primary recommendation with rationale
- 1-2 fallback positions if primary is rejected
- Trade-offs and business implications of each approach

**Comments Strategy**
For each redline, include:
- Brief rationale (1-2 sentences)
- Risk level (low/medium/high)
- Negotiation approach ("standard position" vs "willing to discuss")
- Business impact explanation

**Decision Points — Human Approval Required**
Pause for approval on:
- Liability cap levels above/below firm guidelines
- Indemnification scope and carve-outs
- Governing law selection
- Termination for convenience inclusion/exclusion
- Any provisions marked "business decision required"

**Deliverables Format**
- Word document with tracked changes enabled
- Comment bubbles for each change with rationale
- Summary memo highlighting key negotiation points
- Redline comparison table for critical terms

**Negotiation Intelligence**
- Anticipate counterparty likely objections
- Prepare fallback positions for high-priority items
- Identify provisions where we can show flexibility
- Note industry-standard approaches for benchmarking

**Sources & Documentation**
- Reference Firm Playbook MSA-2025 sections
- Cite relevant legal requirements (GDPR, etc.)
- Note industry best practices applied
- Document assumptions about client business needs

**Privacy & Confidentiality**
- Remove or redact PII from examples
- Use placeholders for confidential business terms
- Maintain privilege over strategy discussions
- Follow secure document handling procedures

**Quality Control Checklist**
Before finalizing:
- All must-fix items addressed
- Comments are clear and actionable
- Document formatting is professional
- Legal citations are accurate

**Human Review Hand-off**
Items requiring partner sign-off:
- Overall negotiation strategy
- Liability cap recommendations
- Any deviations from standard playbook
- Client-specific business considerations

**Reflection & Strategy**
- 3 key negotiation insights
- 3 potential deal risks to monitor
- Recommended approach for initial discussion with counterparty`
  },
  {
    id: "client_advisory_memo",
    label: "Client Advisory — Comprehensive Memo",
    category: "Client Comms",
    jurisdiction: "EU",
    output_format: "headings",
    complexity: "intermediate", 
    tags: ["client", "advisory", "communication"],
    prompt_template: `Hi — I need you to prepare a comprehensive client advisory memo that clearly explains the legal situation and provides actionable recommendations.

**Your Role & Approach**
You are a client advisor preparing a memo for business executives. Translate complex legal issues into clear business guidance with practical next steps and risk assessment.

**Executive Summary**
Lead with a 3-4 sentence summary covering:
- The key legal issue or question
- Our bottom-line recommendation
- Critical timeline or action items
- Material risks to highlight

**Background & Context**
- Relevant business context and timeline
- Key stakeholders and their interests
- Previous legal advice or decisions
- Current regulatory or market environment
- Why this issue needs attention now

**Legal Analysis**

**Applicable Law & Regulations**
- Governing legal framework with citations
- Recent regulatory changes or guidance
- Relevant industry standards or best practices
- Jurisdictional considerations (multi-country if applicable)

**Key Legal Issues**
For each main issue:
- Clear statement of the legal question
- Analysis of how law applies to client's situation
- Relevant precedents or regulatory guidance
- Areas of legal uncertainty or gray areas
- Potential changes in legal landscape

**Risk Assessment**

**High Priority Risks**
- Most significant legal/business risks
- Likelihood and potential impact
- Timeline for when risks might materialize
- Factors that could increase/decrease risk

**Medium Priority Considerations**
- Secondary risks and considerations
- Operational or reputational implications
- Cost/benefit analysis of different approaches

**Recommendations & Next Steps**

**Immediate Actions (Next 30 Days)**
1. [Specific action with owner and deadline]
2. [Specific action with owner and deadline]
3. [Specific action with owner and deadline]

**Medium-term Strategy (30-90 Days)**
- Strategic initiatives to address core issues
- Process improvements or policy changes
- Stakeholder engagement requirements

**Long-term Considerations (90+ Days)**
- Ongoing monitoring requirements
- Future legal developments to track
- Strategic planning implications

**Implementation Support**
- Legal team involvement and oversight
- External resources needed (consultants, etc.)
- Budget considerations and approvals required
- Timeline and milestone tracking

**Decision Points Requiring Business Input**
Present options where business judgment is needed:

**Option 1: [Conservative Approach]**
- Description and rationale
- Legal/business benefits
- Costs and limitations
- Implementation timeline

**Option 2: [Balanced Approach]** 
- [Same analysis framework]

**Option 3: [Aggressive Approach]**
- [Same analysis framework]

**Monitoring & Compliance Framework**
- Key metrics or indicators to track
- Reporting requirements and frequency
- Review and update procedures
- Escalation triggers and procedures

**Communication Strategy**
- Internal stakeholder communication plan
- External communication considerations
- Regulatory notification requirements
- Public relations or investor considerations

**Budget & Resource Planning**
- Legal fees and external costs
- Internal resource requirements
- Technology or system investments
- Timeline for expenditures

**Sources & Authority**
- Statutes, regulations, and case law cited
- Industry guidance and best practices
- Expert consultations conducted
- Assumptions and limitations of analysis

**Confidentiality & Privilege**
- Maintain attorney-client privilege
- Handle confidential business information appropriately
- Use secure communication channels
- Follow document retention policies

**Quality Assurance**
- Legal accuracy verification
- Business impact assessment
- Practical implementation review
- Client communication effectiveness

**Human Review Requirements**
Items needing partner approval:
- Significant legal positions or interpretations
- High-risk recommendations
- Material cost or resource commitments
- Regulatory reporting or filing decisions

**Follow-up & Accountability**
- Next review meeting scheduled
- Action item tracking system
- Success metrics and evaluation criteria
- Contingency planning for changed circumstances

This memo provides comprehensive guidance while maintaining clear business focus and actionable recommendations for executive decision-making.`
  },
  {
    id: "due_diligence_comprehensive",
    label: "M&A — Comprehensive Due Diligence Review",
    category: "Transactions",
    jurisdiction: "EU",
    output_format: "headings",
    complexity: "advanced",
    tags: ["M&A", "due diligence", "risk assessment"],
    prompt_template: `Hi — I need you to conduct a comprehensive legal due diligence review that identifies key risks and provides clear recommendations for this M&A transaction.

**Your Role & Approach**
You are a senior M&A associate conducting legal due diligence. Systematically review all legal aspects, identify material risks, and provide actionable recommendations with clear prioritization.

**Transaction Overview & Context**
- Transaction structure (asset/share deal, merger, etc.)
- Target company business description
- Deal rationale and strategic objectives
- Timeline and key milestones
- Regulatory approvals required

**Due Diligence Scope & Methodology**
- Documents reviewed and data room analysis
- Management interviews conducted
- External searches and investigations
- Third-party reports obtained
- Limitations and scope restrictions

**CRITICAL RISK AREAS**

**Corporate Structure & Governance**
- Corporate organization and subsidiaries
- Board composition and governance practices
- Shareholder agreements and restrictions
- Compliance with corporate formalities
- Outstanding corporate actions or disputes

**Material Contracts & Commercial Arrangements**
- Revenue-generating agreements analysis
- Key supplier and vendor contracts
- Partnership and joint venture agreements
- Distribution and licensing deals
- Contract change of control provisions
- Termination risks and renewal terms

**Employment & Human Resources**
- Senior management contracts and retention
- Employee benefits and pension obligations
- Labor relations and union agreements
- Outstanding employment disputes
- Compliance with employment law
- Change of control implications

**Intellectual Property Portfolio**
- IP ownership and registration status
- Third-party licensing agreements
- IP infringement risks and disputes
- Trade secrets and know-how protection
- Employee invention assignments
- Open source software compliance

**Regulatory & Compliance Framework**
- Industry-specific regulatory compliance
- Licenses and permits status
- Regulatory investigations or enforcement
- Data protection and privacy compliance
- Anti-corruption and sanctions compliance
- Environmental compliance obligations

**Litigation & Disputes**
- Ongoing litigation and arbitration
- Regulatory investigations and proceedings
- Insurance coverage and claims
- Indemnification obligations
- Potential liability exposure
- Settlement agreements and releases

**Financial & Tax Considerations**
- Accounting practices and policies
- Tax compliance and controversies
- Transfer pricing arrangements
- Tax optimization structures
- Contingent tax liabilities
- Post-transaction tax planning

**RISK ASSESSMENT MATRIX**

**High Priority Issues (Deal Breakers)**
For each high-risk item:
- Clear description of the issue
- Potential financial impact (quantified if possible)
- Likelihood of materialization
- Impact on transaction timeline
- Recommended mitigation strategies

**Medium Priority Issues (Negotiation Points)**
- Issues requiring contractual protection
- Indemnification or escrow considerations
- Price adjustment implications
- Post-closing integration risks

**Low Priority Issues (Monitor)**
- Items for awareness but limited impact
- Standard business risks
- Issues with adequate existing protections

**TRANSACTION RECOMMENDATIONS**

**Deal Structure Optimization**
- Recommended transaction structure
- Tax efficiency considerations
- Regulatory approval strategy
- Financing structure implications

**Purchase Agreement Terms**
- Representations and warranties scope
- Indemnification structure and caps
- Material adverse change definitions
- Closing conditions and requirements
- Post-closing covenants and restrictions

**Risk Mitigation Strategies**
- Insurance coverage recommendations
- Escrow and holdback arrangements
- Third-party consents and approvals
- Regulatory compliance programs
- Integration planning priorities

**Valuation Impact Analysis**
- Issues affecting purchase price
- Working capital and debt adjustments
- Contingent consideration implications
- Tax attributes and benefits
- Synergy realization risks

**Integration Planning**
- Legal entity rationalization
- Contract harmonization priorities
- Compliance program integration
- System and process alignment
- Cultural and organizational considerations

**Decision Points Requiring Business Input**

**Risk Tolerance Assessment**
- Acceptable level of identified risks
- Risk/reward trade-off analysis
- Competitive situation impact
- Strategic importance weighting

**Commercial Terms Negotiation**
- Price adjustment mechanisms
- Indemnification scope and limits
- Closing condition requirements
- Post-closing cooperation terms

**POST-CLOSING OBLIGATIONS**

**Integration Execution**
- Legal entity integration timeline
- Contract renegotiation priorities
- Compliance program rollout
- Employee communication and retention

**Ongoing Risk Management**
- Monitoring and reporting requirements
- Insurance and indemnification claims
- Regulatory compliance oversight
- Performance metrics and KPIs

**Documentation & Work Papers**
- Due diligence report and appendices
- Risk register and mitigation tracking
- Legal opinions and third-party reports
- Management interview summaries

**Professional Standards Compliance**
- Maintain attorney-client privilege
- Confidentiality agreement compliance
- Conflict of interest monitoring
- Professional liability coverage

**Quality Control Framework**
- Partner review and sign-off requirements
- Technical accuracy verification
- Business judgment validation
- Client communication effectiveness

**Human Review & Approval Requirements**
Items requiring partner approval:
- High-risk issue identification and assessment
- Deal structure and terms recommendations
- Material legal opinions or interpretations
- Significant cost or timeline implications

This comprehensive due diligence review provides systematic risk assessment and actionable recommendations to support informed transaction decision-making.`
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
