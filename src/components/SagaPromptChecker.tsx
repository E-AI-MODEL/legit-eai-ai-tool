
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, Plus, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CheckResult {
  category: string;
  status: "pass" | "warning" | "fail";
  message: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  autoFix?: string;
}

interface SagaPromptCheckerProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const SagaPromptChecker = ({ prompt, onPromptChange }: SagaPromptCheckerProps) => {
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [normalizedPrompt, setNormalizedPrompt] = useState("");
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});

  // Enhanced quality gates that improve the prompt
  const performQualityGateCheck = (text: string): { results: CheckResult[], normalized: string } => {
    const results: CheckResult[] = [];
    let normalized = text;

    // Gate 1: Professional Structure
    if (!/(Facts|Feiten).*(Extract|Extractie)/i.test(text) || !/(Analysis|Analyse).*(Interpretation|Interpretatie)/i.test(text)) {
      results.push({
        category: "Professional Structure",
        status: "fail",
        message: "Missing systematic fact extraction and analysis sections",
        suggestion: "Add structured 'Facts (Extract)' and 'Analysis (Interpretation)' sections for professional legal work",
        priority: "high",
        autoFix: "\n\n**Facts (Extract)**\n- [List key facts with pinpoint citations]\n- Quote relevant clauses and provide source references\n\n**Analysis (Interpretation)**\n- Plain-English impact assessment\n- Risk levels and alternatives\n- Trade-off analysis where relevant"
      });
    }

    // Gate 2: Decision Authority & Control
    if (!/Decision points.*Human approval|Beslispunten.*menselijke/i.test(text)) {
      results.push({
        category: "Decision Authority",
        status: "fail", 
        message: "No human oversight checkpoints defined",
        suggestion: "Add specific decision points where human approval is required before proceeding",
        priority: "high",
        autoFix: "\n\n**Decision Points — Human Approval Required**\n- Pause for approval on [specify critical decisions]\n- Flag high-risk items for partner review\n- Confirm business judgment calls with client"
      });
    }

    // Gate 3: Evidence & Traceability
    if (!/Sources.*Action Log|Bronnen.*Actie Log/i.test(text)) {
      results.push({
        category: "Evidence & Traceability",
        status: "fail",
        message: "Missing source documentation and audit trail",
        suggestion: "Include sources list and action log for professional accountability",
        priority: "high",
        autoFix: "\n\n**Sources & Action Log**\n- List all sources with pinpoint citations\n- Document analysis steps and tools used\n- Note assumptions and limitations"
      });
    }

    // Gate 4: Professional Communication Standards
    const hasUnprofessionalLanguage = /zeker|gegarandeerd|altijd|nooit|definitief|must|will definitely/i.test(text);
    if (hasUnprofessionalLanguage || !/neutral.*plain.*English|neutraal.*heldere/i.test(text)) {
      results.push({
        category: "Professional Communication",
        status: "warning",
        message: hasUnprofessionalLanguage ? "Overconfident language detected" : "Communication standards not specified",
        suggestion: "Use professional, neutral language with appropriate qualifiers",
        priority: "medium",
        autoFix: "\n\n**Communication & Privacy Standards**\n- Use neutral, professional language\n- Apply appropriate qualifiers: 'appears,' 'suggests,' 'likely'\n- Avoid PII; request redacted excerpts only\n- Maintain attorney-client privilege"
      });
    }

    // Gate 5: Output Specifications
    if (!/output|format|bullets|headings|table|memo|email/i.test(text)) {
      results.push({
        category: "Output Specifications",
        status: "warning",
        message: "Output format and deliverables not clearly defined",
        suggestion: "Specify exact format, structure, and delivery requirements",
        priority: "medium",
        autoFix: "\n\n**Output Requirements**\n- Format: [bullets/headings/table/memo format]\n- Style: Professional, client-ready\n- Length: Concise, focused analysis\n- Delivery: [email/formal memo/presentation format]"
      });
    }

    // Gate 6: Quality Control & Reflection
    if (!/reflection|insights|review.*hand-off|kwaliteitscontrole/i.test(text)) {
      results.push({
        category: "Quality Control",
        status: "warning",
        message: "No quality control or reflection process",
        suggestion: "Add reflection steps and hand-off procedures for professional delivery",
        priority: "medium",
        autoFix: "\n\n**Quality Control & Reflection**\n- Provide 3 key insights from analysis\n- List 3 critical questions requiring clarification\n- Define hand-off requirements and approvals needed\n\n**Human Review Hand-off**\n- Items requiring partner sign-off\n- Client confirmation points\n- Final delivery approvals"
      });
    }

    // Create normalized prompt by applying all fixes
    if (results.length > 0) {
      let improvedPrompt = text;
      
      // Add professional greeting if missing
      if (!improvedPrompt.toLowerCase().includes('hi —') && !improvedPrompt.toLowerCase().startsWith('hi,')) {
        improvedPrompt = `Hi — I need your assistance with the following legal analysis:\n\n${improvedPrompt}`;
      }

      // Apply auto-fixes in logical order
      results.forEach(result => {
        if (result.autoFix) {
          improvedPrompt += result.autoFix;
        }
      });

      normalized = improvedPrompt;
    }

    return { results: results.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }), normalized };
  };

  const handleCheck = async () => {
    if (!prompt.trim()) return;
    
    setIsChecking(true);
    
    // Always perform local quality gate check first
    const { results: localResults, normalized } = performQualityGateCheck(prompt);
    setCheckResults(localResults);
    setNormalizedPrompt(normalized);
    
    try {
      // Try backend check for additional EAI compliance insights
      const response = await fetch('/functions/v1/eai-semantic-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        const backendResults = data.results?.map((result: any) => ({
          category: result.rubric?.split(' ')[0] || 'EAI Compliance',
          status: result.status,
          message: result.advice,
          suggestion: result.advice,
          priority: result.status === 'fail' ? 'high' : result.status === 'warning' ? 'medium' : 'low'
        })) || [];
        
        // Merge and deduplicate results, prioritizing local quality gates
        const mergedResults = [...localResults];
        backendResults.forEach((backendResult: CheckResult) => {
          if (!localResults.some(local => local.category.toLowerCase().includes(backendResult.category.toLowerCase()))) {
            mergedResults.push(backendResult);
          }
        });
        
        setCheckResults(mergedResults);
      }
    } catch (error) {
      console.error('Backend EAI check failed, using local quality gates only:', error);
    }
    
    setIsChecking(false);
  };

  const applyAutoFix = (fix: string) => {
    const updatedPrompt = prompt + fix;
    onPromptChange(updatedPrompt);
  };

  const applyNormalizedPrompt = () => {
    if (normalizedPrompt) {
      onPromptChange(normalizedPrompt);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400/50 text-red-400';
      case 'medium': return 'border-yellow-400/50 text-yellow-400';
      case 'low': return 'border-green-400/50 text-green-400';
      default: return 'border-blue-400/50 text-blue-400';
    }
  };

  const getAdviceText = (result: CheckResult) => {
    // More specific, actionable advice based on category
    switch (result.category) {
      case "Professional Structure":
        return "Add systematic fact extraction and legal analysis sections. This ensures thorough, defensible legal work.";
      case "Decision Authority":
        return "Define specific approval checkpoints. This maintains proper oversight and reduces liability risk.";
      case "Evidence & Traceability":
        return "Include source citations and audit trail. This supports professional standards and risk management.";
      case "Professional Communication":
        return "Use measured, professional language. Avoid certainty claims that could create liability exposure.";
      case "Output Specifications":
        return "Clearly define deliverable format and requirements. This ensures client expectations are met.";
      case "Quality Control":
        return "Add reflection and review steps. This improves work quality and demonstrates professional diligence.";
      default:
        return result.suggestion;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Prompt Input */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            Professional Prompt Checker
          </CardTitle>
          <CardDescription className="text-slate-300">
            Transform basic prompts into professional legal work instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your draft prompt here for professional enhancement..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-sm min-h-[300px]"
            rows={15}
          />
          
          <Button 
            onClick={handleCheck}
            disabled={isChecking || !prompt.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Professional Standards...
              </>
            ) : (
              'Analyze & Enhance Prompt'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Results */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Professional Enhancement Results</CardTitle>
          <CardDescription className="text-slate-300">
            Quality improvements and professional standards compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkResults.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {checkResults.map((result, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <span className="text-white font-medium text-sm">{result.category}</span>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs ${getPriorityColor(result.priority)}`}
                          >
                            {result.priority} priority
                          </Badge>
                        </div>
                      </div>
                      {result.autoFix && (
                        <Button
                          onClick={() => copyToClipboard(result.autoFix!, index)}
                          size="sm"
                          variant="ghost"
                          className="text-xs h-6 px-2"
                        >
                          {copiedStates[index] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2 font-medium">{result.message}</p>
                    <p className="text-sm text-slate-400 mb-3">{getAdviceText(result)}</p>
                    
                    {result.autoFix && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => applyAutoFix(result.autoFix!)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Prompt
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {normalizedPrompt && normalizedPrompt !== prompt && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="text-sm text-slate-300">
                    <strong>Enhanced Professional Prompt Ready</strong>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyNormalizedPrompt}
                      className="flex-1"
                      variant="default"
                    >
                      Use Enhanced Prompt
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(normalizedPrompt, 999)}
                      variant="outline"
                      size="sm"
                    >
                      {copiedStates[999] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Upload a prompt to see professional enhancement suggestions</p>
              <p className="text-slate-500 text-sm mt-2">
                We'll analyze structure, decision points, evidence requirements, and communication standards
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
