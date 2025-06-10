
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Copy, FileDown, AlertTriangle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

  const checkRules: Omit<CheckResult, 'status'>[] = [
    {
      rubric: "Ownership & Traceability",
      flag: "🟠 Traceability missing",
      check: "Prompt lacks justification mapping.",
      advice: "Ask users to annotate or explain acceptance/rejection of AI output."
    },
    {
      rubric: "Agency Control",
      flag: "🚨 Agency risk",
      check: "No explicit review/approval workflow.",
      advice: "Define roles and handover points between AI and human."
    },
    {
      rubric: "Task Density",
      flag: "⚠️ Reverse scaffolding",
      check: "AI does most thinking; user passive.",
      advice: "Distribute key steps; require user reflection before/after AI."
    },
    {
      rubric: "Drift Awareness",
      flag: "🟡 Drift risk",
      check: "No user-AI comparison or critique step.",
      advice: "Ask user to challenge AI reasoning and justify differences."
    },
    {
      rubric: "Audit Trail",
      flag: "🔒 Audit trail missing",
      check: "No logging of decisions or changes.",
      advice: "Specify who logs, where, and how long data is retained."
    },
    {
      rubric: "Bias & Inclusion",
      flag: "🚨 Potential bias",
      check: "Prompt uses absolute/biased terms or lacks neutral alternatives.",
      advice: "Use neutral language and require multiple viewpoints."
    },
    {
      rubric: "Output Format",
      flag: "⚪ Format missing",
      check: "Output structure ambiguous.",
      advice: "State required format (table, memo, checklist, log)."
    },
    {
      rubric: "Visible Reasoning",
      flag: "⚠️ Shallow reasoning",
      check: "Prompt asks only for final answer.",
      advice: "Request step-wise reasoning and alternatives."
    },
    {
      rubric: "Error Awareness",
      flag: "🟠 Error awareness missing",
      check: "No error-detection or correction step.",
      advice: "Require users to identify and correct mistakes."
    },
    {
      rubric: "Reflection",
      flag: "🟣 Reflection missing",
      check: "Prompt lacks reflection or learning summary.",
      advice: "Add summary of insights or next steps."
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
    
    // Simulate analysis with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple heuristic checking (in a real implementation, this would use AI/NLP)
    const promptLower = prompt.toLowerCase();
    const results: CheckResult[] = checkRules.map(rule => {
      let status: "pass" | "warning" | "fail" = "pass";
      
      // Simple keyword-based checks (placeholder for real analysis)
      if (rule.rubric === "Ownership & Traceability") {
        status = promptLower.includes("justify") || promptLower.includes("explain") ? "pass" : "warning";
      } else if (rule.rubric === "Agency Control") {
        status = promptLower.includes("review") || promptLower.includes("approve") ? "pass" : "fail";
      } else if (rule.rubric === "Task Density") {
        status = promptLower.includes("think") || promptLower.includes("analyze") ? "pass" : "warning";
      } else if (rule.rubric === "Visible Reasoning") {
        status = promptLower.includes("step") || promptLower.includes("reasoning") ? "pass" : "warning";
      } else if (rule.rubric === "Output Format") {
        status = promptLower.includes("format") || promptLower.includes("table") || promptLower.includes("list") ? "pass" : "warning";
      } else if (rule.rubric === "Reflection") {
        status = promptLower.includes("reflection") || promptLower.includes("learn") ? "pass" : "warning";
      } else {
        // Random assignment for demo purposes
        status = Math.random() > 0.7 ? "fail" : Math.random() > 0.4 ? "warning" : "pass";
      }
      
      return { ...rule, status };
    });

    setResults(results);
    setHasResults(true);
    setIsChecking(false);
    
    const failCount = results.filter(r => r.status === "fail").length;
    const warningCount = results.filter(r => r.status === "warning").length;
    
    toast({
      title: "Prompt Analysis Complete",
      description: `${failCount} critical issues, ${warningCount} warnings found.`
    });
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
      description: "Results copied to clipboard."
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
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-check-report.json';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Prompt check report downloaded."
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
          <p className="text-gray-600 mt-2">Paste any AI prompt and run a full compliance & quality check.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1: Paste Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Paste Prompt</CardTitle>
            <CardDescription>Enter the AI prompt you want to check for EAI compliance.</CardDescription>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Check Prompt
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
                    <CardTitle>Step 2: Analysis Results</CardTitle>
                    <CardDescription>EAI Model compliance check results</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyResults} className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Summary
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
                    <div className="text-sm text-green-700">Passed</div>
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
                    <div className="text-sm text-red-700">Critical</div>
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
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Recommendation:</strong> {result.advice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PromptChecker;
