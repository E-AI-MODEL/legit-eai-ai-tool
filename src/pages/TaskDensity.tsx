import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { densityBarClass } from "@/components/eai/EaiCockpit";
import { classifyUnits, densityFromSteps, takeBackAdvice, TD_THRESHOLDS, type Performer, type WorkStep } from "@/lib/eai/taskDensity";
import { humanCheckpoints } from "@/lib/eai/checkpoints";
import { copyWithFeedback } from "@/lib/feedback";

const LABEL: Record<Performer, string> = { human: "Lawyer", shared: "Both", ai: "AI" };
const NEXT: Record<Performer, Performer> = { ai: "shared", shared: "human", human: "ai" };
const CHIP: Record<Performer, string> = {
  human: "text-success border-success/40",
  shared: "text-primary border-primary/40",
  ai: "text-destructive border-destructive/40",
};

const VERDICT = {
  "Human-led": "You do the thinking. The AI supports.",
  Balanced: "Shared work. Keep the final decision and the source check with you.",
  "AI-heavy": "The AI does most of the thinking. Take back the marked steps.",
} as const;

const overline = "text-[11px] tracking-[0.25em] uppercase text-muted-foreground";

const TaskDensity = () => {
  const [text, setText] = useState("");
  const [analysed, setAnalysed] = useState("");
  const [steps, setSteps] = useState<WorkStep[] | null>(null);

  const density = useMemo(() => densityFromSteps(steps ?? []), [steps]);
  const advice = useMemo(() => takeBackAdvice(steps ?? []), [steps]);
  const openChecks = useMemo(() => (analysed ? humanCheckpoints(analysed).filter((c) => !c.ok) : []), [analysed]);
  const pct = Math.round(density.value * 100);

  const analyse = () => {
    setAnalysed(text);
    setSteps(classifyUnits(text));
  };
  const cycle = (i: number) => setSteps((prev) => prev && prev.map((s, j) => (j === i ? { ...s, performer: NEXT[s.performer] } : s)));
  const takeBack = () => setSteps((prev) => prev && prev.map((s, j) => (advice.includes(j) ? { ...s, performer: "human" } : s)));
  const clear = () => { setText(""); setAnalysed(""); setSteps(null); };

  const auditText = () =>
    [
      "Task Density Audit",
      `Date: ${new Date().toISOString().slice(0, 10)}`,
      `Work done by AI: ${pct}% (${density.label})`,
      `Thresholds: below ${TD_THRESHOLDS.humanLed * 100}% human-led, below ${TD_THRESHOLDS.balanced * 100}% balanced`,
      "Steps:",
      ...(steps ?? []).map((s, i) => `${i + 1}. [${LABEL[s.performer]}] ${s.text}`),
      ...(advice.length ? ["Take back:", ...advice.map((i) => `- ${steps![i].text}`)] : []),
      ...(openChecks.length ? ["Open checkpoints:", ...openChecks.map((c) => `- ${c.label}: ${c.hint}`)] : []),
      "Assessed by fixed rules; the lawyer decides the final split of work.",
    ].join("\n");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg tracking-[0.2em] text-primary">L.E.G.I.T.</span>
          </div>
          <Link to="/main" className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-20">
        <section className="pt-14 pb-10 sm:pt-20">
          <p className={`${overline} mb-6`}>Task Density Audit</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-foreground leading-[1.08]">Who does the thinking?</h1>
        </section>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <section className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder={"Paste your prompt, or one step per line:\nResearch case law\nDraft the advice\nI check the sources"}
              className="font-mono text-sm bg-card min-h-[240px]"
            />
            <div className="flex gap-2">
              {text && <Button variant="outline" onClick={clear}>Clear</Button>}
              <Button onClick={analyse} disabled={!text.trim()} className="flex-1">Analyse</Button>
            </div>
          </section>

          <section>
            {!steps ? (
              <p className="text-sm text-muted-foreground border-t border-border pt-6">
                The analysis shows how much of the thinking the AI does, which steps to take back, and which lawyer checkpoints are still open.
              </p>
            ) : steps.length === 0 ? (
              <p className="text-sm text-muted-foreground border-t border-border pt-6">
                No work steps found. Start lines with a task, such as "Draft…", "Research…" or "I review…".
              </p>
            ) : (
              <div className="space-y-10">
                <div className="border-t border-border pt-6">
                  <p className={overline}>Work done by AI</p>
                  <div className="flex items-baseline gap-4 mt-2">
                    <span className="font-serif text-6xl text-foreground">{pct}%</span>
                    <span className="text-sm text-muted-foreground">{density.label}</span>
                  </div>
                  <div className="h-1 bg-muted mt-4 overflow-hidden">
                    <div className={`h-full transition-all ${densityBarClass(density.label)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-sm text-foreground mt-4">{VERDICT[density.label]}</p>
                  <dl className="grid grid-cols-3 border-y border-border mt-6">
                    {(["human", "shared", "ai"] as Performer[]).map((p, i) => (
                      <div key={p} className={`py-3 ${i ? "border-l border-border pl-4" : ""}`}>
                        <dt className={overline}>{LABEL[p]}</dt>
                        <dd className="font-serif text-2xl text-foreground mt-1">{steps.filter((s) => s.performer === p).length}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <p className={overline}>Steps</p>
                    <p className="text-[11px] text-muted-foreground">Tap a label to correct it</p>
                  </div>
                  <ol className="border-t border-border">
                    {steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-4 py-3 border-b border-border">
                        <span className="font-mono text-xs text-muted-foreground w-6 shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`flex-1 text-sm ${advice.includes(i) ? "text-warning" : "text-foreground"}`}>{s.text}</span>
                        <button
                          type="button"
                          onClick={() => cycle(i)}
                          aria-label={`Done by ${LABEL[s.performer]}. Tap to change.`}
                          className={`shrink-0 w-16 text-center text-[10px] tracking-[0.15em] uppercase border py-1 transition-colors ${CHIP[s.performer]}`}
                        >
                          {LABEL[s.performer]}
                        </button>
                      </li>
                    ))}
                  </ol>
                  {advice.length > 0 && (
                    <Button variant="outline" onClick={takeBack} className="w-full mt-4">
                      I take {advice.length === 1 ? "this step" : `these ${advice.length} steps`} back
                    </Button>
                  )}
                </div>

                {openChecks.length > 0 && (
                  <div>
                    <p className={`${overline} mb-2`}>Open checkpoints</p>
                    <ul className="border-t border-border">
                      {openChecks.map((c) => (
                        <li key={c.id} className="py-3 border-b border-border">
                          <span className="block text-sm text-foreground">{c.label}</span>
                          <span className="block text-sm text-muted-foreground">{c.hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={() => copyWithFeedback(auditText())} className="w-full">Copy audit</Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default TaskDensity;
