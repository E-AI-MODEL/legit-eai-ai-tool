
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, Plus, RefreshCw } from "lucide-react";
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

  // Enhanced quality gates that improve the prompt
  const performQualityGateCheck = (text: string): { results: CheckResult[], normalized: string } => {
    const results: CheckResult[] = [];
    let normalized = text;

    // Gate 1: Structure - enforce Facts + Analysis sections
    if (!/(Facts|Feiten).*(Extract|Extractie)/i.test(text)) {
      results.push({
        category: "Structuur",
        status: "fail",
        message: "Ontbrekende 'Facts (Extract)' sectie",
        suggestion: "Voeg gestructureerde feiten-extractie toe",
        priority: "high",
        autoFix: "\n\nFacts (Extract)\n- [Specificeer exacte velden met bronvermelding]\n- Quote relevante passages met pinpoint citaties."
      });
    }

    if (!/(Analysis|Analyse).*(Interpretation|Interpretatie)/i.test(text)) {
      results.push({
        category: "Structuur",
        status: "fail",
        message: "Ontbrekende 'Analysis (Interpretation)' sectie",
        suggestion: "Voeg analyse-sectie toe met alternatieven",
        priority: "high",
        autoFix: "\n\nAnalysis (Interpretation)\n- Plain-English impact; uncertainty notes; 1–2 alternatives with trade-offs."
      });
    }

    // Gate 2: Evidence - enforce Sources & Action Log
    if (!/Sources.*Action Log|Bronnen.*Actie Log/i.test(text)) {
      results.push({
        category: "Bewijs",
        status: "fail",
        message: "Ontbrekende bronnen en actie-logging",
        suggestion: "Voeg traceerbaarheid toe",
        priority: "high",
        autoFix: "\n\nSources & Action Log\n- List sources with pinpoint citations; summarize steps/tools used."
      });
    }

    // Gate 3: Human Control - enforce decision points
    if (!/Decision points.*Human approval|Beslispunten.*menselijke/i.test(text)) {
      results.push({
        category: "Menselijke Controle",
        status: "fail",
        message: "Ontbrekende menselijke goedkeuring checkpoints",
        suggestion: "Voeg verplichte review momenten toe",
        priority: "high",
        autoFix: "\n\nDecision points — Human approval required\n- Pause for [specify critical decisions] before proceeding."
      });
    }

    // Gate 4: Tone & Privacy - remove guarantees, add privacy protection
    const hasGuarantees = /zeker|gegarandeerd|altijd|nooit|definitief/i.test(text);
    if (hasGuarantees) {
      results.push({
        category: "Toon",
        status: "warning",
        message: "Zekerheids-taal gedetecteerd",
        suggestion: "Gebruik neutrale, voorzichtige bewoordingen",
        priority: "medium",
        autoFix: "\n\nTone & Privacy\n- Neutral, plain English. Avoid certainties; use 'likely', 'appears', 'suggests'.\n- Avoid PII; request redacted excerpts only."
      });
    }

    if (!/privacy|PII|geanonimiseerd/i.test(text)) {
      results.push({
        category: "Privacy",
        status: "warning",
        message: "Geen privacy-bescherming genoemd",
        suggestion: "Voeg privacy-waarborgen toe",
        priority: "high",
        autoFix: "\n\nTone & Privacy\n- Avoid PII; request redacted excerpts only.\n- EU storage/processing; no training on client data."
      });
    }

    // Gate 5: Output Clarity - enforce explicit format
    if (!/output|format|bullets|headings|table/i.test(text)) {
      results.push({
        category: "Output Format",
        status: "warning",
        message: "Output format niet gespecificeerd",
        suggestion: "Definieer duidelijk output formaat",
        priority: "medium",
        autoFix: "\n\nOutputs\n- [Specify format: bullets/headings/table] ready for [email/memo/client]."
      });
    }

    // Gate 6: Reflection & Hand-off - require insights and handoff
    if (!/reflection|insights|hand-off|review/i.test(text)) {
      results.push({
        category: "Reflectie",
        status: "warning",
        message: "Ontbrekende reflectie en overdracht",
        suggestion: "Voeg metacognitieve elementen toe",
        priority: "medium",
        autoFix: "\n\nReflection\n- 3 insights; 3 open questions.\n\nHuman Review Hand-off\n- List items requiring confirmation and pause."
      });
    }

    // Create normalized prompt by applying all fixes
    if (results.length > 0) {
      let improvedPrompt = text;
      
      // Add greeting if missing
      if (!improvedPrompt.toLowerCase().startsWith('hi')) {
        improvedPrompt = `Hi — plan: ${improvedPrompt}`;
      }

      // Apply auto-fixes in order
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
      // Try backend check for additional insights
      const response = await fetch('/functions/v1/eai-semantic-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        const backendResults = data.results?.map((result: any) => ({
          category: result.rubric?.split(' ')[0] || 'Backend',
          status: result.status,
          message: result.advice,
          suggestion: result.advice,
          priority: result.status === 'fail' ? 'high' : result.status === 'warning' ? 'medium' : 'low'
        })) || [];
        
        // Merge and deduplicate results
        const mergedResults = [...localResults];
        backendResults.forEach((backendResult: CheckResult) => {
          if (!localResults.some(local => local.category === backendResult.category)) {
            mergedResults.push(backendResult);
          }
        });
        
        setCheckResults(mergedResults);
      }
    } catch (error) {
      console.error('Backend check failed, using local quality gates only:', error);
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
      {/* Prompt Input */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            Prompt Checker
          </CardTitle>
          <CardDescription className="text-slate-300">
            Analyseer en verbeter prompts met kwaliteitscontroles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Plak hier je prompt voor analyse..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-sm"
            rows={12}
          />
          
          <Button 
            onClick={handleCheck}
            disabled={isChecking || !prompt.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyseren...
              </>
            ) : (
              'Analyseer & Verbeter Prompt'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Analyse Resultaten</CardTitle>
          <CardDescription className="text-slate-300">
            Kwaliteitsverbeteringen en suggesties
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
                            {result.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2">{result.message}</p>
                    <p className="text-sm text-slate-400 mb-3">{result.suggestion}</p>
                    
                    {result.autoFix && (
                      <Button
                        onClick={() => applyAutoFix(result.autoFix!)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Toepassen
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {normalizedPrompt && normalizedPrompt !== prompt && (
                <div className="border-t border-white/10 pt-4">
                  <Button
                    onClick={applyNormalizedPrompt}
                    className="w-full"
                    variant="default"
                  >
                    Gebruik Verbeterde Prompt
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Analyseer een prompt om kwaliteitsverbeteringen te zien</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaPromptChecker;
