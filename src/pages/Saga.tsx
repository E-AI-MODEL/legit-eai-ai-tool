import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Scale, X } from "lucide-react";
import { useState, useEffect } from "react";
import SagaPresetGrid from "@/components/SagaPresetGrid";
import PromptWorkbench from "@/components/eai/PromptWorkbench";
import { LegalPreset } from "@/data/sagaPresets";
import ClipboardNotification from "@/components/ClipboardNotification";

type View = "library" | "enhance";

/** Hidden section (reached by double-tapping the logo). Its internal name is never shown in the UI. */
const Saga = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<LegalPreset | null>(null);
  const [view, setView] = useState<View>("library");

  // Start clean and never carry prompts in from or out to other pages.
  useEffect(() => {
    if (window.history.state) {
      const cleanState = { ...window.history.state };
      delete cleanState.prompt;
      delete cleanState.generatedPrompt;
      delete cleanState.promptText;
      window.history.replaceState(cleanState, "", window.location.pathname);
    }
    const reset = () => {
      setPrompt("");
      setSelectedPreset(null);
    };
    window.addEventListener("popstate", reset);
    return () => {
      window.removeEventListener("popstate", reset);
      reset();
    };
  }, []);

  const handleSelectPreset = (preset: LegalPreset) => {
    setSelectedPreset(preset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabClass = (active: boolean) =>
    `pb-3 text-[11px] tracking-[0.25em] uppercase border-b transition-colors ${
      active ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg tracking-[0.2em] text-primary">L.E.G.I.T.</span>
          </div>
          <Link
            to="/main"
            className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6">
        <section className="pt-14 pb-10 sm:pt-20 sm:pb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-6">Private library</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-foreground leading-[1.08]">
            Prompts for practice.
          </h1>
        </section>

        <nav className="flex gap-8 border-b border-border mb-10">
          <button type="button" onClick={() => setView("library")} className={tabClass(view === "library")}>
            Library
          </button>
          <button type="button" onClick={() => setView("enhance")} className={tabClass(view === "enhance")}>
            Enhance
          </button>
        </nav>

        {view === "library" ? (
          <div className="space-y-12 pb-20">
            {selectedPreset && (
              <section className="border border-border bg-card">
                <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                      Copied · {selectedPreset.jurisdiction} · {selectedPreset.output_format}
                    </p>
                    <h2 className="font-serif text-xl text-foreground mt-1 leading-snug">{selectedPreset.label}</h2>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <ClipboardNotification text={selectedPreset.prompt_template}>
                      <button
                        type="button"
                        aria-label="Copy prompt"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </ClipboardNotification>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setSelectedPreset(null)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <pre className="p-5 max-h-96 overflow-y-auto text-[13px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedPreset.prompt_template}
                </pre>
              </section>
            )}

            <SagaPresetGrid onSelectPreset={handleSelectPreset} />
          </div>
        ) : (
          <div className="pb-20">
            <PromptWorkbench prompt={prompt} onPromptChange={setPrompt} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Saga;
