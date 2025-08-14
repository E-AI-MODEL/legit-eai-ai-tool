
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Copy, Loader, Scale, Sparkles } from "lucide-react";
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

  const performLegalEAIAnalysis = async (text: string) => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setCheckResults([]);
    setEnhancedPrompt("");
    
    try {
      console.log('Starting SAGA Legal EAI Analysis...');
      
      const { data, error } = await supabase.functions.invoke('eai-semantic-check', {
        body: { prompt: text }
      });

      if (error) {
        console.error('SAGA EAI Analysis Error:', error);
        throw error;
      }

      console.log('SAGA EAI Analysis Results:', data);

      if (data?.results) {
        setCheckResults(data.results);
        
        // Generate sophisticated legal enhancement based on EAI analysis
        const criticalIssues = data.results.filter((r: CheckResult) => r.status === 'fail');
        const warnings = data.results.filter((r: CheckResult) => r.status === 'warning');
        
        if (criticalIssues.length > 0 || warnings.length > 0) {
          let enhanced = text + '\n\n## SAGA Legal AI Enhancement Framework\n\n';
          
          // Critical legal compliance enhancements
          if (criticalIssues.some((r: CheckResult) => r.rubric.includes('Agency'))) {
            enhanced += '**Professional Legal Responsibility:**\n';
            enhanced += '- Attorney maintains ultimate responsibility for all legal work\n';
            enhanced += '- AI assists, attorney decides and controls all outputs\n';
            enhanced += '- Clear review checkpoints for legal quality assurance\n';
            enhanced += '- Client informed consent regarding AI assistance\n\n';
          }
          
          if (criticalIssues.some((r: CheckResult) => r.rubric.includes('Traceability'))) {
            enhanced += '**Documentation & Audit Trail:**\n';
            enhanced += '- Document AI input and human decision points\n';
            enhanced += '- Preserve reasoning and justification for each step\n';
            enhanced += '- Maintain professional file management standards\n';
            enhanced += '- Ensure choices are traceable for professional review\n\n';
          }
          
          if (criticalIssues.some((r: CheckResult) => r.rubric.includes('Scaffolding'))) {
            enhanced += '**Legal Expertise Distribution:**\n';
            enhanced += '- Attorney performs legal analysis and judgment\n';
            enhanced += '- AI supports with research and structure\n';
            enhanced += '- Attorney controls and validates all outputs\n';
            enhanced += '- Maintain professional decision-making authority\n\n';
          }
          
          // Professional legal enhancements for warnings
          if (warnings.some((r: CheckResult) => r.rubric.includes('Bias'))) {
            enhanced += '**Professional Legal Neutrality:**\n';
            enhanced += '- Consider multiple legal perspectives\n';
            enhanced += '- Respect opposing legal doctrine\n';
            enhanced += '- Use neutral, professional language\n';
            enhanced += '- Avoid bias toward client position\n\n';
          }
          
          if (warnings.some((r: CheckResult) => r.rubric.includes('Compliance'))) {
            enhanced += '**Compliance & Professional Rules:**\n';
            enhanced += '- Adherence to applicable bar regulations\n';
            enhanced += '- Respect attorney-client privilege\n';
            enhanced += '- Document according to professional guidelines\n';
            enhanced += '- Maintain professional independence\n\n';
          }
          
          if (warnings.some((r: CheckResult) => r.rubric.includes('Output'))) {
            enhanced += '**Professional Output Quality:**\n';
            enhanced += '- Legally correct terminology\n';
            enhanced += '- Citations to relevant case law\n';
            enhanced += '- Clear structure and argumentation\n';
            enhanced += '- Senior attorney review process\n\n';
          }
          
          enhanced += '**SAGA Legal AI Quality Assurance:**\n';
          enhanced += '- AI functions as intelligent legal assistant\n';
          enhanced += '- Attorney retains professional autonomy\n';
          enhanced += '- All output meets professional standards\n';
          enhanced += '- Transparency to client about AI role\n';
          enhanced += '- Continuous quality monitoring and improvement';
          
          setEnhancedPrompt(enhanced);
        }
      }
    } catch (error) {
      console.error('SAGA Legal EAI Analysis Failed:', error);
      setCheckResults([{
        rubric: "SAGA System Status",
        flag: "🔌 Connection Error",
        check: "Connection to SAGA Legal AI backend interrupted",
        advice: "Please try again or check your internet connection",
        status: "fail"
      }]);
    } finally {
      setIsChecking(false);
    }
  };

  const runSAGAAnalysis = () => {
    performLegalEAIAnalysis(prompt);
  };

  const applyLegalEnhancement = () => {
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
  const criticalIssues = checkResults.filter(r => r.status === 'fail').length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Enhanced Legal Input Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Legal AI Prompt
          </CardTitle>
          <CardDescription className="text-slate-300">
            Enter your legal prompt for comprehensive SAGA Legal AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your legal AI prompt here for comprehensive EAI compliance analysis according to the highest professional standards..."
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
              onClick={runSAGAAnalysis}
              disabled={isChecking || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isChecking ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  SAGA Legal AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  SAGA Legal AI Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Legal Results Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Scale className="w-5 h-5" />
            SAGA Legal EAI Compliance
            {totalChecks > 0 && (
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/50">
                  ✓ {passedChecks}/{totalChecks}
                </Badge>
                {criticalIssues > 0 && (
                  <Badge variant="outline" className="text-xs text-red-400 border-red-400/50">
                    ⚠ {criticalIssues} critical
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Professional legal AI analysis with 10 EAI compliance rubrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="text-center py-12">
              <div className="relative">
                <Scale className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-1/2 animate-bounce" />
              </div>
              <p className="text-white mb-2 font-medium">SAGA Legal AI at work...</p>
              <p className="text-slate-400 text-sm mb-1">
                Comprehensive analysis according to professional legal standards
              </p>
              <p className="text-slate-500 text-xs">
                10 EAI compliance rubrics • Professional bar compliance • Legal AI best practices
              </p>
            </div>
          ) : checkResults.length > 0 ? (
            <div className="space-y-4">
              {/* Legal Compliance Results */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {checkResults.map((result, index) => (
                  <div key={index} className={`bg-white/5 rounded-lg p-3 border ${getStatusColor(result.status).split(' ')[0]}`}>
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{result.rubric}</span>
                          <span className="text-xs opacity-80">{result.flag}</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-1">{result.check}</p>
                        <p className="text-xs text-slate-400 italic">{result.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced Legal Actions */}
              {enhancedPrompt && enhancedPrompt !== prompt && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white font-medium">
                    <Scale className="w-4 h-4 text-blue-400" />
                    <span>Legal Enhancement Ready</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-slate-400">
                    SAGA has enhanced your prompt with professional legal compliance and EAI best practices
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyLegalEnhancement}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Apply Legal Enhancement
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
              <div className="relative mb-6">
                <Scale className="w-16 h-16 text-slate-600 mx-auto" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-2 animate-pulse" />
              </div>
              <p className="text-slate-400 mb-2 font-medium">SAGA Legal AI Ready</p>
              <p className="text-slate-500 text-sm mb-2">
                Advanced professional legal AI analysis
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✓ EAI compliance according to international standards</p>
                <p>✓ Professional bar regulation conformity</p>
                <p>✓ Legal professional guidelines integration</p>
                <p>✓ Professional legal enhancement</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
