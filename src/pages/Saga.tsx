
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SagaPresetGrid from "@/components/SagaPresetGrid";
import SagaPromptChecker from "@/components/SagaPromptChecker";
import { LegalPreset } from "@/data/sagaPresets";

const Saga = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<LegalPreset | null>(null);
  const [activeTab, setActiveTab] = useState("presets");
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset: LegalPreset) => {
    setPrompt(preset.prompt_template);
    setSelectedPreset(preset);
    // Stay on presets tab when selecting a preset
    setActiveTab("presets");
  };

  const clearPrompt = () => {
    setPrompt("");
    setSelectedPreset(null);
  };

  const copyToClipboard = async () => {
    if (selectedPreset) {
      try {
        await navigator.clipboard.writeText(selectedPreset.prompt_template);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const switchToChecker = () => {
    setActiveTab("checker");
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
                <h1 className="text-xl font-semibold text-white">SAGA Legal AI</h1>
                <p className="text-xs text-slate-300">Professional Legal Prompt Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-white border-white/30">
                Professional Presets
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                Quality Enhancement
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
            Professional Legal AI Prompts
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Select from 30+ professional legal prompts designed for Dutch and EU practice, 
            or enhance your own prompts with quality standards.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm max-w-md mx-auto">
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-white/20">
              Professional Presets
            </TabsTrigger>
            <TabsTrigger value="checker" className="text-white data-[state=active]:bg-white/20">
              Prompt Enhancer
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
                        {selectedPreset.complexity && ` • ${selectedPreset.complexity}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                      <Button onClick={switchToChecker} variant="outline" size="sm">
                        Enhance Further
                      </Button>
                      <Button onClick={clearPrompt} variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedPreset.prompt_template}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    This is a complete, professional prompt ready to use with any AI assistant. 
                    Click "Copy Prompt" to use it directly, or "Enhance Further" for additional customization.
                  </div>
                </CardContent>
              </Card>
            )}

            <SagaPresetGrid onSelectPreset={handleSelectPreset} />
          </TabsContent>

          <TabsContent value="checker" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Professional Prompt Enhancement
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Transform basic prompts into comprehensive, professional legal work instructions 
                that meet quality standards and reduce liability risk. Paste your own prompt below.
              </p>
            </div>
            
            <SagaPromptChecker prompt={prompt} onPromptChange={setPrompt} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Saga;
