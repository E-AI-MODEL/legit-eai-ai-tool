
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
            enhanced += '**Nederlandse Juridische Verantwoordelijkheid:**\n';
            enhanced += '- Advocaat behoudt eindverantwoordelijkheid (art. 28 Advocatenwet)\n';
            enhanced += '- AI ondersteunt, advocaat beslist en controleert\n';
            enhanced += '- Duidelijke review momenten voor juridische kwaliteit\n';
            enhanced += '- Client informed consent over AI-gebruik\n\n';
          }
          
          if (criticalIssues.some((r: CheckResult) => r.rubric.includes('Traceability'))) {
            enhanced += '**Dossier Verantwoording & Audit Trail:**\n';
            enhanced += '- Documenteer AI-input en menselijke beslissingen\n';
            enhanced += '- Bewaar reasoning en motivatie per stap\n';
            enhanced += '- Voldoe aan Advocatenwet art. 33 (dossierplicht)\n';
            enhanced += '- Maak keuzes traceerbaar voor tuchtrecht\n\n';
          }
          
          if (criticalIssues.some((r: CheckResult) => r.rubric.includes('Scaffolding'))) {
            enhanced += '**Juridische Expertise Verdeling:**\n';
            enhanced += '- Advocaat voert juridische analyse uit\n';
            enhanced += '- AI ondersteunt met research en structuur\n';
            enhanced += '- Advocaat controleert en valideert alle output\n';
            enhanced += '- Behoud professionele oordeelsvorming\n\n';
          }
          
          // Professional legal enhancements for warnings
          if (warnings.some((r: CheckResult) => r.rubric.includes('Bias'))) {
            enhanced += '**Nederlandse Rechtspraak Neutraliteit:**\n';
            enhanced += '- Overweeg meerdere juridische invalshoeken\n';
            enhanced += '- Respecteer tegengestelde rechtsleer\n';
            enhanced += '- Gebruik neutrale, professionele taal\n';
            enhanced += '- Vermijd vooringenomenheid richting cliënt\n\n';
          }
          
          if (warnings.some((r: CheckResult) => r.rubric.includes('Compliance'))) {
            enhanced += '**Compliance & Beroepsregels:**\n';
            enhanced += '- Naleving Nederlandse Advocatenwet\n';
            enhanced += '- Respecteer geheimhoudingsplicht (art. 29)\n';
            enhanced += '- Documenteer conform NOvA richtlijnen\n';
            enhanced += '- Behoud onafhankelijkheid (art. 8)\n\n';
          }
          
          if (warnings.some((r: CheckResult) => r.rubric.includes('Output'))) {
            enhanced += '**Professionele Output Kwaliteit:**\n';
            enhanced += '- Juridisch correcte terminologie\n';
            enhanced += '- Bronvermelding naar relevante rechtspraak\n';
            enhanced += '- Duidelijke structuur en argumentatie\n';
            enhanced += '- Review proces door senior advocaat\n\n';
          }
          
          enhanced += '**SAGA Legal AI Kwaliteitsborging:**\n';
          enhanced += '- AI fungeert als intelligente assistent\n';
          enhanced += '- Advocaat behoudt professionele autonomie\n';
          enhanced += '- Alle output voldoet aan Nederlandse beroepsstandaarden\n';
          enhanced += '- Transparantie naar cliënt over AI-rol\n';
          enhanced += '- Continue kwaliteitsmonitoring en -verbetering';
          
          setEnhancedPrompt(enhanced);
        }
      }
    } catch (error) {
      console.error('SAGA Legal EAI Analysis Failed:', error);
      setCheckResults([{
        rubric: "SAGA System Status",
        flag: "🔌 Connection Error",
        check: "Verbinding met SAGA Legal AI backend onderbroken",
        advice: "Probeer opnieuw of controleer je internetverbinding",
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
            Juridische AI Prompt
          </CardTitle>
          <CardDescription className="text-slate-300">
            Voer je juridische prompt in voor diepgaande SAGA Legal AI analyse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Voer hier je juridische AI prompt in voor uitgebreide Nederlandse EAI compliance analyse volgens de hoogste professionele standaarden..."
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
                Wissen
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
                  SAGA Legal AI Analyse...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  SAGA Legal AI Analyse
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
                    ⚠ {criticalIssues} kritiek
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Professionele Nederlandse juridische AI analyse met 10 EAI compliance rubrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="text-center py-12">
              <div className="relative">
                <Scale className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-1/2 animate-bounce" />
              </div>
              <p className="text-white mb-2 font-medium">SAGA Legal AI aan het werk...</p>
              <p className="text-slate-400 text-sm mb-1">
                Diepgaande analyse volgens Nederlandse juridische standaarden
              </p>
              <p className="text-slate-500 text-xs">
                10 EAI compliance rubrics • Advocatenwet conformiteit • NOvA richtlijnen
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
                    <span>Nederlandse Juridische Enhancement Klaar</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-slate-400">
                    SAGA heeft je prompt uitgebreid met Nederlandse juridische compliance en EAI best practices
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyLegalEnhancement}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Juridische Enhancement Toepassen
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
              <p className="text-slate-400 mb-2 font-medium">SAGA Legal AI Gereed</p>
              <p className="text-slate-500 text-sm mb-2">
                Geavanceerde Nederlandse juridische AI analyse
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✓ EAI Compliance volgens internationale standaarden</p>
                <p>✓ Nederlandse Advocatenwet conformiteit</p>
                <p>✓ NOvA richtlijnen integratie</p>
                <p>✓ Professionele juridische enhancement</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
