
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, Loader, Scale, Sparkles, Copy } from "lucide-react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState("");

  const processPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setCheckResults([]);
    setImprovedPrompt("");
    
    try {
      console.log('SAGA: Processing legal prompt:', prompt.substring(0, 100) + '...');
      
      // First analyze the prompt
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('eai-semantic-check', {
        body: { prompt }
      });

      if (analysisError) {
        console.error('SAGA Analysis Error:', analysisError);
        throw analysisError;
      }

      console.log('SAGA Analysis Complete:', analysisData);
      
      if (analysisData?.results) {
        setCheckResults(analysisData.results);
      }

      // Then enhance the prompt based on analysis
      const { data: enhanceData, error: enhanceError } = await supabase.functions.invoke('eai-prompt-suggest', {
        body: { 
          mode: 'improve',
          prompt: prompt,
          constraints: 'Legal professional context with EAI compliance standards - deliver ready-to-use professional prompt'
        }
      });

      if (enhanceError) {
        console.error('SAGA Enhancement Error:', enhanceError);
        throw enhanceError;
      }

      console.log('SAGA Enhancement Complete:', enhanceData);

      if (enhanceData?.prompt) {
        setImprovedPrompt(enhanceData.prompt);
        // Automatically apply the improved prompt
        onPromptChange(enhanceData.prompt);
      }
    } catch (error) {
      console.error('SAGA Processing Failed:', error);
      setCheckResults([{
        rubric: "SAGA System Status",
        flag: "🔌 Processing Error",
        check: "Unable to analyze and improve your prompt",
        advice: "Please check your connection and try again",
        status: "fail"
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    onPromptChange("");
    setCheckResults([]);
    setImprovedPrompt("");
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
            Enter your legal prompt for professional analysis and improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your legal AI prompt here for professional analysis and improvement..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-sm min-h-[300px] resize-none"
            rows={15}
          />
          
          <div className="flex gap-2">
            {prompt.trim() && (
              <Button 
                variant="outline" 
                onClick={clearAll}
                className="gap-2"
                disabled={isProcessing}
              >
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button 
              onClick={processPrompt}
              disabled={isProcessing || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing Legal Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze & Improve
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
            Legal Analysis Results
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
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="relative">
                <Scale className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-1/2 animate-bounce" />
              </div>
              <p className="text-white mb-2 font-medium">Analyzing and improving your legal prompt...</p>
              <p className="text-slate-400 text-sm mb-1">
                Reading content and applying professional standards
              </p>
              <p className="text-slate-500 text-xs">
                EAI compliance • Legal analysis • Professional enhancement
              </p>
            </div>
          ) : checkResults.length > 0 ? (
            <div className="space-y-4">
              {improvedPrompt && (
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Professional Legal Prompt Ready</span>
                  </div>
                  <p className="text-green-200 text-sm mb-2">
                    Your prompt has been automatically improved and applied above
                  </p>
                  <ClipboardNotification text={improvedPrompt}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Improved Prompt
                    </Button>
                  </ClipboardNotification>
                </div>
              )}
              
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
          ) : (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <Scale className="w-16 h-16 text-slate-600 mx-auto" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-2 animate-pulse" />
              </div>
              <p className="text-slate-400 mb-2 font-medium">SAGA Legal AI Ready</p>
              <p className="text-slate-500 text-sm mb-2">
                Enter your prompt above for professional analysis and automatic improvement
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✓ Analyzes your specific legal content</p>
                <p>✓ Applies EAI compliance standards</p>
                <p>✓ Delivers improved professional prompt</p>
                <p>✓ Automatic application of enhancements</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
