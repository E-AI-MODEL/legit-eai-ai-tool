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
      title: "Orientation & Knowledge Activation",
      description: "Learners engage with legal concepts using AI-generated scenarios and questions.",
      scenarios: [
        {
          name: "Using AI to Generate Legal Case Scenarios",
          goal: "Orient learners to a legal issue using an AI-generated case scenario.",
          microSkills: [
            "Identify legal structure",
            "Recognize relevant legal domains",
            "Pose clarifying questions"
          ],
          prompt: "Generate a short legal scenario about [topic]. Ensure the scenario raises 2–3 legal questions and leaves room for interpretation.",
          output: "Case summary + Questions list: Scenario | Key Questions",
          tips: "Ask students to annotate the scenario (who, what, where, legal issue).",
          warnings: "AI-generated scenarios may contain stereotypes or lack legal nuance.",
          example: [
            {
              scenario: "An AI system rejects job applicants using undisclosed algorithms. Is this legal under anti-discrimination law?",
              key_questions: [
                "Does this constitute discrimination?",
                "What transparency requirements apply under GDPR?"
              ]
            }
          ]
        }
      ]
    },
    {
      number: 2,
      title: "Analysis & Application",
      description: "AI is used to analyze legal clauses and support applied reasoning.",
      scenarios: [
        {
          name: "Clause Ambiguity Spotting with AI",
          goal: "Train students to detect vagueness and legal risk in contract clauses with AI assistance.",
          microSkills: [
            "Detect ambiguity",
            "Name legal risks", 
            "Formulate clarifying questions"
          ],
          prompt: "Use AI to analyze an NDA clause for ambiguity or legal incompleteness. Return: (1) flagged phrase, (2) explanation of the risk, (3) suggested rewording.",
          output: "Table: Clause | Ambiguity | Risk | Suggested Revision",
          tips: "Let students compare their revision with the AI's suggestion.",
          warnings: "AI might miss risks without legal context.",
          example: [
            {
              clause: "The party shall keep the information confidential.",
              ambiguity: "Unclear what 'confidential' specifically entails.",
              risk: "Interpretation disputes",
              revision: "Specify confidentiality: no sharing with third parties without written consent."
            }
          ]
        }
      ]
    },
    {
      number: 3,
      title: "Evaluation & Reflection",
      description: "Learners evaluate the correctness, consistency and completeness of AI-generated legal output.",
      scenarios: [
        {
          name: "Critiquing AI Legal Advice",
          goal: "Students reflect on and refine the reasoning behind AI-generated legal advice.",
          microSkills: [
            "Critique AI reasoning",
            "Evaluate legal consistency",
            "Propose additional arguments"
          ],
          prompt: "Have AI generate a legal opinion based on a case. Students should then: (1) review each reasoning step, (2) note gaps, (3) suggest improvements.",
          output: "Review Sheet: Step | AI Reasoning | Evaluation | Student's Input",
          tips: "Use a structured feedback model (e.g. Hattie & Timperley).",
          warnings: "Students must take final responsibility—AI is support, not authority.",
          example: [
            {
              step: "Apply GDPR Article 5",
              ai: "Personal data was processed without consent.",
              evaluation: "Incorrect: consent was implied through platform use.",
              student_input: "Better: assess if legitimate interest under Article 6 applies."
            }
          ]
        }
      ]
    },
    {
      number: 4,
      title: "Collaboration & Document Drafting",
      description: "Using AI to co-author legal texts and track contribution quality.",
      scenarios: [
        {
          name: "Multi-user AI Legal Drafting",
          goal: "Coordinate edits and contributions in a shared legal draft.",
          microSkills: [
            "Coordinate edits",
            "Merge input",
            "Resolve conflicts"
          ],
          prompt: "For a collaborative legal drafting project, track all edits from both human users and AI. Log the change, author (AI or human), and reasoning.",
          output: "Log: Change | Author | Justification | Timestamp",
          tips: "Use version control features and comment threading for clarity.",
          warnings: "Ensure traceability and legal validity of final version.",
          example: [
            {
              change: "Modified clause 3.1 for GDPR compliance",
              author: "AI",
              justification: "Original clause lacked explicit consent handling",
              timestamp: "2025-06-09T13:32Z"
            }
          ]
        },
        {
          name: "Alternative Clause Drafting",
          goal: "Draft and compare multiple legal clause options using AI.",
          microSkills: [
            "Adapt legal language",
            "Compare formulations",
            "Note implications"
          ],
          prompt: "Ask AI to draft 2–3 alternative phrasings of a specific clause in a contract. Summarize their legal implications.",
          output: "Table: Version | Text | Legal Effect | Risk Note",
          tips: "Discuss with peers or instructors before selecting final version.",
          warnings: "AI-generated clauses may sound correct but lack nuance.",
          example: [
            {
              version: "A",
              text: "The parties shall not disclose any confidential info without prior written consent.",
              legal_effect: "Strict mutual confidentiality",
              risk_note: "Overly rigid; may block internal audits"
            }
          ]
        }
      ]
    },
    {
      number: 5,
      title: "Legal Risk & Ethics",
      description: "Use AI to identify risks, evaluate biases, and uphold professional responsibility.",
      scenarios: [
        {
          name: "Bias Review of AI Output",
          goal: "Check AI-generated content for inappropriate or biased suggestions.",
          microSkills: [
            "Detect stereotypes",
            "Ensure inclusive language",
            "Propose corrections"
          ],
          prompt: "Review this AI-generated legal output for signs of bias or exclusionary language. Suggest neutral alternatives.",
          output: "Review Log: Phrase | Bias Risk | Neutral Alternative | Reviewer Judgment",
          tips: "Use inclusive legal writing guidelines as reference.",
          warnings: "Be aware of implicit biases in tone and structure.",
          example: [
            {
              phrase: "The chairman must approve...",
              bias_risk: "Gender-exclusive term",
              neutral_alternative: "The chairperson must approve...",
              judgment: "Needs correction"
            }
          ]
        },
        {
          name: "Legal Risk Assessment",
          goal: "Identify and categorize legal risks in a transaction or policy using AI.",
          microSkills: [
            "Identify breaches",
            "Assign risk levels", 
            "Propose mitigations"
          ],
          prompt: "Use AI to list possible legal risks in [context]. Assign a human-assessed risk level and propose mitigations.",
          output: "Matrix: Risk | Level | Mitigation | Approved by",
          tips: "Review risks with a supervisor before implementation.",
          warnings: "Don't rely on AI's level rating—human confirmation is needed.",
          example: [
            {
              risk: "Lack of data processing agreement",
              level: "High",
              mitigation: "Draft and sign DPA with vendor",
              approved_by: "Senior Legal Counsel"
            }
          ]
        }
      ]
    },
    {
      number: 6,
      title: "Client Advisory & Communication",
      description: "Translate AI-generated insights into client-ready communication.",
      scenarios: [
        {
          name: "Plain-Language Summary for Clients",
          goal: "Make AI-generated legal output understandable to non-lawyers.",
          microSkills: [
            "Translate legal terms",
            "Clarify AI logic",
            "Ensure client understanding"
          ],
          prompt: "Summarize this AI-generated legal content in plain language. Include a short FAQ for the client.",
          output: "Client Brief: Summary | Key Points | FAQ",
          tips: "Avoid Latin terms and use client-relevant examples.",
          warnings: "Ensure legal precision is preserved in simplification.",
          example: [
            {
              summary: "You can terminate the agreement with 30 days' notice.",
              key_points: [
                "Termination possible",
                "Notice period: 30 days"
              ],
              faq: [
                "Can I cancel immediately? → No, a notice is needed."
              ]
            }
          ]
        },
        {
          name: "Instructor Prompt for Case Workshop",
          goal: "Provide AI-enhanced material for classroom use on a legal issue.",
          microSkills: [
            "Design prompts",
            "Link to learning objectives",
            "Embed AI insights"
          ],
          prompt: "Generate a realistic hypothetical scenario involving [legal topic]. Include discussion prompts and AI opinion for critique.",
          output: "Case Handout: Scenario | Discussion Questions | AI Position | Reflection Section",
          tips: "Use Bloom's taxonomy to structure your classroom questions.",
          warnings: "Remind students to challenge the AI, not just accept it.",
          example: [
            {
              scenario: "An employee is fired after criticizing a company algorithm online.",
              discussion_questions: [
                "Is free speech at issue?",
                "Was due process followed?"
              ],
              ai_position: "Likely lawful termination",
              reflection: "Do you agree? Why or why not?"
            }
          ]
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
      description: "Legal education prompt template copied to clipboard."
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
You are a Legal AI Assistant for education. You assist but do not replace the professional. Respond in ENGLISH only and keep the human in control of key decisions.

Task
${scenario.prompt}

Context
- Goal: ${scenario.goal}
- Audience: law students
- Micro-skills focus: ${scenario.microSkills.join(", ")}
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
        body: { mode: "generate", context: { topic: genTopic, audience: "law students", output: "Structured bullet-list sections with clear headings", constraints: "Respond in ENGLISH only." } },
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
          <p className="text-gray-600 mt-2">Structured scenarios for AI-assisted legal education.</p>
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
            <CardDescription>Describe your legal topic or task. We'll craft an EAI-compliant prompt template.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <textarea
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                rows={3}
                placeholder="e.g., Analyze an NDA clause for ambiguity and suggest revisions"
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
                Learning Phases
              </CardTitle>
              <CardDescription>Select a learning phase to explore EAI-compliant scenarios</CardDescription>
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
                {selectedPhase ? `Phase ${selectedPhase}: ${phases.find(p => p.number === selectedPhase)?.title}` : "Select a Learning Phase"}
              </CardTitle>
              <CardDescription>
                {selectedPhase ? phases.find(p => p.number === selectedPhase)?.description : "Choose a learning phase to view EAI-compliant scenarios"}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Phase Selected</h3>
                  <p className="text-gray-600">Select a learning phase from the left to view EAI-compliant prompt scenarios.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Domain Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Domain: Legal Education / AI & Law</CardTitle>
            <CardDescription>Target Roles: Students, Instructors | EAI Model Compliance: ✅</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 break-words">
              These prompt templates are designed for legal education contexts where AI tools are used to enhance learning 
              while maintaining human agency and critical thinking. Each scenario includes built-in reflection points and 
              quality checks aligned with the EAI Model principles.
            </p>
            <div className="bg-[#0B3C5D] bg-opacity-5 p-4 rounded-lg">
              <p className="text-sm text-[#0B3C5D] break-words">
                <strong>Base Prompt Structure:</strong> Use this structure to create legal education scenarios supported by AI. 
                Insert the case, clause, or topic where required. Output must be structured, legally sound, and include a section for human review or accountability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptGenerator;
