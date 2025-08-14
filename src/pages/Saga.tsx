
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, Shield, Brain, Database, Zap } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SagaPresetGrid from "@/components/SagaPresetGrid";
import SagaPromptChecker from "@/components/SagaPromptChecker";
import { LegalPreset } from "@/data/sagaPresets";

const Saga = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<LegalPreset | null>(null);

  const handleSelectPreset = (preset: LegalPreset) => {
    setPrompt(preset.prompt_template);
    setSelectedPreset(preset);
  };

  const clearPrompt = () => {
    setPrompt("");
    setSelectedPreset(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                30 Legal Presets
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                Quality Gates
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
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            Saga Legal AI Toolkit
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Professionele juridische AI-toolkit met 30 praktische presets, geavanceerde kwaliteitscontroles 
            en EAI-compliance voor Nederlandse advocatenpraktijk.
          </p>
        </div>

        <Tabs defaultValue="presets" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm max-w-md mx-auto">
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-white/20">
              Legal Presets
            </TabsTrigger>
            <TabsTrigger value="checker" className="text-white data-[state=active]:bg-white/20">
              Prompt Checker
            </TabsTrigger>
            <TabsTrigger value="backend" className="text-white data-[state=active]:bg-white/20">
              Backend Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            {/* Current Selection */}
            {selectedPreset && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedPreset.label}</CardTitle>
                      <CardDescription className="text-slate-300">
                        {selectedPreset.category} • {selectedPreset.jurisdiction} • {selectedPreset.output_format}
                      </CardDescription>
                    </div>
                    <Button onClick={clearPrompt} variant="outline" size="sm">
                      Wis Selectie
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )}

            <SagaPresetGrid onSelectPreset={handleSelectPreset} />
          </TabsContent>

          <TabsContent value="checker" className="space-y-6">
            <SagaPromptChecker prompt={prompt} onPromptChange={setPrompt} />
          </TabsContent>

          <TabsContent value="backend" className="space-y-6">
            {/* Quality Gates Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Kwaliteitscontroles
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Zes kwaliteitspoorten die elke prompt verbeteren
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      gate: "Structuur",
                      description: "Zorgt voor 'Facts (Extract)' + 'Analysis (Interpretation)' secties",
                      priority: "Hoog"
                    },
                    {
                      gate: "Bewijs",
                      description: "Vereist bronnenlijst en actie-logging voor traceerbaarheid", 
                      priority: "Hoog"
                    },
                    {
                      gate: "Menselijke Controle",
                      description: "Voegt verplichte beslispunten en goedkeuring toe",
                      priority: "Hoog"
                    },
                    {
                      gate: "Toon & Privacy",
                      description: "Verwijdert zekerheids-taal, voegt privacy-bescherming toe",
                      priority: "Medium"
                    },
                    {
                      gate: "Output Helderheid",
                      description: "Specificeert exact output formaat en structuur",
                      priority: "Medium"
                    },
                    {
                      gate: "Reflectie",
                      description: "Vereist inzichten, vragen en overdracht-checklijst",
                      priority: "Medium"
                    }
                  ].map((gate, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">Poort {index + 1}: {gate.gate}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${gate.priority === 'Hoog' ? 'text-red-400 border-red-400/50' : 'text-yellow-400 border-yellow-400/50'}`}
                        >
                          {gate.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{gate.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Assets */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Database className="w-6 h-6" />
                    Preset Categorieën
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    15 categorieën juridische templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      "Contracts", "Transactions", "Disputes", "Investigations", 
                      "Privacy", "Employment", "IP", "Commercial",
                      "ESG", "Compliance", "Client Comms", "Research",
                      "Regulatory", "Risk", "Policy"
                    ].map((category) => (
                      <div key={category} className="text-slate-300 bg-white/5 rounded px-2 py-1">
                        {category}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    EAI Compliance
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Ingebouwde ethische AI-waarborgen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>• Helderheid: jargon-vrije communicatie</div>
                    <div>• Keuzebewustzijn: altijd alternatieven</div>
                    <div>• Technische integriteit: gestructureerd</div>
                    <div>• Menselijke controle: beslispunten</div>
                    <div>• Privacy: PII-bescherming</div>
                    <div>• Traceerbaarheid: bronnen + logging</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Backend Endpoints */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Backend Endpoints
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Ready-to-use API integraties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">POST /functions/v1/eai-prompt-suggest</h4>
                    <p className="text-sm text-slate-400 mb-2">
                      Genereert geoptimaliseerde prompts op basis van context
                    </p>
                    <div className="text-xs text-slate-500">
                      Input: {`{ mode: 'generate'|'improve', context: {...} }`}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">POST /functions/v1/eai-semantic-check</h4>
                    <p className="text-sm text-slate-400 mb-2">
                      Analyseert en verbetert prompts met kwaliteitscontroles
                    </p>
                    <div className="text-xs text-slate-500">
                      Output: {`{ summary, issues[], normalized_prompt }`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Saga;
