
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Copy, Loader, Scale, Sparkles, Wand2 } from "lucide-react";
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
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const performPromptAnalysis = async (text: string) => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setCheckResults([]);
    setEnhancedPrompt("");
    
    try {
      console.log('Starting SAGA Legal AI Analysis for prompt:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('eai-semantic-check', {
        body: { prompt: text }
      });

      if (error) {
        console.error('SAGA Analysis Error:', error);
        throw error;
      }

      console.log('SAGA Analysis Results:', data);

      if (data?.results) {
        setCheckResults(data.results);
      }
    } catch (error) {
      console.error('SAGA Legal AI Analysis Failed:', error);
      setCheckResults([{
        rubric: "SAGA System Status",
        flag: "🔌 Connection Error",
        check: "Unable to analyze your specific prompt content",
        advice: "Please check your connection and try again",
        status: "fail"
      }]);
    } finally {
      setIsChecking(false);
    }
  };

  const enhancePrompt = async (text: string) => {
    if (!text.trim()) return;
    
    setIsEnhancing(true);
    setEnhancedPrompt("");
    
    try {
      console.log('Starting SAGA Prompt Enhancement for:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('eai-prompt-suggest', {
        body: { 
          mode: 'improve',
          prompt: text,
          constraints: 'Legal professional context with EAI compliance standards'
        }
      });

      if (error) {
        console.error('SAGA Enhancement Error:', error);
        throw error;
      }

      console.log('SAGA Enhancement Results:', data);

      if (data?.prompt) {
        setEnhancedPrompt(data.prompt);
      }
    } catch (error) {
      console.error('SAGA Enhancement Failed:', error);
      setEnhancedPrompt("Error: Unable to enhance your prompt. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const runAnalysis = () => {
    performPromptAnalysis(prompt);
  };

  const runEnhancement = () => {
    enhancePrompt(prompt);
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
  const criticalIssues = checkResults.filter(r => r.status === 'fail').length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Legal AI Prompt
          </CardTitle>
          <CardDescription className="text-slate-300">
            Enter your legal prompt for comprehensive analysis and enhancement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your legal AI prompt here for specific analysis and enhancement..."
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
                disabled={isChecking || isEnhancing}
              >
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button 
              onClick={runAnalysis}
              disabled={isChecking || isEnhancing || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isChecking ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Your Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
            <Button 
              onClick={runEnhancement}
              disabled={isChecking || isEnhancing || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isEnhancing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Enhance Prompt
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
            <Scale className="w-5 h-5" />
            Analysis Results
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
            Professional legal AI analysis with EAI compliance standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="text-center py-12">
              <div className="relative">
                <Scale className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-1/2 animate-bounce" />
              </div>
              <p className="text-white mb-2 font-medium">Analyzing your specific prompt...</p>
              <p className="text-slate-400 text-sm mb-1">
                Reading content and checking compliance
              </p>
              <p className="text-slate-500 text-xs">
                10 EAI rubrics • Professional standards • Legal compliance
              </p>
            </div>
          ) : isEnhancing ? (
            <div className="text-center py-12">
              <div className="relative">
                <Wand2 className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-1/2 animate-bounce" />
              </div>
              <p className="text-white mb-2 font-medium">Enhancing your prompt...</p>
              <p className="text-slate-400 text-sm mb-1">
                Improving structure and compliance
              </p>
              <p className="text-slate-500 text-xs">
                Professional standards • EAI best practices • Legal enhancement
              </p>
            </div>
          ) : checkResults.length > 0 ? (
            <div className="space-y-4">
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
            </div>
          ) : enhancedPrompt ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <Wand2 className="w-4 h-4 text-green-400" />
                <span>Enhanced Prompt Ready</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400">
                Your prompt has been enhanced with professional legal standards and EAI compliance
              </p>
              <div className="bg-white/5 rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {enhancedPrompt}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={applyEnhancement}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Apply Enhancement
                </Button>
                <ClipboardNotification text={enhancedPrompt}>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </ClipboardNotification>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <Scale className="w-16 h-16 text-slate-600 mx-auto" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-2 animate-pulse" />
              </div>
              <p className="text-slate-400 mb-2 font-medium">SAGA Legal AI Ready</p>
              <p className="text-slate-500 text-sm mb-2">
                Enter your prompt above to get specific analysis and enhancement
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✓ Reads and analyzes your specific content</p>
                <p>✓ EAI compliance according to professional standards</p>
                <p>✓ Professional legal enhancement suggestions</p>
                <p>✓ Tailored feedback for your prompt</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
