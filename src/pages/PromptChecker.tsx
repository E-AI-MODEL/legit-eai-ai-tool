
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Copy, FileDown, AlertTriangle, XCircle, Clock, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CheckResult {
  rubric: string;
  flag: string;
  check: string;
  advice: string;
  status: "pass" | "warning" | "fail";
}

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null);

  const checkRules: Omit<CheckResult, 'status'>[] = [
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

    // Try AI semantic check via Supabase Edge Function first
    try {
      const { data, error } = await supabase.functions.invoke("eai-semantic-check", {
        body: { prompt },
      });

      if (error) throw error;

      if (data && Array.isArray(data.results) && data.results.length > 0) {
        setResults(data.results as CheckResult[]);
        setHasResults(true);
        const failCount = data.results.filter((r: CheckResult) => r.status === "fail").length;
        const warningCount = data.results.filter((r: CheckResult) => r.status === "warning").length;
        const passCount = data.results.filter((r: CheckResult) => r.status === "pass").length;
        toast({
          title: "EAI Compliance Analysis Complete (AI)",
          description: `${passCount} passed, ${warningCount} warnings, ${failCount} critical issues found.`
        });
        return;
      }
    } catch (e) {
      console.warn("AI check failed, falling back to heuristic:", e);
    } finally {
      setIsChecking(false);
    }

    // Fallback: heuristic keyword-based check
    setIsChecking(true);
    try {
      const promptLower = prompt.toLowerCase();
      const results: CheckResult[] = checkRules.map(rule => {
        let status: "pass" | "warning" | "fail" = "fail";

        if (rule.rubric === "Cognitive Ownership & Traceability") {
          const tracabilityKeywords = ["justify", "explain", "reasoning", "trace", "annotate", "reconstruct"];
          status = tracabilityKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        } else if (rule.rubric === "Agency & Didactic Controllability") {
          const agencyKeywords = ["review", "approve", "decide", "human", "final decision", "handover"];
          status = agencyKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "fail";
        } else if (rule.rubric === "Reverse Scaffolding/Task Density") {
          const scaffoldingWords = ["plan", "draft", "reflect", "before", "after", "user"];
          const aiDominanceWords = ["ai will", "ai should", "ai must", "generate", "create"];
          const hasScaffolding = scaffoldingWords.some(keyword => promptLower.includes(keyword));
          const hasAiDominance = aiDominanceWords.some(keyword => promptLower.includes(keyword));
          status = hasScaffolding && !hasAiDominance ? "pass" : hasScaffolding ? "warning" : "fail";
        } else if (rule.rubric === "Sycophancy & Drift Awareness") {
          const driftKeywords = ["compare", "critique", "challenge", "disagree", "question"];
          status = driftKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        } else if (rule.rubric === "Compliance, Audit & Logging") {
          const auditKeywords = ["log", "record", "audit", "track", "document"];
          status = auditKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "fail";
        } else if (rule.rubric === "Bias, Inclusion & Professional Neutrality") {
          const biasedTerms = ["always", "never", "obviously", "clearly", "definitely"];
          const neutralTerms = ["consider", "alternative", "perspective", "viewpoint"];
          const hasBiasedTerms = biasedTerms.some(term => promptLower.includes(term));
          const hasNeutralTerms = neutralTerms.some(term => promptLower.includes(term));
          status = !hasBiasedTerms && hasNeutralTerms ? "pass" : !hasBiasedTerms ? "warning" : "fail";
        } else if (rule.rubric === "Output Specification & Structure") {
          const formatKeywords = ["format", "table", "list", "structure", "memo", "checklist"];
          status = formatKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        } else if (rule.rubric === "Problem Complexity & Visible Reasoning") {
          const reasoningKeywords = ["step", "reasoning", "breakdown", "trace", "explain how"];
          status = reasoningKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        } else if (rule.rubric === "Error & Failure Analysis") {
          const errorKeywords = ["error", "mistake", "correct", "check", "verify"];
          status = errorKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        } else if (rule.rubric === "Legal Learning Mode") {
          const learningKeywords = ["reflection", "learn", "insight", "summary", "question"];
          status = learningKeywords.some(keyword => promptLower.includes(keyword)) ? "pass" : "warning";
        }

        return { ...rule, status };
      });

      setResults(results);
      setHasResults(true);
      const failCount = results.filter(r => r.status === "fail").length;
      const warningCount = results.filter(r => r.status === "warning").length;
      const passCount = results.filter(r => r.status === "pass").length;
      toast({
        title: "EAI Compliance Analysis Complete (Heuristic)",
        description: `${passCount} passed, ${warningCount} warnings, ${failCount} critical issues found.`
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
        const cleaned = String(data.prompt).replace(/```[\s\S]*?```/g, "").trim();
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
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">{prompt.length} characters</p>
              <Button onClick={runPromptCheck} disabled={isChecking || !prompt.trim()} className="gap-2">
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Step 2: EAI Model Analysis Results</CardTitle>
                    <CardDescription>Comprehensive compliance check against all EAI Model criteria</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyResults} className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Summary
                    </Button>
                    <Button variant="outline" onClick={suggestBetterPrompt} disabled={isSuggesting} className="gap-2">
                      <Lightbulb className="w-4 h-4" />
                      {isSuggesting ? "Suggesting..." : "Suggest Better Prompt"}
                    </Button>
                    <Button onClick={downloadReport} className="gap-2">
                      <FileDown className="w-4 h-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
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
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-semibold">{result.rubric}</h4>
                            <p className="text-sm text-gray-600">{result.check}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{result.flag}</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
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
                    <Button
                      variant="outline"
                      onClick={() => { navigator.clipboard.writeText(suggestedPrompt!); toast({ title: "Copied", description: "Suggested prompt copied to clipboard." }); }}
                      className="mt-2 gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Suggested Prompt
                    </Button>
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
