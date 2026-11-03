
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SagaPresetGrid from "@/components/SagaPresetGrid";
import PromptWorkbench from "@/components/eai/PromptWorkbench";
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
    <div className="min-h-screen bg-background">
      {/* Simplified Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">SAGA Legal AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Professional Legal Prompt Platform</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:bg-muted">
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
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-6">
            Professional Legal AI Prompts
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready-to-use professional prompts or enhance your own with quality standards.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-muted max-w-md mx-auto">
            <TabsTrigger value="presets" className="text-foreground data-[state=active]:bg-card text-sm">
              Professional Presets
            </TabsTrigger>
            <TabsTrigger value="checker" className="text-foreground data-[state=active]:bg-card text-sm">
              Prompt Enhancer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            {selectedPreset && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground text-lg">{selectedPreset.label}</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
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
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-card rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedPreset.prompt_template}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    This is a complete, professional prompt ready to use with any AI assistant.
                  </div>
                </CardContent>
              </Card>
            )}

            <SagaPresetGrid onSelectPreset={handleSelectPreset} />
          </TabsContent>

          <TabsContent value="checker" className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Professional Prompt Enhancement
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Transform basic prompts into comprehensive, professional legal work instructions.
              </p>
            </div>
            
            <PromptWorkbench prompt={prompt} onPromptChange={handlePromptChange} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Saga;
