import { useMemo } from "react";
import { assessPrompt } from "@/lib/eai/certificate";
import { type TaskDensity } from "@/lib/eai/taskDensity";
import { PHASES } from "@/lib/eai/workflowPhases";
import { humanCheckpoints } from "@/lib/eai/checkpoints";
import { overline } from "@/components/eai/ToolShell";

interface EaiCockpitProps {
  prompt: string;
  /** Density of the prompt before it was improved, shown as "before → now". */
  before?: TaskDensity | null;
}

export const densityBarClass = (label: TaskDensity["label"]) =>
  label === "AI-heavy" ? "bg-destructive" : label === "Balanced" ? "bg-primary" : "bg-success";

/** Live EAI cockpit: who does the thinking, which phase is next, which lawyer checkpoints are open. */
const EaiCockpit = ({ prompt, before }: EaiCockpitProps) => {
  const hasText = prompt.trim().length > 0;
  const live = useMemo(() => (hasText ? assessPrompt(prompt) : null), [prompt, hasText]);
  const checkpoints = useMemo(() => (hasText ? humanCheckpoints(prompt) : []), [prompt, hasText]);
  const densityPct = live ? Math.round(live.density.value * 100) : 0;
  const nextPhase = live?.phases.next;

  return (
    <section className="border-t border-border pt-6 space-y-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className={overline}>EAI Cockpit</p>
        {live && <span className="font-mono text-xs text-muted-foreground">Score {live.score}/100</span>}
      </div>

      {!live ? (
        <p className="text-sm text-muted-foreground">Start typing. The cockpit shows who does the thinking, the next phase and the open checkpoints.</p>
      ) : (
        <>
          <div>
            <p className={overline}>Work done by AI</p>
            <div className="flex items-baseline gap-3 mt-2">
              {before && before.actionable > 0 && (
                <span className="font-serif text-2xl text-muted-foreground">{Math.round(before.value * 100)}% →</span>
              )}
              <span className="font-serif text-4xl text-foreground">{live.density.actionable ? `${densityPct}%` : "—"}</span>
              <span className="text-sm text-muted-foreground">{live.density.actionable ? live.density.label : "No instructions yet"}</span>
            </div>
            <div className="h-1 bg-muted mt-3 overflow-hidden">
              <div className={`h-full transition-all ${densityBarClass(live.density.label)}`} style={{ width: `${densityPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className={overline}>Phases</p>
              <span className="font-mono text-xs text-muted-foreground">{live.phases.covered.length}/{PHASES.length}</span>
            </div>
            <ol className="border-t border-border">
              {PHASES.map((p, i) => {
                const done = live.phases.covered.includes(p.id);
                const isNext = nextPhase?.id === p.id;
                return (
                  <li key={p.id} className="flex items-center gap-4 py-2.5 border-b border-border text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 ${done ? "text-foreground" : "text-muted-foreground"}`}>{p.name}</span>
                    <span className={`text-[10px] tracking-[0.15em] uppercase ${done ? "text-success" : isNext ? "text-warning" : "text-muted-foreground/70"}`}>
                      {done ? "Covered" : isNext ? "Next" : "Open"}
                    </span>
                  </li>
                );
              })}
            </ol>
            {nextPhase && <p className="text-sm text-muted-foreground mt-3">{nextPhase.instruction}</p>}
          </div>

          <div>
            <p className={`${overline} mb-2`}>Lawyer checkpoints</p>
            <ul className="border-t border-border">
              {checkpoints.map((c) => (
                <li key={c.id} className="py-2.5 border-b border-border">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                    <span
                      className={`text-[10px] tracking-[0.15em] uppercase ${c.ok ? "text-success" : c.id === "privacy" ? "text-destructive" : "text-muted-foreground/70"}`}
                    >
                      {c.ok ? "Closed" : "Open"}
                    </span>
                  </div>
                  {!c.ok && <p className="text-xs text-muted-foreground mt-1">{c.hint}</p>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default EaiCockpit;
