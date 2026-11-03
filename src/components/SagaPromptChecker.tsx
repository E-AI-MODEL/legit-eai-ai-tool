import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, Scale, Sparkles, Copy, ShieldCheck, Gauge, Circle } from "lucide-react";
import { useMemo, useState } from "react";
import ClipboardNotification from "@/components/ClipboardNotification";
import { analyzePrompt, improvePrompt, type EaiResult } from "@/lib/eai/engine";
import { assessPrompt, issueCertificate, renderCertificate, type Certificate } from "@/lib/eai/certificate";
import { estimateTaskDensity, type TaskDensity } from "@/lib/eai/taskDensity";
import { PHASES } from "@/lib/eai/workflowPhases";
import { humanCheckpoints } from "@/lib/eai/checkpoints";
import { copyWithFeedback } from "@/lib/feedback";

interface SagaPromptCheckerProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const statusIcon = (status: EaiResult["status"]) =>
  status === "pass" ? <CheckCircle className="w-4 h-4 text-success shrink-0" /> :
  status === "warning" ? <AlertTriangle className="w-4 h-4 text-warning shrink-0" /> :
  <XCircle className="w-4 h-4 text-destructive shrink-0" />;

const statusBorder = (status: EaiResult["status"]) =>
  status === "pass" ? "border-success/40" : status === "warning" ? "border-warning/40" : "border-destructive/40";

const SagaPromptChecker = ({ prompt, onPromptChange }: SagaPromptCheckerProps) => {
  const [checkResults, setCheckResults] = useState<EaiResult[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [originalDensity, setOriginalDensity] = useState<TaskDensity | null>(null);
  const [copied, setCopied] = useState(false);

  const hasText = prompt.trim().length > 0;
  // Live cockpit: recomputed on every keystroke (rules are fast and local).
  const live = useMemo(() => (hasText ? assessPrompt(prompt) : null), [prompt, hasText]);
  const checkpoints = useMemo(() => (hasText ? humanCheckpoints(prompt) : []), [prompt, hasText]);

  const processPrompt = async () => {
    if (!hasText) return;
    const results = analyzePrompt(prompt);
    const improved = improvePrompt(prompt, results);
    setCheckResults(results);
    setOriginalDensity(estimateTaskDensity(prompt));
    setCertificate(issueCertificate(improved));
    onPromptChange(improved);
    setCopied(await copyWithFeedback(improved));
  };

  const clearAll = () => {
    onPromptChange("");
    setCheckResults([]);
    setCertificate(null);
    setOriginalDensity(null);
    setCopied(false);
  };

  const passedChecks = checkResults.filter((r) => r.status === "pass").length;
  const densityPct = live ? Math.round(live.density.value * 100) : 0;
  const nextPhase = live?.phases.next;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Editor */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Your prompt
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Write or paste your prompt. The cockpit updates while you type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g. Review this NDA for a Dutch client and list the risky clauses…"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground font-mono text-sm min-h-[300px] resize-none"
            rows={15}
          />
          <div className="flex gap-2">
            {hasText && (
              <Button variant="outline" onClick={clearAll} className="gap-2">
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button
              onClick={processPrompt}
              disabled={!hasText}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Improve & Copy
            </Button>
          </div>
          {copied && certificate && (
            <p className="text-xs text-success flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Professional prompt placed above and copied to your clipboard.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Live EAI cockpit */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                EAI Cockpit
              </span>
              {live && (
                <Badge variant="outline" className="text-xs text-foreground border-border">
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
                {/* Task density */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Work done by AI</span>
                    <span>
                      {originalDensity && originalDensity.actionable > 0 && certificate && (
                        <span className="text-muted-foreground/80">{Math.round(originalDensity.value * 100)}% → </span>
                      )}
                      {live.density.actionable ? `${densityPct}% · ${live.density.label}` : "no instructions yet"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${live.density.label === "AI-heavy" ? "bg-destructive" : live.density.label === "Balanced" ? "bg-primary" : "bg-success"}`}
                      style={{ width: `${densityPct}%` }}
                    />
                  </div>
                </div>

                {/* Phases */}
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
                          className={`text-[11px] px-2 py-1 rounded border ${done ? "border-success/40 text-success" : isNext ? "border-warning/40 text-warning" : "border-border text-muted-foreground/80"}`}
                        >
                          {p.name}
                        </span>
                      );
                    })}
                  </div>
                  {nextPhase && <p className="text-xs text-muted-foreground">Next: {nextPhase.instruction}</p>}
                </div>

                {/* Human-in-the-loop checkpoints */}
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

        {/* Result after Improve */}
        {certificate && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Verification
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${certificate.verdict === "Certified" ? "text-success border-success/40" : certificate.verdict === "Conditional" ? "text-warning border-warning/40" : "text-destructive border-destructive/40"}`}
                >
                  {certificate.verdict}
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Your original prompt passed {passedChecks}/{checkResults.length} rules. Missing parts were added.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificate.reasons.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {certificate.reasons.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground/80 font-mono">{certificate.id}</span>
                <ClipboardNotification text={renderCertificate(certificate)}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Copy className="w-4 h-4" />
                    Copy Certificate
                  </Button>
                </ClipboardNotification>
              </div>
              <details className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer select-none">Rule details for your original prompt</summary>
                <div className="space-y-2 mt-3">
                  {checkResults.map((r) => (
                    <div key={r.rubric} className={`bg-card rounded-lg p-3 border ${statusBorder(r.status)}`}>
                      <div className="flex items-start gap-3">
                        {statusIcon(r.status)}
                        <div className="flex-1">
                          <span className="text-foreground font-medium text-sm">{r.rubric}</span>
                          {r.status !== "pass" && <p className="text-xs text-muted-foreground mt-1">{r.advice}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SagaPromptChecker;
