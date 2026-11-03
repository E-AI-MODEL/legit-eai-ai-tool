import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PromptWorkbench from "@/components/eai/PromptWorkbench";

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/main" aria-label="Back to tools" className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <CheckCircle className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Prompt Checker</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Paste a prompt, watch the cockpit, then improve and copy.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <PromptWorkbench prompt={prompt} onPromptChange={setPrompt} placeholder="Paste or type your prompt here…" />
      </main>
    </div>
  );
};

export default PromptChecker;
