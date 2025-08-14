import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, Shield, Brain, Database, Zap, Wand2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SagaPromptPresets from "@/components/SagaPromptPresets";
import SagaPromptChecker from "@/components/SagaPromptChecker";

const Saga = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genContext, setGenContext] = useState({
    topic: "",
    audience: "advocaten",
    output: "Gestructureerde secties met duidelijke kopjes",
    tone: "professioneel, neutraal", 
    constraints: "Nederlandse juridische praktijk, EAI-compliant"
  });

  const adviceLibrary = {
    "Structuur": {
      "chips": [
        "Voeg 'Feiten (Extractie)' sectie toe met exacte velden en precieze bronvermelding.",
        "Voeg 'Analyse (Interpretatie)' sectie toe met risico's, opties en afwegingen.",
        "Definieer datatypes voor geëxtraheerde velden (bijv. ISO datum, boolean)."
      ]
    },
    "Bewijs": {
      "chips": [
        "Eis een Bronnenlijst en precieze citaten voor elke bewering.",
        "Vraag om een Actie Log van stappen en gebruikte tools."
      ]
    },
    "Beslispunten": {
      "chips": [
        "Voeg Menselijke Goedkeuring checkpoints toe en pauzeer voor adviesverstrekking.",
        "Voeg override notitie toe: de advocaat neemt de finale beslissing."
      ]
    },
    "Toon": {
      "chips": [
        "Vermijd zekerheidstaal; bied 1-2 alternatieven met afwegingen.",
        "Gebruik neutrale, gewone taal; vermijd urgentie-taal."
      ]
    },
    "Privacy": {
      "chips": [
        "Vermijd PII; vraag indien nodig alleen geredacted uittreksels.",
        "Vermeld EU opslag/verwerking en geen training op cliëntdata."
      ]
    },
    "Output format": {
      "chips": [
        "Specificeer het output formaat (bullets, tabel, of tracked changes).",
        "Voeg kort openingsplan en duidelijke sectievolgorde toe."
      ]
    },
    "Timing": {
      "chips": [
        "Voeg review window toe voor finalisatie.",
        "Bij kritieke timing, leg uit waarom en bied opt-out."
      ]
    },
    "Scope & criteria": {
      "chips": [
        "Benoem jurisdictie en juridische criteria (wet/artikel/zaak/richtlijn).",
        "Definieer kerntermen vooraf om dubbelzinnigheid te vermijden."
      ]
    }
  };

  const detectorRules = [
    {
      id: "missing-structure",
      label: "Structuur",
      severity: "medium",
      description: "Detecteert ontbrekende feiten/analyse secties"
    },
    {
      id: "missing-proof",
      label: "Bewijs", 
      severity: "high",
      description: "Controleert op bronnen en citaten"
    },
    {
      id: "missing-approval",
      label: "Beslispunten",
      severity: "high", 
      description: "Zorgt voor menselijke goedkeuring checkpoints"
    },
    {
      id: "tone-certainty",
      label: "Toon",
      severity: "medium",
      description: "Markeert zekerheidstaal"
    },
    {
      id: "privacy-risk",
      label: "Privacy",
      severity: "high",
      description: "Detecteert PII en privacy risico's"
    },
    {
      id: "format-unclear",
      label: "Output format",
      severity: "low",
      description: "Controleert output format helderheid"
    },
    {
      id: "timing-pressure",
      label: "Timing",
      severity: "medium",
      description: "Markeert urgentie-taal"
    },
    {
      id: "missing-scope",
      label: "Scope & criteria",
      severity: "high",
      description: "Zorgt voor jurisdictie en juridische criteria"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-400/50 text-red-400';
      case 'medium': return 'border-yellow-400/50 text-yellow-400';
      case 'low': return 'border-green-400/50 text-green-400';
      default: return 'border-blue-400/50 text-blue-400';
    }
  };

  const handleGeneratePrompt = async () => {
    if (!genContext.topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/functions/v1/eai-prompt-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'generate',
          context: genContext
        })
      });
      
      const data = await response.json();
      setGeneratedPrompt(data.prompt || '');
    } catch (error) {
      console.error('Error generating prompt:', error);
      setGeneratedPrompt('');
    }
    setIsGenerating(false);
  };

  const handleImprovePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/functions/v1/eai-prompt-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'improve',
          prompt,
          constraints: genContext.constraints
        })
      });
      
      const data = await response.json();
      setGeneratedPrompt(data.prompt || '');
    } catch (error) {
      console.error('Error improving prompt:', error);
      setGeneratedPrompt('');
    }
    setIsGenerating(false);
  };

  const handleSelectPreset = (preset: any) => {
    setPrompt(preset.template);
    setGenContext(prev => ({
      ...prev,
      topic: preset.title,
      constraints: `Nederlandse juridische praktijk, ${preset.tags.join(', ')}, EAI-compliant`
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">SAGA</h1>
                <p className="text-xs text-slate-300">Advanced Legal AI Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-white border-white/30">
                Backend Ready
              </Badge>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Saga Legal AI Toolkit
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete juridische AI-toolkit met EAI-compliance, praktische presets en geavanceerde analyse-tools 
            specifiek ontwikkeld voor Nederlandse advocatenpraktijk.
          </p>
        </div>

        <Tabs defaultValue="presets" className="mb-16">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Juridische Presets
            </TabsTrigger>
            <TabsTrigger value="checker" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Prompt Checker
            </TabsTrigger>
            <TabsTrigger value="generator" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Generator
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Backend Assets
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="presets" className="mt-0">
              <div className="max-h-96 overflow-y-auto">
                <SagaPromptPresets onSelectPreset={handleSelectPreset} />
              </div>
            </TabsContent>

            <TabsContent value="checker" className="mt-0">
              <SagaPromptChecker prompt={prompt} onPromptChange={setPrompt} />
            </TabsContent>

            <TabsContent value="generator" className="mt-0">
              {/* Custom Prompt Generator */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Wand2 className="w-6 h-6" />
                    Aangepaste Prompt Generator
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Genereer EAI-compliante prompts voor specifieke juridische taken
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Onderwerp/Doel"
                      value={genContext.topic}
                      onChange={(e) => setGenContext({...genContext, topic: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                    <Input
                      placeholder="Doelgroep"
                      value={genContext.audience}
                      onChange={(e) => setGenContext({...genContext, audience: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Input
                    placeholder="Output formaat"
                    value={genContext.output}
                    onChange={(e) => setGenContext({...genContext, output: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                  <Input
                    placeholder="Extra eisen"
                    value={genContext.constraints}
                    onChange={(e) => setGenContext({...genContext, constraints: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGeneratePrompt}
                      disabled={isGenerating || !genContext.topic.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? 'Genereren...' : 'Nieuwe Prompt'}
                    </Button>
                    <Button 
                      onClick={handleImprovePrompt}
                      disabled={isGenerating || !prompt.trim()}
                      variant="outline"
                      className="flex-1"
                    >
                      {isGenerating ? 'Verbeteren...' : 'Verbeter Huidige'}
                    </Button>
                  </div>
                  
                  {generatedPrompt && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-3">Gegenereerde Prompt:</h4>
                      <Textarea
                        value={generatedPrompt}
                        onChange={(e) => setGeneratedPrompt(e.target.value)}
                        className="bg-white/10 border-white/20 text-white text-sm"
                        rows={12}
                      />
                      <Button
                        onClick={() => setPrompt(generatedPrompt)}
                        className="mt-3 w-full"
                        size="sm"
                      >
                        Gebruik Deze Prompt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="mt-0">
              {/* Backend Assets Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Advice Library */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-3">
                      <Database className="w-6 h-6" />
                      Advies Bibliotheek
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Frontend-veilige tips gegroepeerd per label met backend rationale ankers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {Object.entries(adviceLibrary).map(([category, data]) => (
                        <div key={category} className="border border-white/10 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">{category}</h4>
                          <div className="space-y-1">
                            {data.chips.map((chip, index) => (
                              <div key={index} className="text-sm text-slate-300 bg-white/5 rounded px-2 py-1">
                                {chip}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detector Rules */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      Detector Regels
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Backend regex/heuristieken gekoppeld aan gewone labels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {detectorRules.map((rule) => (
                        <div key={rule.id} className="border border-white/10 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white text-sm">{rule.label}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getSeverityColor(rule.severity)}`}
                            >
                              {rule.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">{rule.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Normalizer Section */}
              <Card className="bg-white/5 border-white/10 mt-8">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Een-Klik Toepassing Normalizer
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Server-side prompt normalisatie met gestructureerde output
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Verwerkingsvolgorde</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        {["Structuur", "Scope & criteria", "Bewijs", "Beslispunten", "Output format", "Toon", "Privacy", "Timing"].map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Standaard Headers</h4>
                      <div className="space-y-1 text-sm text-slate-300">
                        <div>• Feiten (Extractie)</div>
                        <div>• Analyse (Interpretatie)</div>
                        <div>• Beslispunten — Menselijke goedkeuring vereist</div>
                        <div>• Bronnen & Actie Log</div>
                        <div>• Menselijke Review Overdracht</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Info */}
              <Card className="bg-white/5 border-white/10 mt-8">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    Integratie Klaar
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Schone backend assets met EAI veiligheidsmaatregelen onder de motorkap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Backend Output</h4>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Samenvatting met issue detectie</li>
                        <li>• Gewone label uitleg</li>
                        <li>• Advies chips per categorie</li>
                        <li>• Genormaliseerde prompt klaar</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Veiligheidsmaatregelen</h4>
                      <ul className="text-slate-400 space-y-1">
                        <li>• Geen rubric jargon zichtbaar</li>
                        <li>• Interne metrics gelogd</li>
                        <li>• Unit geteste regels</li>
                        <li>• Audit trail onderhouden</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
};

export default Saga;
