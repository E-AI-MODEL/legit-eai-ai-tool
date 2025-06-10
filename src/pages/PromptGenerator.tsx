
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Copy, Users, BookOpen, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Scenario {
  name: string;
  goal: string;
  prompt: string;
  output: string;
  tips?: string;
  warnings?: string;
}

interface Phase {
  number: number;
  title: string;
  scenarios: Scenario[];
}

const PromptGenerator = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const phases: Phase[] = [
    {
      number: 1,
      title: "Orientation & Knowledge Activation",
      scenarios: [
        {
          name: "AI-Generated Case Scenario",
          goal: "Introduce a legal issue with AI-generated facts.",
          prompt: "Generate a short legal scenario about [topic] that raises 2-3 legal questions.",
          output: "Scenario | Key Questions",
          tips: "Have students annotate who/what/where/legal issue.",
          warnings: "AI scenarios may contain stereotypes."
        }
      ]
    },
    {
      number: 2,
      title: "Analysis & Application",
      scenarios: [
        {
          name: "Clause Ambiguity Spotting",
          goal: "Find vagueness and risk in an NDA clause.",
          prompt: "Analyse the clause ↓ for ambiguity; return phrase, risk, suggested rewording.",
          output: "Phrase | Risk | Revision",
          tips: "Let students compare their version with AI suggestion.",
          warnings: "AI may miss context-specific risks."
        }
      ]
    },
    {
      number: 3,
      title: "Evaluation & Reflection",
      scenarios: [
        {
          name: "Critique AI Legal Advice",
          goal: "Review AI opinion step-by-step.",
          prompt: "Have AI draft an opinion; students evaluate each step.",
          output: "Step | AI | Evaluation | Student Input",
          tips: "Ensure students take final responsibility.",
          warnings: "AI can appear persuasive yet be wrong."
        }
      ]
    },
    {
      number: 4,
      title: "Collaboration & Drafting",
      scenarios: [
        {
          name: "Multi-user Drafting Log",
          goal: "Track edits by AI and humans.",
          prompt: "Record every change, author, and reason.",
          output: "Change | Author | Reason | Time"
        },
        {
          name: "Alternative Clause Drafting",
          goal: "Generate 2-3 clause versions and compare impacts.",
          prompt: "Ask AI for clause versions A/B/C plus legal effect summary.",
          output: "Version | Text | Effect | Risk"
        }
      ]
    },
    {
      number: 5,
      title: "Legal Risk & Ethics",
      scenarios: [
        {
          name: "Bias Review",
          goal: "Detect biased language.",
          prompt: "Scan text for exclusionary terms and propose neutral wording.",
          output: "Phrase | Bias Risk | Neutral Alternative"
        },
        {
          name: "Risk Assessment Matrix",
          goal: "List legal risks and mitigations.",
          prompt: "Identify risks in [context]; rate level; suggest mitigation.",
          output: "Risk | Level | Mitigation | Approved"
        }
      ]
    },
    {
      number: 6,
      title: "Client Communication",
      scenarios: [
        {
          name: "Plain-Language Brief",
          goal: "Explain legal content in everyday language.",
          prompt: "Summarise AI legal output in plain English; add client FAQ.",
          output: "Summary | Key Points | FAQ"
        },
        {
          name: "Case Workshop Prompt",
          goal: "Create discussion prompts with AI stance for critique.",
          prompt: "Generate a hypothetical scenario on [topic] + AI opinion + discussion Qs.",
          output: "Scenario | Questions | AI Position | Reflection"
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
    
    const fullPrompt = `${scenario.prompt}\n\nExpected Output: ${scenario.output}${scenario.tips ? '\n\nTips: ' + scenario.tips : ''}${scenario.warnings ? '\n\nWarnings: ' + scenario.warnings : ''}`;
    
    navigator.clipboard.writeText(fullPrompt);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Phase Selection */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Phases
              </CardTitle>
              <CardDescription>Select a learning phase to explore scenarios</CardDescription>
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
                    <div>
                      <div className="font-medium">Phase {phase.number}</div>
                      <div className="text-sm opacity-75 whitespace-normal">{phase.title}</div>
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
                {selectedPhase ? `Phase ${selectedPhase}: ${phases.find(p => p.number === selectedPhase)?.title}` : "Select a Phase"}
              </CardTitle>
              <CardDescription>
                {selectedPhase ? "Choose a scenario to generate prompts" : "Choose a learning phase to view available scenarios"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPhase ? (
                <div className="space-y-4">
                  {/* Scenario Tabs */}
                  <Tabs value={selectedScenario?.toString() || ""} onValueChange={(value) => setSelectedScenario(parseInt(value))}>
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto">
                      {phases.find(p => p.number === selectedPhase)?.scenarios.map((scenario, index) => (
                        <TabsTrigger key={index} value={index.toString()} className="text-left h-auto p-3">
                          <div>
                            <div className="font-medium">{scenario.name}</div>
                            <div className="text-xs opacity-75">{scenario.goal}</div>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {phases.find(p => p.number === selectedPhase)?.scenarios.map((scenario, index) => (
                      <TabsContent key={index} value={index.toString()} className="space-y-4">
                        {/* Scenario Details */}
                        <Card>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                                <CardDescription>{scenario.goal}</CardDescription>
                              </div>
                              <Button onClick={copyPrompt} variant="outline" className="gap-2">
                                <Copy className="w-4 h-4" />
                                Copy
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Prompt */}
                            <div>
                              <h4 className="font-semibold mb-2">Prompt Template</h4>
                              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                                {scenario.prompt}
                              </div>
                            </div>

                            {/* Expected Output */}
                            <div>
                              <h4 className="font-semibold mb-2">Expected Output Format</h4>
                              <Badge variant="outline" className="font-mono">
                                {scenario.output}
                              </Badge>
                            </div>

                            {/* Tips */}
                            {scenario.tips && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold text-blue-800 mb-1">Implementation Tips</h4>
                                    <p className="text-sm text-blue-700">{scenario.tips}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Warnings */}
                            {scenario.warnings && (
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold text-yellow-800 mb-1">Important Warnings</h4>
                                    <p className="text-sm text-yellow-700">{scenario.warnings}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Phase Selected</h3>
                  <p className="text-gray-600">Select a learning phase from the left to view available prompt scenarios.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Domain Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Domain: Legal Education / AI & Law</CardTitle>
            <CardDescription>Target Roles: Students, Instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              These prompt templates are designed for legal education contexts where AI tools are used to enhance learning 
              while maintaining human agency and critical thinking. Each scenario includes built-in reflection points and 
              quality checks aligned with the EAI Model principles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptGenerator;
