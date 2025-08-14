
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Copy, FileDown, AlertTriangle, XCircle, Lightbulb, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface Issue {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  explanation: string;
  advice_chips: string[];
}

interface SagaResult {
  summary: {
    total_issues: number;
    high: number;
    medium: number;
    low: number;
    overall_score: number;
  };
  issues: Issue[];
  normalized_prompt?: string;
}

const SagaSecret = () => {
  const [prompt, setPrompt] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<SagaResult | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "checker">("generator");

  // Mock advice library (in real implementation, this would come from the backend)
  const adviceLibrary = {
    "Structure": [
      "Add a 'Facts (Extract)' section with exact fields and pinpoint citations.",
      "Add an 'Analysis (Interpretation)' section with risks, options, and trade-offs.",
      "Define data types for extracted fields (e.g., ISO date, boolean)."
    ],
    "Evidence": [
      "Require a Sources list and pinpoint citations for each claim.",
      "Ask for an Action Log of steps and tools used."
    ],
    "Decision points": [
      "Insert Human Approval checkpoints and pause before sending advice.",
      "Add an override note: the lawyer makes the final call."
    ],
    "Tone": [
      "Remove certainty language; offer 1–2 alternatives with trade-offs.",
      "Use neutral, plain English; avoid urgency language."
    ],
    "Privacy": [
      "Avoid PII; if needed, request redacted excerpts only.",
      "State EU storage/processing and no training on client data."
    ],
    "Output format": [
      "Specify the output format (bullets, table, or tracked changes).",
      "Include a short opening plan and a clear section order."
    ],
    "Timing": [
      "Add a review window before finalizing.",
      "If timing is critical, explain why and offer an opt-out."
    ],
    "Scope & criteria": [
      "Name the jurisdiction and legal criteria (law/article/case/guideline).",
      "Define key terms upfront to avoid ambiguity."
    ]
  };

  // Mock detector rules
  const detectIssues = (promptText: string): Issue[] => {
    const issues: Issue[] = [];
    const lowerText = promptText.toLowerCase();

    // Structure check
    if (!lowerText.includes("extract") && !lowerText.includes("facts") && !lowerText.includes("analysis")) {
      issues.push({
        id: "missing-structure",
        label: "Structure",
        severity: "medium",
        explanation: "Your prompt lacks clear structural sections for facts extraction and analysis.",
        advice_chips: adviceLibrary["Structure"]
      });
    }

    // Evidence check
    if (!lowerText.includes("source") && !lowerText.includes("citation") && !lowerText.includes("cite")) {
      issues.push({
        id: "missing-proof",
        label: "Evidence",
        severity: "high",
        explanation: "No evidence requirements or source citations specified.",
        advice_chips: adviceLibrary["Evidence"]
      });
    }

    // Decision points check
    if (!lowerText.includes("approve") && !lowerText.includes("review") && !lowerText.includes("pause")) {
      issues.push({
        id: "missing-approval",
        label: "Decision points",
        severity: "high",
        explanation: "Missing human approval checkpoints and decision controls.",
        advice_chips: adviceLibrary["Decision points"]
      });
    }

    // Tone check
    const certaintyWords = /\b(always|never|guarantee|certain|100%|must)\b/;
    if (certaintyWords.test(lowerText)) {
      issues.push({
        id: "tone-certainty",
        label: "Tone",
        severity: "medium",
        explanation: "Uses overly certain language without offering alternatives.",
        advice_chips: adviceLibrary["Tone"]
      });
    }

    // Privacy check
    const privacyRisk = /\b(full dataset|raw data|national id|passport|ssn|bsn)\b/;
    if (privacyRisk.test(lowerText) || (!lowerText.includes("redact") && !lowerText.includes("anonymize"))) {
      issues.push({
        id: "privacy-risk",
        label: "Privacy",
        severity: "high",
        explanation: "Potential privacy risks or missing data protection measures.",
        advice_chips: adviceLibrary["Privacy"]
      });
    }

    // Output format check
    if (!lowerText.includes("format") && !lowerText.includes("bullet") && !lowerText.includes("table")) {
      issues.push({
        id: "format-unclear",
        label: "Output format",
        severity: "low",
        explanation: "Output format not clearly specified.",
        advice_chips: adviceLibrary["Output format"]
      });
    }

    // Scope check
    if (!lowerText.includes("jurisdiction") && !lowerText.includes("law") && !lowerText.includes("article")) {
      issues.push({
        id: "missing-scope",
        label: "Scope & criteria",
        severity: "high",
        explanation: "Missing legal scope, jurisdiction, or criteria specification.",
        advice_chips: adviceLibrary["Scope & criteria"]
      });
    }

    return issues;
  };

  const runSagaCheck = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to check.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    try {
      // Mock analysis - in real implementation, this would call the backend
      const issues = detectIssues(prompt);
      const totalIssues = issues.length;
      const highIssues = issues.filter(i => i.severity === "high").length;
      const mediumIssues = issues.filter(i => i.severity === "medium").length;
      const lowIssues = issues.filter(i => i.severity === "low").length;
      
      // Calculate score (100 - penalties)
      const score = Math.max(0, 100 - (highIssues * 20) - (mediumIssues * 10) - (lowIssues * 5));

      const result: SagaResult = {
        summary: {
          total_issues: totalIssues,
          high: highIssues,
          medium: mediumIssues,
          low: lowIssues,
          overall_score: score
        },
        issues
      };

      setResults(result);
      toast({
        title: "Saga Analysis Complete",
        description: `${totalIssues} issues found. Score: ${score}/100`
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      // Mock prompt generation - in real implementation, this would call the backend
      const mockPrompt = `Legal Analysis Assistant

Facts (Extract)
- Extract key dates, parties, and legal issues from the provided documents
- Use ISO date format (YYYY-MM-DD) and boolean values where applicable
- Provide pinpoint citations for each extracted fact

Analysis (Interpretation)  
- Compare findings against Dutch contract law (BW Book 6)
- Identify risks, available options, and trade-offs for each issue
- Include uncertainty notes where applicable

Decision points — Human approval required
- Pause for lawyer review before finalizing advice
- Mark items requiring partner approval with [PARTNER REVIEW]
- Final legal opinion requires human confirmation

Sources & Action Log
- List all sources with pinpoint citations (article, paragraph, page)
- Document each analysis step and tool used
- Include relevant case law references

Outputs
- Use clear headings and bullet lists
- Format as tracked changes document for client review
- Include executive summary (max 200 words)

Tone & Privacy
- Use neutral, professional language avoiding certainty claims
- Offer 2-3 alternative approaches with trade-offs
- Request redacted excerpts only; no PII processing
- Note: EU data processing, no model training on client data

Reflection
- Provide 3 key insights and 3 open questions
- Identify areas requiring additional research

Human Review Hand-off
- List items requiring human confirmation
- Pause before sending to client`;

      setGeneratedPrompt(mockPrompt);
      toast({
        title: "Prompt Generated",
        description: "Legal-compliant prompt template created"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyNormalization = () => {
    if (!results) return;

    // Mock normalization - combine original prompt with fixes
    let normalizedPrompt = prompt + "\n\n--- Saga Compliance Additions ---\n\n";
    
    results.issues.forEach(issue => {
      normalizedPrompt += `${issue.label}:\n`;
      issue.advice_chips.forEach(chip => {
        normalizedPrompt += `- ${chip}\n`;
      });
      normalizedPrompt += "\n";
    });

    setPrompt(normalizedPrompt);
    toast({
      title: "Prompt Enhanced",
      description: "All Saga compliance suggestions applied"
    });
  };

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getSeverityIcon = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high": return <XCircle className="w-4 h-4 text-red-500" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "low": return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafafa", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header - Saga style */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#0066cc" }}>
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: "#1a1a1a" }}>Saga Legal AI</h1>
                <p className="text-sm text-gray-600">Prompt Engineering for Legal Practice</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-lg p-1 border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "generator" 
                ? "bg-blue-500 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Prompt Generator
          </button>
          <button
            onClick={() => setActiveTab("checker")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "checker" 
                ? "bg-blue-500 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Compliance Checker
          </button>
        </div>

        {activeTab === "generator" ? (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle style={{ color: "#1a1a1a" }}>Legal Prompt Generator</CardTitle>
              <CardDescription className="text-gray-600">
                Generate compliant legal AI prompts following Saga standards
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                <Button 
                  onClick={generatePrompt} 
                  disabled={isGenerating}
                  className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Legal Prompt
                    </>
                  )}
                </Button>

                {generatedPrompt && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: "#1a1a1a" }}>Generated Prompt</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPrompt);
                            toast({ title: "Copied", description: "Prompt copied to clipboard" });
                          }}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => {
                            setPrompt(generatedPrompt);
                            setActiveTab("checker");
                            toast({ title: "Loaded", description: "Prompt loaded in checker" });
                          }}
                          className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Check Compliance
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {generatedPrompt}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Input Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-white">
                <CardTitle style={{ color: "#1a1a1a" }}>Compliance Checker</CardTitle>
                <CardDescription className="text-gray-600">
                  Analyze prompts for legal compliance and best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <Textarea 
                  placeholder="Paste your legal AI prompt here for compliance analysis..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  maxLength={5000}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                  <p className="text-sm text-gray-600">{prompt.length}/5000 characters</p>
                  <Button 
                    onClick={runSagaCheck} 
                    disabled={isChecking || !prompt.trim()} 
                    className="gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                  >
                    {isChecking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Check Compliance
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-white">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle style={{ color: "#1a1a1a" }}>Compliance Analysis</CardTitle>
                      <CardDescription className="text-gray-600">
                        Legal practice standards assessment
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        onClick={applyNormalization}
                        className="gap-2 w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Apply All Fixes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const summary = `Saga Legal Compliance Report\n\nScore: ${results.summary.overall_score}/100\nIssues: ${results.summary.total_issues} total (${results.summary.high} high, ${results.summary.medium} medium, ${results.summary.low} low)\n\n${results.issues.map(i => `${i.label}: ${i.explanation}`).join('\n')}`;
                          navigator.clipboard.writeText(summary);
                          toast({ title: "Copied", description: "Analysis copied to clipboard" });
                        }}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.summary.overall_score}
                      </div>
                      <div className="text-sm text-blue-700">Score</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="text-2xl font-bold text-red-600">
                        {results.summary.high}
                      </div>
                      <div className="text-sm text-red-700">High Risk</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="text-2xl font-bold text-amber-600">
                        {results.summary.medium}
                      </div>
                      <div className="text-sm text-amber-700">Medium Risk</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.summary.low}
                      </div>
                      <div className="text-sm text-blue-700">Low Risk</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-2xl font-bold text-gray-600">
                        {results.summary.total_issues}
                      </div>
                      <div className="text-sm text-gray-700">Total Issues</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: "#1a1a1a" }}>Compliance Score</span>
                      <span className="text-sm font-medium text-blue-600">{results.summary.overall_score}/100</span>
                    </div>
                    <Progress value={results.summary.overall_score} className="h-2" />
                  </div>

                  {/* Issues */}
                  <div className="space-y-4">
                    {results.issues.map((issue, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getSeverityIcon(issue.severity)}
                            <div>
                              <h4 className="font-semibold" style={{ color: "#1a1a1a" }}>{issue.label}</h4>
                              <p className="text-sm text-gray-600">{issue.explanation}</p>
                            </div>
                          </div>
                          <Badge className={`${getSeverityColor(issue.severity)} border`}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2" style={{ color: "#1a1a1a" }}>Recommendations:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {issue.advice_chips.map((chip, chipIndex) => (
                              <li key={chipIndex} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>{chip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}

                    {results.issues.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-green-800 mb-1">Excellent Compliance!</h3>
                        <p className="text-green-600">Your prompt meets all Saga legal standards.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SagaSecret;
