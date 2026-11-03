import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Gauge, Circle } from "lucide-react";
import { useMemo } from "react";
import { assessPrompt } from "@/lib/eai/certificate";
import { type TaskDensity } from "@/lib/eai/taskDensity";
import { PHASES } from "@/lib/eai/workflowPhases";
import { humanCheckpoints } from "@/lib/eai/checkpoints";

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            EAI Cockpit
          </span>
          {live && (
            <Badge variant="outline" className="text-xs font-sans">
              Score {live.score}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!live ? (
          <p className="text-sm text-muted-foreground">
            Start typing to see who does the thinking, which phase is next, and which lawyer checkpoints are still open.
          </p>
        ) : (
          <>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Work done by AI</span>
                <span>
                  {before && before.actionable > 0 && (
                    <span className="text-muted-foreground/70">{Math.round(before.value * 100)}% → </span>
                  )}
                  {live.density.actionable ? `${densityPct}% · ${live.density.label}` : "no instructions yet"}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full transition-all ${densityBarClass(live.density.label)}`} style={{ width: `${densityPct}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Process phases</span>
                <span>{live.phases.covered.length}/{PHASES.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PHASES.map((p) => {
                  const done = live.phases.covered.includes(p.id);
                  const isNext = nextPhase?.id === p.id;
                  return (
                    <span
                      key={p.id}
                      className={`text-[11px] px-2 py-1 rounded border ${done ? "border-success/40 text-success" : isNext ? "border-warning/50 text-warning" : "border-border text-muted-foreground/80"}`}
                    >
                      {p.name}
                    </span>
                  );
                })}
              </div>
              {nextPhase && <p className="text-xs text-muted-foreground">Next: {nextPhase.instruction}</p>}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Lawyer checkpoints</span>
              <ul className="space-y-1">
                {checkpoints.map((c) => (
                  <li key={c.id} className="flex items-start gap-2 text-xs">
                    {c.ok ? (
                      <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                    ) : c.id === "privacy" ? (
                      <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground/80 mt-0.5 shrink-0" />
                    )}
                    <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>
                      {c.label}
                      {!c.ok && <span className="block text-muted-foreground/80">{c.hint}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EaiCockpit;
