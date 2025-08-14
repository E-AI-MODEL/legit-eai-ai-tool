
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SagaPresetGrid from "@/components/SagaPresetGrid";
import SagaPromptChecker from "@/components/SagaPromptChecker";
import { LegalPreset } from "@/data/sagaPresets";
import ClipboardNotification from "@/components/ClipboardNotification";

const Saga = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<LegalPreset | null>(null);
  const [activeTab, setActiveTab] = useState("presets");

  // Clear prompt and preset when component mounts AND unmounts
  useEffect(() => {
    // Clear any existing state on mount - prevent any forwarding from other pages
    setPrompt("");
    setSelectedPreset(null);
    setActiveTab("presets");
    
    // Clear any navigation state that might contain prompts
    if (window.history.state) {
      const cleanState = { ...window.history.state };
      delete cleanState.prompt;
      delete cleanState.generatedPrompt;
      delete cleanState.promptText;
      window.history.replaceState(cleanState, '', window.location.pathname);
    }
    
    return () => {
      // Clear state on unmount
      setPrompt("");
      setSelectedPreset(null);
      
      // Also clear any browser history state that might contain prompts
      if (window.history.state && window.history.state.prompt) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
  }, []);

  // Additional cleanup when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      setPrompt("");
      setSelectedPreset(null);
    };

    const handlePopState = () => {
      setPrompt("");
      setSelectedPreset(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectPreset = (preset: LegalPreset) => {
    setPrompt(preset.prompt_template);
    setSelectedPreset(preset);
    setActiveTab("presets");
  };

  const clearPrompt = () => {
    setPrompt("");
    setSelectedPreset(null);
  };

  const switchToChecker = () => {
    setActiveTab("checker");
  };

  // Ensure prompt is properly isolated and doesn't leak to other components
  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      {/* Simplified Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white">SAGA Legal AI</h1>
                <p className="text-xs text-slate-300 hidden sm:block">Professional Legal Prompt Platform</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link to="/" onClick={() => { setPrompt(""); setSelectedPreset(null); }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Simplified Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6">
            Professional Legal AI Prompts
          </h2>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Ready-to-use professional prompts or enhance your own with quality standards.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm max-w-md mx-auto">
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-white/20 text-sm">
              Professional Presets
            </TabsTrigger>
            <TabsTrigger value="checker" className="text-white data-[state=active]:bg-white/20 text-sm">
              Prompt Enhancer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            {selectedPreset && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{selectedPreset.label}</CardTitle>
                      <CardDescription className="text-slate-300 text-sm">
                        {selectedPreset.category} • {selectedPreset.jurisdiction} • {selectedPreset.output_format}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <ClipboardNotification text={selectedPreset.prompt_template}>
                        <Button variant="outline" size="sm">
                          Copy Prompt
                        </Button>
                      </ClipboardNotification>
                      <Button 
                        onClick={clearPrompt} 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-400 hover:text-white"
                      >
                        ×
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
                  </div>
                </CardContent>
              </Card>
            )}

            <SagaPresetGrid onSelectPreset={handleSelectPreset} />
          </TabsContent>

          <TabsContent value="checker" className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Professional Prompt Enhancement
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                Transform basic prompts into comprehensive, professional legal work instructions.
              </p>
            </div>
            
            <SagaPromptChecker prompt={prompt} onPromptChange={handlePromptChange} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Saga;
