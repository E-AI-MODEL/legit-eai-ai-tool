
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Copy, FileDown, AlertTriangle, XCircle, Lightbulb, Wand2, Settings, BookOpen, TrendingUp, Users, Download, Star, Bookmark, Search, Filter, BarChart3, PieChart, Clock, Shield, Scale, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Issue {
  id: string;
  label: string;
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
  advice_chips: string[];
  impact_score: number;
}

interface SagaResult {
  summary: {
    total_issues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    overall_score: number;
    compliance_trend: "improving" | "stable" | "declining";
  };
  issues: Issue[];
  normalized_prompt?: string;
  analysis_time: number;
}

const SagaSecret = () => {
  const [prompt, setPrompt] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<SagaResult | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "checker" | "analytics" | "library">("generator");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("contract-analysis");

  // Premium template library
  const promptTemplates = {
    "contract-analysis": {
      name: "Contract Analysis",
      category: "Commercial Law",
      description: "Comprehensive contract review and risk assessment",
      template: `Legal Contract Analysis Framework

EXTRACTION PHASE
- Extract key terms: parties, dates (ISO format), obligations, consideration
- Identify governing law and jurisdiction clauses
- Note termination and renewal provisions
- Flag unusual or non-standard clauses

RISK ASSESSMENT
- Analyze liability limitations and indemnification clauses
- Evaluate force majeure and dispute resolution mechanisms
- Assess compliance with [JURISDICTION] contract law standards
- Identify potential enforceability issues

HUMAN OVERSIGHT CHECKPOINTS
- Pause for lawyer review before risk classification
- Require partner approval for high-risk recommendations
- Document all assumptions and legal basis

SOURCES & CITATIONS
- Reference specific contract sections (Article X, Section Y)
- Cite relevant case law and statutory provisions
- Maintain audit trail of analysis steps

OUTPUT SPECIFICATIONS
- Risk matrix with impact/probability scoring
- Executive summary (max 300 words)
- Tracked changes document for client review
- Action items with priority levels

PRIVACY & COMPLIANCE
- Process redacted documents only
- EU GDPR compliant data handling
- No training on confidential client data
- 30-day data retention policy`
    },
    "compliance-check": {
      name: "Regulatory Compliance",
      category: "Regulatory Law",
      description: "Multi-jurisdiction compliance verification",
      template: `Regulatory Compliance Assessment Protocol

SCOPE DEFINITION
- Target regulations: [SPECIFY: GDPR, SOX, HIPAA, etc.]
- Applicable jurisdictions and effective dates
- Industry-specific requirements and standards
- Materiality thresholds for violations

COMPLIANCE MAPPING
- Map business processes to regulatory requirements
- Identify control gaps and remediation needs
- Assess current vs. required compliance levels
- Document evidence of compliance efforts

RISK PRIORITIZATION
- Critical: Immediate regulatory action risk
- High: Significant penalty exposure
- Medium: Process improvement needed
- Low: Best practice recommendations

DECISION GATES
- Legal counsel review required for critical findings
- C-suite approval needed for material changes
- Board notification for systemic issues

DELIVERABLES
- Compliance gap analysis matrix
- Remediation roadmap with timelines
- Cost-benefit analysis of options
- Regular monitoring recommendations

CONFIDENTIALITY
- Attorney-client privilege protection
- Secure document handling protocols
- Limited access on need-to-know basis`
    },
    "legal-research": {
      name: "Legal Research",
      category: "Research & Analysis",
      description: "Comprehensive legal research and case analysis",
      template: `Legal Research Methodology Framework

RESEARCH SCOPE
- Define legal questions and research parameters
- Identify primary and secondary sources needed
- Establish jurisdiction and time-frame boundaries
- Note client-specific considerations

ANALYSIS STRUCTURE
- Primary authority: statutes, regulations, case law
- Secondary sources: treatises, law reviews, practice guides
- Comparative analysis across jurisdictions
- Historical development and recent trends

QUALITY CONTROLS
- Shepardize/KeyCite all primary authorities
- Verify currency of secondary sources
- Cross-reference multiple databases
- Note any conflicting authorities

SYNTHESIS & CONCLUSIONS
- Identify majority and minority positions
- Assess strength of legal arguments
- Predict likely judicial outcomes
- Recommend litigation strategies

DOCUMENTATION
- Complete citation format (Bluebook/local rules)
- Research methodology appendix
- Source reliability assessment
- Update schedule for ongoing matters`
    }
  };

  // Enhanced mock detector with more sophisticated analysis
  const detectIssues = (promptText: string): Issue[] => {
    const issues: Issue[] = [];
    const lowerText = promptText.toLowerCase();

    // Critical severity issues
    if (!lowerText.includes("human") && !lowerText.includes("lawyer") && !lowerText.includes("approval")) {
      issues.push({
        id: "no-human-oversight",
        label: "Human Oversight",
        severity: "critical",
        explanation: "No human oversight or approval checkpoints defined. This creates significant liability risks.",
        advice_chips: [
          "Add mandatory lawyer review before finalizing advice",
          "Implement partner approval for high-risk matters",
          "Create escalation procedures for complex issues"
        ],
        impact_score: 95
      });
    }

    if (!lowerText.includes("jurisdiction") && !lowerText.includes("governing law")) {
      issues.push({
        id: "missing-jurisdiction",
        label: "Legal Jurisdiction",
        severity: "critical",
        explanation: "No governing jurisdiction specified. Legal advice without jurisdictional context is professionally dangerous.",
        advice_chips: [
          "Specify applicable jurisdiction (e.g., 'Under Dutch law')",
          "Reference specific legal codes or regulations",
          "Note any cross-border legal considerations"
        ],
        impact_score: 90
      });
    }

    // High severity issues
    if (!lowerText.includes("source") && !lowerText.includes("citation")) {
      issues.push({
        id: "no-citations",
        label: "Source Citations",
        severity: "high",
        explanation: "Missing source citations and legal references compromise advice credibility.",
        advice_chips: [
          "Require pinpoint citations for all legal claims",
          "Reference specific statutes, cases, or regulations",
          "Maintain bibliography of sources consulted"
        ],
        impact_score: 80
      });
    }

    if (lowerText.includes("guarantee") || lowerText.includes("certain") || lowerText.includes("always")) {
      issues.push({
        id: "certainty-language",
        label: "Certainty Language",
        severity: "high",
        explanation: "Overly certain language creates professional liability exposure.",
        advice_chips: [
          "Use qualified language: 'likely', 'generally', 'typically'",
          "Present alternative interpretations and outcomes",
          "Include standard legal disclaimers"
        ],
        impact_score: 75
      });
    }

    // Medium severity issues
    if (!lowerText.includes("confidential") && !lowerText.includes("privilege")) {
      issues.push({
        id: "privilege-protection",
        label: "Attorney-Client Privilege",
        severity: "medium",
        explanation: "No privilege protection measures specified for confidential information.",
        advice_chips: [
          "Mark all communications as privileged and confidential",
          "Implement secure document handling procedures",
          "Limit access on need-to-know basis"
        ],
        impact_score: 60
      });
    }

    return issues;
  };

  const runSagaCheck = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    try {
      // Enhanced mock analysis
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate analysis time
      
      const issues = detectIssues(prompt);
      const analysisTime = Date.now() - startTime;
      
      const criticalIssues = issues.filter(i => i.severity === "critical").length;
      const highIssues = issues.filter(i => i.severity === "high").length;
      const mediumIssues = issues.filter(i => i.severity === "medium").length;
      const lowIssues = issues.filter(i => i.severity === "low").length;
      
      // Enhanced scoring algorithm
      const score = Math.max(0, 100 - (criticalIssues * 30) - (highIssues * 20) - (mediumIssues * 10) - (lowIssues * 5));

      const result: SagaResult = {
        summary: {
          total_issues: issues.length,
          critical: criticalIssues,
          high: highIssues,
          medium: mediumIssues,
          low: lowIssues,
          overall_score: score,
          compliance_trend: score > 80 ? "improving" : score > 60 ? "stable" : "declining"
        },
        issues,
        analysis_time: analysisTime
      };

      setResults(result);
      toast({
        title: "Analysis Complete",
        description: `${issues.length} issues identified. Professional Risk Score: ${score}/100`,
        duration: 5000
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const template = promptTemplates[selectedTemplate as keyof typeof promptTemplates];
      setGeneratedPrompt(template.template);
      toast({
        title: "Template Generated",
        description: `${template.name} template ready for customization`,
        duration: 4000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColor = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-50 text-red-900 border-red-200";
      case "high": return "bg-orange-50 text-orange-900 border-orange-200";
      case "medium": return "bg-amber-50 text-amber-900 border-amber-200";
      case "low": return "bg-blue-50 text-blue-900 border-blue-200";
    }
  };

  const getSeverityIcon = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical": return <XCircle className="w-5 h-5 text-red-600" />;
      case "high": return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "medium": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "low": return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-600 hover:text-slate-900 transition-all duration-200 hover:scale-105">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Saga Legal AI</h1>
                  <p className="text-sm text-slate-600 font-medium">Professional Legal Intelligence Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">Professional</Badge>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Premium Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="grid w-fit grid-cols-4 bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
              <TabsTrigger value="generator" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-6">
                <Wand2 className="w-4 h-4 mr-2" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="checker" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-6">
                <Shield className="w-4 h-4 mr-2" />
                Checker
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="library" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Library
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="generator" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900 mb-2">Professional Prompt Generator</CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                      Generate compliant legal AI prompts with industry-leading templates and best practices
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Template Category</label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="w-full border-slate-300 focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(promptTemplates).map(([key, template]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-3">
                                <Scale className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="font-medium">{template.name}</div>
                                  <div className="text-xs text-slate-500">{template.category}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">
                            {promptTemplates[selectedTemplate as keyof typeof promptTemplates].name}
                          </h4>
                          <p className="text-sm text-slate-600 mb-3">
                            {promptTemplates[selectedTemplate as keyof typeof promptTemplates].description}
                          </p>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {promptTemplates[selectedTemplate as keyof typeof promptTemplates].category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={generatePrompt} 
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg h-12 text-base font-semibold"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Generating Professional Template...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-3" />
                          Generate Professional Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {generatedPrompt && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-900">Generated Template</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPrompt);
                                toast({ title: "Copied", description: "Template copied to clipboard" });
                              }}
                              className="border-slate-300 hover:bg-slate-50"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-300 hover:bg-slate-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button
                              onClick={() => {
                                setPrompt(generatedPrompt);
                                setActiveTab("checker");
                                toast({ title: "Loaded", description: "Template loaded in compliance checker" });
                              }}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Analyze
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-200 shadow-inner">
                          <pre className="whitespace-pre-wrap text-sm text-slate-100 font-mono leading-relaxed overflow-x-auto">
                            {generatedPrompt}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checker" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200/60">
                <CardTitle className="text-2xl text-slate-900 mb-2">Professional Compliance Analysis</CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Advanced AI-powered analysis for legal prompt compliance and risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">Legal Prompt for Analysis</label>
                    <Textarea 
                      placeholder="Enter your legal AI prompt for comprehensive compliance analysis..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={12}
                      className="w-full border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base leading-relaxed resize-none"
                      maxLength={10000}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-slate-500">{prompt.length}/10,000 characters</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                          <FileDown className="w-4 h-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={runSagaCheck} 
                    disabled={isChecking || !prompt.trim()} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg h-12 text-base font-semibold"
                  >
                    {isChecking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Analyzing Compliance & Risk...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-3" />
                        Run Professional Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Results Display */}
            {results && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-slate-900 mb-2">Professional Risk Assessment</CardTitle>
                      <CardDescription className="text-slate-600 text-base">
                        Comprehensive analysis completed in {results.analysis_time}ms
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${
                          results.summary.compliance_trend === 'improving' ? 'text-emerald-600' :
                          results.summary.compliance_trend === 'stable' ? 'text-amber-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {results.summary.compliance_trend}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Enhanced Summary Dashboard */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                      <div className="text-3xl font-bold text-blue-700 mb-1">
                        {results.summary.overall_score}
                      </div>
                      <div className="text-sm font-medium text-blue-800">Professional Score</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                      <div className="text-3xl font-bold text-red-700 mb-1">
                        {results.summary.critical}
                      </div>
                      <div className="text-sm font-medium text-red-800">Critical Risk</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                      <div className="text-3xl font-bold text-orange-700 mb-1">
                        {results.summary.high}
                      </div>
                      <div className="text-sm font-medium text-orange-800">High Risk</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
                      <div className="text-3xl font-bold text-amber-700 mb-1">
                        {results.summary.medium}
                      </div>
                      <div className="text-sm font-medium text-amber-800">Medium Risk</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
                      <div className="text-3xl font-bold text-emerald-700 mb-1">
                        {results.summary.low}
                      </div>
                      <div className="text-sm font-medium text-emerald-800">Low Risk</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-3xl font-bold text-slate-700 mb-1">
                        {results.summary.total_issues}
                      </div>
                      <div className="text-sm font-medium text-slate-800">Total Issues</div>
                    </div>
                  </div>

                  {/* Professional Progress Indicator */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-slate-900">Professional Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-blue-700">{results.summary.overall_score}/100</span>
                        <Badge className={`${
                          results.summary.overall_score >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          results.summary.overall_score >= 70 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        } border font-medium`}>
                          {results.summary.overall_score >= 90 ? 'Excellent' :
                           results.summary.overall_score >= 70 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={results.summary.overall_score} className="h-3 bg-slate-200" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xs font-medium text-white drop-shadow-sm">
                          Professional Risk Assessment
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Issues Display */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Detailed Risk Analysis</h3>
                      <Button 
                        onClick={() => {
                          // Apply all recommendations
                          let enhancedPrompt = prompt + "\n\n--- SAGA PROFESSIONAL ENHANCEMENTS ---\n\n";
                          results.issues.forEach(issue => {
                            enhancedPrompt += `${issue.label} Improvements:\n`;
                            issue.advice_chips.forEach(chip => {
                              enhancedPrompt += `• ${chip}\n`;
                            });
                            enhancedPrompt += "\n";
                          });
                          setPrompt(enhancedPrompt);
                          toast({
                            title: "Enhancements Applied",
                            description: "All professional recommendations have been integrated into your prompt"
                          });
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Apply All Recommendations
                      </Button>
                    </div>

                    {results.issues.map((issue, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-slate-900">{issue.label}</h4>
                                <Badge className={`${getSeverityColor(issue.severity)} border font-medium`}>
                                  {issue.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3 leading-relaxed">{issue.explanation}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm font-medium text-slate-700">
                                    Impact Score: {issue.impact_score}/100
                                  </span>
                                </div>
                                <Progress value={issue.impact_score} className="w-24 h-2" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <p className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Professional Recommendations:
                          </p>
                          <ul className="space-y-2">
                            {issue.advice_chips.map((chip, chipIndex) => (
                              <li key={chipIndex} className="flex items-start gap-3 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{chip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}

                    {results.issues.length === 0 && (
                      <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-emerald-900 mb-2">Outstanding Professional Compliance!</h3>
                        <p className="text-emerald-700 text-base">Your prompt meets all Saga professional standards and best practices.</p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <Star className="w-5 h-5 text-emerald-600" />
                          <Star className="w-5 h-5 text-emerald-600" />
                          <Star className="w-5 h-5 text-emerald-600" />
                          <Star className="w-5 h-5 text-emerald-600" />
                          <Star className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-600" />
                    Compliance Trends
                  </CardTitle>
                  <CardDescription>Monthly compliance score trends and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                      <p>Analytics dashboard coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest prompt analyses and compliance checks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-slate-900">Contract Analysis Template</p>
                        <p className="text-sm text-slate-600">Score: 94/100 • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-slate-900">Compliance Check Draft</p>
                        <p className="text-sm text-slate-600">Score: 78/100 • 1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-slate-900">Legal Research Query</p>
                        <p className="text-sm text-slate-600">Score: 45/100 • 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(promptTemplates).map(([key, template]) => (
                <Card key={key} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 mb-2">
                          {template.category}
                        </Badge>
                        <CardDescription className="leading-relaxed">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-amber-500">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          setSelectedTemplate(key);
                          setActiveTab("generator");
                        }}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SagaSecret;
