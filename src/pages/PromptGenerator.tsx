import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Copy, Users, BookOpen, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Scenario {
  name: string;
  goal: string;
  microSkills: string[];
  prompt: string;
  output: string;
  tips?: string;
  warnings?: string;
  example?: any[];
}

interface Phase {
  number: number;
  title: string;
  description: string;
  scenarios: Scenario[];
}

const PromptGenerator = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [genTopic, setGenTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [microDetails, setMicroDetails] = useState("");
  const [phasePrompt, setPhasePrompt] = useState<string | null>(null);
  const [isQuickGen, setIsQuickGen] = useState(false);

  useEffect(() => { document.title = "Prompt Generator | EAI Legal Prompts"; }, []);

  const phases: Phase[] = [
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
      ]
    }
  ];

  const getSelectedScenario = (): Scenario | null => {
    if (selectedPhase === null || selectedScenario === null) return null;
    const phase = phases.find(p => p.number === selectedPhase);
    return phase?.scenarios[selectedScenario] || null;
  };

  const copyPrompt = () => {
    const scenario = getSelectedScenario();
    if (!scenario) return;
    
    const fullPrompt = `${scenario.prompt}\n\nExpected Output: ${scenario.output}\n\nMicro-Skills: ${scenario.microSkills.join(', ')}${scenario.tips ? '\n\nImplementation Tips: ' + scenario.tips : ''}${scenario.warnings ? '\n\nWarnings: ' + scenario.warnings : ''}`;
    
    navigator.clipboard.writeText(fullPrompt);
    toast({
      title: "EAI Prompt Copied",
      description: "Legal practice prompt template copied to clipboard."
    });
  };

  const copyExample = (example: any) => {
    const exampleText = JSON.stringify(example, null, 2);
    navigator.clipboard.writeText(exampleText);
    toast({
      title: "Example Copied",
      description: "Scenario example copied to clipboard."
    });
  };

  const handleScenarioSelect = (phaseNumber: number, scenarioIndex: number) => {
    setSelectedPhase(phaseNumber);
    setSelectedScenario(scenarioIndex);
  };

  const buildPhasePrompt = () => {
    const scenario = getSelectedScenario();
    if (!scenario) {
      toast({ title: "Select a scenario", description: "Choose a phase and scenario first.", variant: "destructive" });
      return;
    }
    const phaseTitle = phases.find(p => p.number === selectedPhase)?.title || "Phase";

    const micro = microDetails.trim();
    const assembled = `# EAI ${phaseTitle} – ${scenario.name}

Role
You are a Legal AI Copilot for practicing lawyers. You assist but do not replace legal judgment. Respond in ENGLISH only and keep the human in control of key decisions.

Task
${scenario.prompt}

Context
- Goal: ${scenario.goal}
- Audience: lawyers (in-house or law firm)
- Focus areas: ${scenario.microSkills.join(", ")}
- Micro details (optional): ${micro || "(none provided)"}

Workflow
1. Analyze the request and clarify assumptions; list any missing inputs.
2. Produce the requested output step-by-step with visible reasoning.
3. Offer 1–2 alternatives where relevant and explain trade-offs.
4. Mark decision points that require human approval and pause before proceeding.

Output Requirements
- ${scenario.output}
- Use clear headings and bullet lists (no JSON, no markdown tables, no code fences).

Audit & Logging
- Summarize key decisions, sources (if any), and rationale; provide a short audit log at the end.

Bias & Neutrality Checks
- Use neutral, inclusive language; provide alternative viewpoints where appropriate; note uncertainty.

Error & Failure Checks
- Identify possible errors or edge cases and how you mitigated them.

Reflection
- Provide 3 insights and 3 open questions for further study.

Human Review Hand‑off
- List items requiring human confirmation. Pause and ask for approval.

Start
Begin with a brief professional greeting and a one-line plan, then proceed with the Workflow.`;

    setPhasePrompt(assembled.trim());
    setIsQuickGen(false);
    setGeneratedPrompt(assembled.trim());
    toast({ title: "Prompt assembled", description: "A phase-based prompt was built." });
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  };

  const handleGeneratePrompt = async () => {
    if (!genTopic.trim()) {
      toast({ title: "Enter a topic", description: "Describe your legal task or topic first.", variant: "destructive" });
      return;
    }
    try {
      setIsGenerating(true);
      setIsQuickGen(true);
      setPhasePrompt(null);
      setGeneratedPrompt(null);
      const { data, error } = await supabase.functions.invoke("eai-prompt-suggest", {
        body: { mode: "generate", context: { topic: genTopic, audience: "lawyers", output: "Structured bullet-list sections with clear headings", constraints: "Respond in ENGLISH only." } },
      });
      if (error) throw error;
      if (data?.prompt) {
        const cleaned = String(data.prompt)
          .replace(/```[\s\S]*?```/g, "")
          .replace(/^\|.*\|.*$/gm, "")
          .replace(/^\s*\|?\s*-{2,}.*$/gm, "")
          .replace(/(?:^|\n)#{1,6}\s*Example(?:s)?(?: Implementation)?[\s\S]*$/i, "")
          .replace(/Copy Example:?/gi, "")
          .replace(/\n\{[\s\S]*?\n\}\s*/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        setGeneratedPrompt(cleaned);
        toast({ title: "Prompt generated", description: "An AI-optimized prompt is ready." });
      } else {
        toast({ title: "No prompt returned", description: "Try refining your topic.", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[#0B3C5D] hover:text-[#0B3C5D]/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FileText className="w-6 h-6 text-[#0B3C5D]" />
            <h1 className="text-xl font-bold text-[#0B3C5D]">Prompt Generator (pGen)</h1>
          </div>
          <p className="text-gray-600 mt-2">Structured scenarios for AI-assisted legal practice.</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick AI Prompt Generator */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              AI-Optimized Prompt Generator
            </CardTitle>
              <CardDescription>Describe your legal matter or task. We'll craft an EAI-compliant prompt for legal practice.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <textarea
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                rows={3}
                placeholder="e.g., Prepare a negotiation playbook for a SaaS MSA (limitation of liability focus)"
                className="w-full border rounded-md p-3 text-sm"
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleGeneratePrompt} disabled={isGenerating || !genTopic.trim()} className="gap-2">
                  {isGenerating ? "Generating..." : "Generate Prompt"}
                </Button>
                {generatedPrompt && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => { navigator.clipboard.writeText(generatedPrompt!); toast({ title: "Copied", description: "Generated prompt copied." }); }}
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                )}
              </div>
              {isQuickGen && generatedPrompt && (
                <Card className="mt-4">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Your customized EAI prompt</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Copy prompt"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt!);
                        toast({ title: "Copied", description: "Prompt copied to clipboard." });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4 bg-gray-50">
                      <pre className="font-mono text-sm whitespace-pre-wrap break-words">{generatedPrompt}</pre>
                    </div>
                    <div className="mt-4 border rounded-md p-3 bg-yellow-50">
                      <p className="text-sm">Tip: Copy this prompt and paste it into ChatGPT, Claude, or your favorite AI tool. The AI assists while you keep ownership of the thinking.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Phase Selection */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Legal Workflows
              </CardTitle>
              <CardDescription>Select a workflow to explore EAI-compliant scenarios for legal practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phases.map((phase) => (
                  <Button
                    key={phase.number}
                    variant={selectedPhase === phase.number ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      setSelectedPhase(phase.number);
                      setSelectedScenario(null);
                    }}
                  >
                    <div className="min-w-0 w-full">
                      <div className="font-medium truncate">Phase {phase.number}</div>
                      <div className="text-sm opacity-75 whitespace-normal break-words">{phase.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Selection & Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedPhase ? `Phase ${selectedPhase}: ${phases.find(p => p.number === selectedPhase)?.title}` : "Select a Legal Workflow"}
              </CardTitle>
              <CardDescription>
                {selectedPhase ? phases.find(p => p.number === selectedPhase)?.description : "Choose a workflow to view EAI-compliant scenarios"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPhase ? (
                <div className="space-y-4">
                  {/* Scenario Cards Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {phases.find(p => p.number === selectedPhase)?.scenarios.map((scenario, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          selectedScenario === index ? 'border-[#0B3C5D] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleScenarioSelect(selectedPhase, index)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base leading-tight">{scenario.name}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">{scenario.goal}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1">
                            {scenario.microSkills.slice(0, 2).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {scenario.microSkills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{scenario.microSkills.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Selected Scenario Details */}
                  {selectedScenario !== null && (
                    <div className="mt-6">
                      {(() => {
                        const scenario = phases.find(p => p.number === selectedPhase)?.scenarios[selectedScenario];
                        if (!scenario) return null;
                        
                        return (
                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#0B3C5D] flex-shrink-0" />
                                    <span className="break-words">{scenario.name}</span>
                                  </CardTitle>
                                  <CardDescription className="mt-2 break-words">{scenario.goal}</CardDescription>
                                </div>
                                <Button onClick={copyPrompt} variant="outline" className="gap-2 flex-shrink-0 ml-4">
                                  <Copy className="w-4 h-4" />
                                  Copy Prompt
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Micro-Skills */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  Micro-Skills Developed
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {scenario.microSkills.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Micro details + Build */}
                              <div>
                                <h4 className="font-semibold mb-2">Micro details (optional)</h4>
                                <textarea
                                  value={microDetails}
                                  onChange={(e) => setMicroDetails(e.target.value)}
                                  rows={3}
                                  placeholder="e.g., Contract: NDA; Jurisdiction: EU; Focus: data processing clause; Deadline: 7 days"
                                  className="w-full border rounded-md p-3 text-sm"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                  <Button onClick={buildPhasePrompt} className="gap-2">Build Perfect Prompt</Button>
                                  <Button variant="outline" onClick={() => setMicroDetails("")}>Clear micro info</Button>
                                </div>
                              </div>

                              {/* Phase Preview (after Build) */}
                              {phasePrompt && (
                                <Card className="mt-4">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle>Your customized EAI prompt</CardTitle>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      aria-label="Copy prompt"
                                      onClick={() => {
                                        navigator.clipboard.writeText(phasePrompt!);
                                        toast({ title: "Copied", description: "Prompt copied to clipboard." });
                                      }}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="border rounded-md p-4 bg-gray-50">
                                      <pre className="font-mono text-sm whitespace-pre-wrap break-words">{phasePrompt}</pre>
                                    </div>
                                    <div className="mt-4 border rounded-md p-3 bg-yellow-50">
                                      <p className="text-sm">Tip: Copy this prompt and paste it into ChatGPT, Claude, or your favorite AI tool. The AI assists while you keep ownership of the thinking.</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Template and guidance (shown until you build) */}
                              {!phasePrompt && (
                                <>
                                  {/* Prompt */}
                                  <div>
                                    <h4 className="font-semibold mb-2">EAI-Compliant Prompt Template</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border-l-4 border-[#0B3C5D] break-words whitespace-pre-wrap">
                                      {scenario.prompt}
                                    </div>
                                  </div>

                                  {/* Expected Output */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Expected Output Format</h4>
                                    <Badge variant="outline" className="font-mono break-words">
                                      {scenario.output}
                                    </Badge>
                                  </div>

                                  {/* Example */}
                                  {scenario.example && scenario.example.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                                        Example Implementation
                                      </h4>
                                      <div className="bg-yellow-50 p-3 rounded-lg border">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words overflow-x-auto">
                                          {JSON.stringify(scenario.example[0], null, 2)}
                                        </pre>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => copyExample(scenario.example![0])}
                                          className="mt-2 gap-1"
                                        >
                                          <Copy className="w-3 h-3" />
                                          Copy Example
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Tips */}
                                  {scenario.tips && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <h4 className="font-semibold text-blue-800 mb-1">Implementation Tips</h4>
                                          <p className="text-sm text-blue-700 break-words">{scenario.tips}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Warnings */}
                                  {scenario.warnings && (
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <h4 className="font-semibold text-yellow-800 mb-1">EAI Model Warnings</h4>
                                          <p className="text-sm text-yellow-700 break-words">{scenario.warnings}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
                  <p className="text-gray-600">Select a workflow from the left to view EAI-compliant prompt scenarios.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Domain Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Domain: Legal Practice</CardTitle>
            <CardDescription>Target Roles: Lawyers, In‑house Counsel | EAI Model Compliance: ✅</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 break-words">
              These prompt templates are designed for legal practice contexts where AI tools streamline analysis, drafting, and communication
              while maintaining human agency and legal judgment. Each scenario embeds reflection points and quality checks aligned with the EAI Model.
            </p>
            <div className="bg-[#0B3C5D] bg-opacity-5 p-4 rounded-lg">
              <p className="text-sm text-[#0B3C5D] break-words">
                <strong>Base Prompt Structure:</strong> Use this structure to create legal practice prompts supported by AI.
                Insert the matter, clause, or topic where required. Output must be structured, defensible, and include a section for human review/approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptGenerator;
