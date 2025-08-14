
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

  // Enhanced checking logic based on EAI rubrics translated to practical advice
  const performLocalCheck = (text: string): CheckResult[] => {
    const results: CheckResult[] = [];
    
    // V_C - Helderheid (Clarity)
    if (text.includes('juridisch') && (text.includes('bepaling') || text.includes('artikel'))) {
      if (!/uitleg|betekent|houdt in|vertaald/.test(text)) {
        results.push({
          category: "Helderheid",
          status: "warning",
          message: "Juridische termen zonder uitleg gevonden",
          suggestion: "Voeg uitleg toe van juridische begrippen",
          priority: "high",
          autoFix: "Voeg deze zin toe: 'Leg elke juridische term uit in gewone taal.'"
        });
      }
    }

    // V_M - Keuzebewustzijn (Choice Awareness)
    if (!/opties|alternatieven|keuzes|mogelijkheden/.test(text)) {
      results.push({
        category: "Keuzebewustzijn",
        status: "warning",
        message: "Geen keuzemogelijkheden genoemd",
        suggestion: "Geef gebruiker expliciete opties",
        priority: "high",
        autoFix: "Voeg toe: 'Geef minimaal 2 alternatieven met voor- en nadelen.'"
      });
    }

    // T - Techniek & Structuur (Technical Structure)
    const sections = text.split('#').length - 1;
    if (sections < 3) {
      results.push({
        category: "Structuur",
        status: "fail",
        message: "Te weinig secties voor complexe juridische analyse",
        suggestion: "Voeg meer gestructureerde secties toe",
        priority: "high",
        autoFix: "Voeg secties toe: '## Inputs', '## Stappen', '## Menselijke Review'"
      });
    }

    // F_TD - Taakdichtheid (Task Density)
    const sentences = text.split(/[.!?]+/).length;
    const imperatives = (text.match(/\b(doe|maak|schrijf|analyseer|controleer)\b/gi) || []).length;
    if (imperatives / sentences > 0.3) {
      results.push({
        category: "Taakbalans",
        status: "warning",
        message: "Te veel taken voor AI, te weinig voor gebruiker",
        suggestion: "Geef gebruiker meer eigen taken",
        priority: "medium",
        autoFix: "Voeg toe: 'Gebruiker controleert en beoordeelt elke stap voordat verder gegaan wordt.'"
      });
    }

    // V_S - Sociale Druk (Social Pressure)
    if (/dringend|snel|meteen|urgent|onmiddellijk/.test(text)) {
      results.push({
        category: "Tijdsdruk",
        status: "warning",
        message: "Onnodige urgentie gedetecteerd",
        suggestion: "Vermijd tijdsdruk, geef realistische planning",
        priority: "medium",
        autoFix: "Vervang urgente taal door: 'Neem de tijd voor zorgvuldige analyse.'"
      });
    }

    // F_CT - Cognitieve Transparantie (Cognitive Transparency)
    if (!/omdat|motivatie|redenering|onderbouwing/.test(text)) {
      results.push({
        category: "Transparantie",
        status: "warning",
        message: "Geen motivatie of redenering vereist",
        suggestion: "Vraag om onderbouwing van adviezen",
        priority: "high",
        autoFix: "Voeg toe: 'Motiveer elke aanbeveling met juridische onderbouwing.'"
      });
    }

    // Human oversight check
    if (!/menselijke|advocaat|review|controle|goedkeuring/.test(text.toLowerCase())) {
      results.push({
        category: "Menselijke Controle",
        status: "fail",
        message: "Geen menselijke review checkpoint",
        suggestion: "Voeg verplichte menselijke controle toe",
        priority: "high",
        autoFix: "Voeg toe: '**MENSELIJKE REVIEW VEREIST** - Advocaat controleert voordat verder gegaan wordt.'"
      });
    }

    // Privacy & ethics check
    if (/persoonsgegeven|privé|vertrouwelijk/.test(text) && !/geanonimiseerd|geredacted/.test(text)) {
      results.push({
        category: "Privacy",
        status: "fail",
        message: "Privacy-gevoelige data zonder bescherming",
        suggestion: "Voeg privacy-bescherming toe",
        priority: "high",
        autoFix: "Voeg toe: 'Gebruik alleen geanonimiseerde voorbeelden zonder persoonlijke gegevens.'"
      });
    }

    return results.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const handleCheck = async () => {
    if (!prompt.trim()) return;
    
    setIsChecking(true);
    
    // Combine local checks with backend API check
    const localResults = performLocalCheck(prompt);
    setCheckResults(localResults);
    
    try {
      const response = await fetch('/functions/v1/eai-semantic-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Merge backend results with local results
        const backendResults = data.results?.map((result: any) => ({
          category: result.rubric.split(' ')[0], // Take first word as category
          status: result.status,
          message: result.advice,
          suggestion: result.advice,
          priority: result.status === 'fail' ? 'high' : result.status === 'warning' ? 'medium' : 'low'
        })) || [];
        
        setCheckResults([...localResults, ...backendResults]);
      }
    } catch (error) {
      console.error('Backend check failed, using local results only:', error);
    }
    
    setIsChecking(false);
  };

  const applyAutoFix = (fix: string) => {
    const updatedPrompt = prompt + '\n\n' + fix;
    onPromptChange(updatedPrompt);
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
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-3">
          <CheckCircle className="w-6 h-6" />
          Saga Prompt Checker
        </CardTitle>
        <CardDescription className="text-slate-300">
          Analyseer prompts op juridische kwaliteit en EAI-compliantie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Plak hier je prompt voor analyse..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          rows={8}
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
            'Analyseer Prompt'
          )}
        </Button>
        
        {checkResults.length > 0 && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <h4 className="font-semibold text-white">Analyse Resultaten</h4>
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
                    Automatisch Toepassen
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SagaPromptChecker;
