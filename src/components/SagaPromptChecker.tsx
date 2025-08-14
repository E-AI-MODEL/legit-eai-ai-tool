import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import ClipboardNotification from "@/components/ClipboardNotification";

interface CheckResult {
  category: string;
  status: "pass" | "warning" | "fail";
  message: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

interface SagaPromptCheckerProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const SagaPromptChecker = ({ prompt, onPromptChange }: SagaPromptCheckerProps) => {
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const performQualityCheck = (text: string): { results: CheckResult[], enhanced: string } => {
    const results: CheckResult[] = [];
    let enhanced = text;

    // Professional Structure Check
    if (!/(Facts|Analysis|Decision|Review)/i.test(text)) {
      results.push({
        category: "Professional Structure",
        status: "fail",
        message: "Missing systematic analysis framework",
        suggestion: "Add structured sections for facts, analysis, and decision points",
        priority: "high"
      });
    }

    // Decision Authority Check
    if (!/approval|review|checkpoint/i.test(text)) {
      results.push({
        category: "Decision Authority",
        status: "fail", 
        message: "No human oversight defined",
        suggestion: "Include specific points where human approval is required",
        priority: "high"
      });
    }

    // Evidence & Sources Check
    if (!/source|citation|reference/i.test(text)) {
      results.push({
        category: "Evidence & Sources",
        status: "warning",
        message: "Source documentation not specified",
        suggestion: "Add requirements for source citations and references",
        priority: "medium"
      });
    }

    // Communication Standards Check  
    if (!/professional|neutral|client/i.test(text)) {
      results.push({
        category: "Communication",
        status: "warning",
        message: "Professional communication standards not defined",
        suggestion: "Specify tone, language, and client communication requirements",
        priority: "medium"
      });
    }

    // Create enhanced prompt if issues found
    if (results.length > 0) {
      enhanced = `${text}

## Professional Standards Framework

**Structured Analysis Required:**
- Extract key facts with source citations
- Provide systematic legal analysis
- Include risk assessment and alternatives

**Decision Checkpoints:**
- Flag items requiring partner review
- Define client approval points
- Document critical assumptions

**Quality Controls:**
- Use professional, measured language
- Maintain source traceability
- Provide clear next steps and deliverables

**Output Requirements:**
- Client-ready format and tone
- Actionable recommendations
- Risk mitigation strategies`;
    }

    return { 
      results: results.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }), 
      enhanced 
    };
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsChecking(true);
    
    const { results, enhanced } = performQualityCheck(prompt);
    setCheckResults(results);
    setEnhancedPrompt(enhanced);
    
    setIsChecking(false);
  };

  const applyEnhancement = () => {
    if (enhancedPrompt) {
      onPromptChange(enhancedPrompt);
      setEnhancedPrompt("");
      setCheckResults([]);
    }
  };

  const clearPrompt = () => {
    onPromptChange("");
    setCheckResults([]);
    setEnhancedPrompt("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Your Prompt</CardTitle>
          <CardDescription className="text-slate-300">
            Paste your draft prompt for professional enhancement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your legal prompt here..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-sm min-h-[300px] resize-none"
            rows={15}
          />
          
          <div className="flex gap-2">
            {prompt.trim() && (
              <Button 
                variant="outline" 
                onClick={clearPrompt}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button 
              onClick={handleEnhancePrompt}
              disabled={isChecking || !prompt.trim()}
              className="flex-1"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Enhance Prompt'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Enhancement Results</CardTitle>
          <CardDescription className="text-slate-300">
            Professional quality analysis and improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkResults.length > 0 ? (
            <div className="space-y-4">
              {/* Quality Issues */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {checkResults.map((result, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{result.category}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(result.priority)}`}
                          >
                            {result.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 mb-1">{result.message}</p>
                        <p className="text-xs text-slate-400">{result.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced Prompt Actions */}
              {enhancedPrompt && enhancedPrompt !== prompt && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="text-sm text-white font-medium">
                    Enhanced Professional Prompt Ready
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyEnhancement}
                      className="flex-1"
                    >
                      Apply Enhancement
                    </Button>
                    <ClipboardNotification text={enhancedPrompt}>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </ClipboardNotification>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Ready to enhance your prompt</p>
              <p className="text-slate-500 text-sm">
                We'll analyze structure, decision points, and professional standards
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
