
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Copy, Loader } from "lucide-react";
import { useState } from "react";
import ClipboardNotification from "@/components/ClipboardNotification";
import { supabase } from "@/integrations/supabase/client";

interface CheckResult {
  rubric: string;
  flag: string;
  check: string;
  advice: string;
  status: "pass" | "warning" | "fail";
}

interface SagaPromptCheckerProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const SagaPromptChecker = ({ prompt, onPromptChange }: SagaPromptCheckerProps) => {
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const performQualityCheck = async (text: string) => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setCheckResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('eai-semantic-check', {
        body: { prompt: text }
      });

      if (error) {
        console.error('Error calling eai-semantic-check:', error);
        throw error;
      }

      if (data?.results) {
        setCheckResults(data.results);
        
        // Generate enhanced prompt based on failing checks
        const failingChecks = data.results.filter((r: CheckResult) => r.status === 'fail');
        const warningChecks = data.results.filter((r: CheckResult) => r.status === 'warning');
        
        if (failingChecks.length > 0 || warningChecks.length > 0) {
          let enhanced = text + '\n\n## Professional Enhancement Framework\n\n';
          
          // Add enhancements for critical failures
          if (failingChecks.some((r: CheckResult) => r.rubric.includes('Agency'))) {
            enhanced += '**Decision Authority & Review Points:**\n- Define clear human review checkpoints\n- Specify when AI suggests vs. human decides\n- Include approval workflows for critical decisions\n\n';
          }
          
          if (failingChecks.some((r: CheckResult) => r.rubric.includes('Traceability'))) {
            enhanced += '**Cognitive Ownership Requirements:**\n- User must justify acceptance/rejection of AI output\n- Require reasoning trace-back and annotation\n- Document decision rationale\n\n';
          }
          
          if (failingChecks.some((r: CheckResult) => r.rubric.includes('Scaffolding'))) {
            enhanced += '**Task Distribution:**\n- User performs initial analysis and planning\n- AI provides supporting research and suggestions\n- User maintains control of final decisions\n\n';
          }
          
          if (warningChecks.some((r: CheckResult) => r.rubric.includes('Bias'))) {
            enhanced += '**Bias Mitigation:**\n- Consider multiple perspectives and alternatives\n- Use neutral, professional language\n- Challenge assumptions explicitly\n\n';
          }
          
          if (warningChecks.some((r: CheckResult) => r.rubric.includes('Output'))) {
            enhanced += '**Output Requirements:**\n- Specify exact format and structure\n- Define review and approval process\n- Include audit trail documentation\n\n';
          }
          
          enhanced += '**Quality Controls:**\n- Maintain professional communication standards\n- Provide source citations and references\n- Include risk assessment and mitigation strategies';
          
          setEnhancedPrompt(enhanced);
        }
      }
    } catch (error) {
      console.error('Error in quality check:', error);
      // Fallback to basic checks if API fails
      setCheckResults([{
        rubric: "System Error",
        flag: "🚨 API Error",
        check: "Unable to connect to quality assessment service",
        advice: "Please try again or check your connection",
        status: "fail"
      }]);
    } finally {
      setIsChecking(false);
    }
  };

  const handleEnhancePrompt = () => {
    performQualityCheck(prompt);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'border-green-400/50 text-green-400';
      case 'warning': return 'border-yellow-400/50 text-yellow-400';
      case 'fail': return 'border-red-400/50 text-red-400';
      default: return 'border-gray-400/50 text-gray-400';
    }
  };

  const passedChecks = checkResults.filter(r => r.status === 'pass').length;
  const totalChecks = checkResults.length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Your Legal Prompt</CardTitle>
          <CardDescription className="text-slate-300">
            Enter your prompt for professional EAI compliance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your legal AI prompt here for comprehensive quality analysis..."
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
                disabled={isChecking}
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
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Professional EAI Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            EAI Compliance Results
            {totalChecks > 0 && (
              <Badge variant="outline" className="text-xs">
                {passedChecks}/{totalChecks} passed
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Professional legal AI prompt assessment using 10 EAI rubrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400 mb-2">Running comprehensive EAI analysis...</p>
              <p className="text-slate-500 text-sm">
                Analyzing against 10 professional compliance rubrics
              </p>
            </div>
          ) : checkResults.length > 0 ? (
            <div className="space-y-4">
              {/* Quality Issues */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {checkResults.map((result, index) => (
                  <div key={index} className={`bg-white/5 rounded-lg p-3 border ${getStatusColor(result.status).split(' ')[0]}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{result.rubric}</span>
                          <span className="text-xs">{result.flag}</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-1">{result.check}</p>
                        <p className="text-xs text-slate-400">{result.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced Prompt Actions */}
              {enhancedPrompt && enhancedPrompt !== prompt && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="text-sm text-white font-medium">
                    ✨ Professional Enhancement Ready
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyEnhancement}
                      className="flex-1"
                    >
                      Apply AI Enhancement
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
              <p className="text-slate-400 mb-2">Ready for EAI compliance analysis</p>
              <p className="text-slate-500 text-sm">
                Advanced AI-powered assessment using professional legal standards
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
