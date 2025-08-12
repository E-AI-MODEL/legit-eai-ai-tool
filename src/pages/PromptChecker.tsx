
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Copy, FileDown, AlertTriangle, XCircle, Clock, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
interface CheckResult {
  rubric: string;
  flag: string;
  check: string;
  advice: string;
  status: "pass" | "warning" | "fail";
  score: number;
}

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);
  const [strictMode, setStrictMode] = useState(true);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const checkRules: Omit<CheckResult, 'status' | 'score'>[] = [
    {
      rubric: "Cognitive Ownership & Traceability",
      flag: "🟠 Traceability missing",
      check: "Prompt does not require users to reconstruct or justify their own reasoning; no trace-back or justification mapping.",
      advice: "Add a step for user to annotate, explain, or justify acceptance/rejection of AI output."
    },
    {
      rubric: "Agency & Didactic Controllability",
      flag: "🚨 Agency risk",
      check: "Unclear or missing specification of who decides (AI or human); no explicit review/approval workflow.",
      advice: "Define exact roles: when AI suggests, when human reviews/approves, and where handover occurs."
    },
    {
      rubric: "Reverse Scaffolding/Task Density",
      flag: "⚠️ Reverse scaffolding",
      check: "AI is assigned most or all thinking, drafting, and review steps; user is passive.",
      advice: "Distribute key steps: require user to plan, draft, or reflect before/after AI involvement."
    },
    {
      rubric: "Sycophancy & Drift Awareness",
      flag: "🟡 Drift risk",
      check: "Prompt lacks user-AI comparison, critique, or challenge step; risk of passive alignment.",
      advice: "Ask user to compare their reasoning to AI, challenge differences, and justify agreement/disagreement."
    },
    {
      rubric: "Compliance, Audit & Logging",
      flag: "🔒 Audit trail missing",
      check: "No mention of how decisions or outputs will be logged for audit/compliance.",
      advice: "Specify who logs decisions, changes, and rationale; require an audit trail."
    },
    {
      rubric: "Bias, Inclusion & Professional Neutrality",
      flag: "🚨 Potential bias",
      check: "Prompt uses absolute/biased terms, or lacks instruction for alternatives/perspectives.",
      advice: "Use neutral language; require multiple viewpoints or explicit alternative interpretations."
    },
    {
      rubric: "Output Specification & Structure",
      flag: "⚪ Output format missing",
      check: "Output structure is not specified or is ambiguous.",
      advice: "State required format: table, memo, checklist, log; assign section reviewers if needed."
    },
    {
      rubric: "Problem Complexity & Visible Reasoning",
      flag: "⚠️ Shallow reasoning",
      check: "Prompt requests only final answer, no breakdown, no trace or alternative solutions.",
      advice: "Request stepwise reasoning, breakdowns, and explicit reasoning traces."
    },
    {
      rubric: "Error & Failure Analysis",
      flag: "🟠 Error awareness missing",
      check: "No error detection, correction, or reflection step in the prompt.",
      advice: "Add a requirement to identify, reflect on, and correct mistakes or edge cases."
    },
    {
      rubric: "Legal Learning Mode",
      flag: "🟣 Reflection missing",
      check: "Prompt does not ask for user reflection, learning summary, or uncertainty analysis.",
      advice: "Require summary of insights, open questions, or next steps for deeper learning."
    }
  ];

  // Scoring helpers
  const rubricKeywords: Record<string, string[]> = {
    "Cognitive Ownership & Traceability": ["justify", "explain", "reasoning", "trace", "annotate", "reconstruct"],
    "Agency & Didactic Controllability": ["review", "approve", "decide", "human", "final decision", "handover"],
    "Reverse Scaffolding/Task Density": ["plan", "draft", "reflect", "before", "after", "user"],
    "Sycophancy & Drift Awareness": ["compare", "critique", "challenge", "disagree", "question"],
    "Compliance, Audit & Logging": ["log", "record", "audit", "track", "document"],
    "Bias, Inclusion & Professional Neutrality": ["consider", "alternative", "perspective", "viewpoint"],
    "Output Specification & Structure": ["format", "table", "list", "structure", "memo", "checklist"],
    "Problem Complexity & Visible Reasoning": ["step", "reasoning", "breakdown", "trace", "explain how"],
    "Error & Failure Analysis": ["error", "mistake", "correct", "check", "verify"],
    "Legal Learning Mode": ["reflection", "learn", "insight", "summary", "question"],
  };

  const coverageForRubric = (promptLower: string, rubric: string) => {
    const keys = rubricKeywords[rubric] || [];
    if (!keys.length) return 0;
    const present = keys.reduce((acc, k) => acc + (promptLower.includes(k) ? 1 : 0), 0);
    return present / keys.length; // 0..1
  };

  const statusWeight = (s: "pass" | "warning" | "fail") => ({ pass: 85, warning: 55, fail: 25 }[s]);

  const withScores = (items: Omit<CheckResult, "score">[] | CheckResult[], promptText: string): CheckResult[] => {
    const lower = promptText.toLowerCase();
    return (items as any[]).map((r) => {
      const status: "pass" | "warning" | "fail" = (r.status as any) ?? "warning";
      const cov = coverageForRubric(lower, r.rubric);
      const score = Math.round(statusWeight(status) * 0.6 + cov * 100 * 0.4);
      return { ...(r as any), status, score } as CheckResult;
    });
  };

  const severityRank = (s: "pass" | "warning" | "fail") => ({ pass: 0, warning: 1, fail: 2 }[s]);

  const mergeWorst = (ai: CheckResult[], heur: CheckResult[]): CheckResult[] => {
    const byRubricAI = new Map(ai.map((r) => [r.rubric, r]));
    return heur.map((hr) => {
      const ar = byRubricAI.get(hr.rubric);
      const chosen = !ar || severityRank(hr.status) >= severityRank(ar.status) ? hr : ar;
      const other = ar && chosen === ar ? hr : ar ?? hr;
      const score = Math.min(chosen.score, other?.score ?? chosen.score);
      return { ...chosen, score };
    });
  };

  const computeHeuristicResults = (promptText: string): Omit<CheckResult, "score">[] => {
    const promptLower = promptText.toLowerCase();
    return checkRules.map(rule => {
      let status: "pass" | "warning" | "fail" = "fail";

      if (rule.rubric === "Cognitive Ownership & Traceability") {
        const tracabilityKeywords = rubricKeywords[rule.rubric];
        status = tracabilityKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      } else if (rule.rubric === "Agency & Didactic Controllability") {
        const agencyKeywords = rubricKeywords[rule.rubric];
        status = agencyKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "fail";
      } else if (rule.rubric === "Reverse Scaffolding/Task Density") {
        const scaffoldingWords = rubricKeywords[rule.rubric];
        const aiDominanceWords = ["ai will", "ai should", "ai must", "generate", "create"];
        const hasScaffolding = scaffoldingWords.some(keyword => promptLower.includes(keyword));
        const hasAiDominance = aiDominanceWords.some(keyword => promptLower.includes(keyword));
        status = hasScaffolding && !hasAiDominance ? "pass" : hasScaffolding ? "warning" : "fail";
      } else if (rule.rubric === "Sycophancy & Drift Awareness") {
        const driftKeywords = rubricKeywords[rule.rubric];
        status = driftKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      } else if (rule.rubric === "Compliance, Audit & Logging") {
        const auditKeywords = rubricKeywords[rule.rubric];
        status = auditKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "fail";
      } else if (rule.rubric === "Bias, Inclusion & Professional Neutrality") {
        const biasedTerms = ["always", "never", "obviously", "clearly", "definitely"];
        const neutralTerms = rubricKeywords[rule.rubric];
        const hasBiasedTerms = biasedTerms.some(term => promptLower.includes(term));
        const hasNeutralTerms = neutralTerms.some(term => promptLower.includes(term));
        status = !hasBiasedTerms && hasNeutralTerms ? "pass" : !hasBiasedTerms ? "warning" : "fail";
      } else if (rule.rubric === "Output Specification & Structure") {
        const formatKeywords = rubricKeywords[rule.rubric];
        status = formatKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      } else if (rule.rubric === "Problem Complexity & Visible Reasoning") {
        const reasoningKeywords = rubricKeywords[rule.rubric];
        status = reasoningKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      } else if (rule.rubric === "Error & Failure Analysis") {
        const errorKeywords = rubricKeywords[rule.rubric];
        status = errorKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      } else if (rule.rubric === "Legal Learning Mode") {
        const learningKeywords = rubricKeywords[rule.rubric];
        status = learningKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
      }

      return { ...rule, status } as Omit<CheckResult, "score">;
    });
  };

  const runPromptCheck = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to check.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    let aiResultsRaw: Omit<CheckResult, "score">[] | null = null;

    try {
      const { data, error } = await supabase.functions.invoke("eai-semantic-check", {
        body: { prompt },
      });
      if (error) throw error;
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        aiResultsRaw = data.results as Omit<CheckResult, "score">[];
      }
    } catch (e) {
      console.warn("AI check failed, continuing with heuristic:", e);
    }

    try {
      const heurRaw = computeHeuristicResults(prompt);
      const heur = withScores(heurRaw, prompt);
      let finalResults: CheckResult[] = heur;
      let mode = "Heuristic";

      if (aiResultsRaw) {
        const ai = withScores(aiResultsRaw, prompt);
        if (strictMode) {
          finalResults = mergeWorst(ai, heur);
          mode = "Strict Mode (AI ∩ Heuristic)";
        } else {
          finalResults = ai;
          mode = "AI";
        }
      }

      setResults(finalResults);
      setHasResults(true);

      const failCount = finalResults.filter(r => r.status === "fail").length;
      const warningCount = finalResults.filter(r => r.status === "warning").length;
      const passCount = finalResults.filter(r => r.status === "pass").length;
      const overall = Math.round(finalResults.reduce((a, b) => a + (b.score ?? 0), 0) / finalResults.length);
      setOverallScore(overall);

      toast({
        title: `EAI Compliance Analysis Complete (${mode})`,
        description: `${passCount} passed, ${warningCount} warnings, ${failCount} critical issues. Overall ${overall}/100.`
      });
    } finally {
      setIsChecking(false);
    }
  };

  const suggestBetterPrompt = async () => {
    if (!prompt.trim()) return;
    try {
      setIsSuggesting(true);
      const { data, error } = await supabase.functions.invoke("eai-prompt-suggest", {
        body: { mode: "improve", prompt },
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
        setSuggestedPrompt(cleaned);
        toast({ title: "Suggestion ready", description: "An improved prompt was generated." });
      } else {
        toast({ title: "No suggestion", description: "The AI couldn't suggest a better prompt.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to suggest a better prompt.", variant: "destructive" });
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const getStatusIcon = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "fail": return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "fail": return "bg-red-100 text-red-800";
    }
  };

  const copyResults = () => {
    const summary = results.map(r => 
      `${r.rubric}: ${r.status.toUpperCase()}\n${r.advice}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied",
      description: "EAI compliance results copied to clipboard."
    });
  };

  const downloadReport = () => {
    const report = {
      prompt,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.status === "pass").length,
        warnings: results.filter(r => r.status === "warning").length,
        failed: results.filter(r => r.status === "fail").length
      },
      eaiModel: "EAI Model Compliance Check v1.0"
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eai-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: "Export Complete",
      description: "EAI compliance report downloaded."
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
            <CheckCircle className="w-6 h-6 text-[#0B3C5D]" />
            <h1 className="text-xl font-bold text-[#0B3C5D]">Prompt Checker (pCheck)</h1>
          </div>
          <p className="text-gray-600 mt-2">Paste any AI prompt and run a full EAI Model compliance & quality check.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1: Paste Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Paste Prompt</CardTitle>
            <CardDescription>Enter the AI prompt you want to check for EAI Model compliance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste or type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="w-full"
              maxLength={5000}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-sm text-gray-600 whitespace-nowrap">{prompt.length}/5000<span className="hidden sm:inline"> characters</span></p>
                <div className="flex items-center gap-2">
                  <Switch id="strict-mode" checked={strictMode} onCheckedChange={setStrictMode} />
                  <label htmlFor="strict-mode" className="text-sm text-gray-700">Strict Mode</label>
                </div>
              </div>
              <Button onClick={runPromptCheck} disabled={isChecking || !prompt.trim()} className="gap-2 w-full sm:w-auto">
                {isChecking ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Analyzing EAI Compliance...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Check EAI Compliance
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasResults && (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Step 2: EAI Model Analysis Results</CardTitle>
                    <CardDescription>Comprehensive compliance check against all EAI Model criteria</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Button variant="outline" onClick={copyResults} className="gap-2 w-full sm:w-auto">
                      <Copy className="w-4 h-4" />
                      Copy Summary
                    </Button>
                    <Button variant="outline" onClick={suggestBetterPrompt} disabled={isSuggesting} className="gap-2 w-full sm:w-auto">
                      <Lightbulb className="w-4 h-4" />
                      {isSuggesting ? "Suggesting..." : "Suggest Better Prompt"}
                    </Button>
                    <Button onClick={downloadReport} className="gap-2 w-full sm:w-auto">
                      <FileDown className="w-4 h-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.status === "pass").length}
                    </div>
                    <div className="text-sm text-green-700">Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {results.filter(r => r.status === "warning").length}
                    </div>
                    <div className="text-sm text-yellow-700">Warnings</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {results.filter(r => r.status === "fail").length}
                    </div>
                    <div className="text-sm text-red-700">Critical Issues</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {overallScore ?? 0}
                    </div>
                    <div className="text-sm text-blue-700">Overall Score</div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-semibold">{result.rubric}</h4>
                            <p className="text-sm text-gray-600">{result.check}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:self-center">
                          <span className="text-sm">{result.flag}</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Strength</span>
                          <span>{Math.round(result.score)}%</span>
                        </div>
                        <Progress value={Math.round(result.score)} />
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg mt-3">
                        <p className="text-sm"><strong>EAI Recommendation:</strong> {result.advice}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {suggestedPrompt && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Suggested Improved Prompt</h4>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border-l-4 border-[#0B3C5D] whitespace-pre-wrap">
                      {suggestedPrompt}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        onClick={() => {
                          setPrompt(suggestedPrompt);
                          toast({ title: "Prompt replaced", description: "The editor now uses the adjusted prompt." });
                        }}
                        className="gap-2"
                      >
                        Use Adjusted Prompt
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { navigator.clipboard.writeText(suggestedPrompt!); toast({ title: "Copied", description: "Suggested prompt copied to clipboard." }); }}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Suggested Prompt
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PromptChecker;
