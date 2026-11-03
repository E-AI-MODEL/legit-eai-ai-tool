import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Copy, ListPlus, ScanText, Trash2, Undo2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { densityBarClass } from "@/components/eai/EaiCockpit";
import {
  classifyUnits,
  densityFromSteps,
  takeBackAdvice,
  TD_THRESHOLDS,
  type Performer,
  type WorkStep,
} from "@/lib/eai/taskDensity";
import { copyWithFeedback } from "@/lib/feedback";

const PERFORMER_LABEL: Record<Performer, string> = { human: "Lawyer", ai: "AI", shared: "Both" };
const EFFORT_LABEL: Record<number, string> = { 1: "Light", 2: "Normal", 3: "Heavy" };

const TaskDensity = () => {
  const [mode, setMode] = useState("prompt");
  const [promptText, setPromptText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [steps, setSteps] = useState<WorkStep[]>([]);

  const density = useMemo(() => densityFromSteps(steps), [steps]);
  const advice = useMemo(() => takeBackAdvice(steps), [steps]);
  const pct = Math.round(density.value * 100);

  const fromPrompt = () => setSteps(classifyUnits(promptText).map((s) => ({ ...s, effort: 2 })));
  const fromList = () =>
    setSteps(
      stepsText
        .split("\n")
        .map((l) => l.replace(/^\s*[-•*\d.)]+\s*/, "").trim())
        .filter(Boolean)
        .map((text) => ({ text, performer: "ai" as Performer, effort: 2 })),
    );

  const update = (i: number, patch: Partial<WorkStep>) => setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => setSteps((prev) => prev.filter((_, j) => j !== i));
  const applyAdvice = () => setSteps((prev) => prev.map((s, j) => (advice.includes(j) ? { ...s, performer: "human" } : s)));
  const reset = () => { setSteps([]); setPromptText(""); setStepsText(""); };

  const auditText = () =>
    [
      "Task Density Audit",
      `Date: ${new Date().toISOString().slice(0, 10)}`,
      `Task density: ${pct}% AI (${density.label})`,
      `Thresholds: below ${TD_THRESHOLDS.humanLed * 100}% human-led, below ${TD_THRESHOLDS.balanced * 100}% balanced`,
      "Steps:",
      ...steps.map((s, i) => `${i + 1}. [${PERFORMER_LABEL[s.performer]} · ${EFFORT_LABEL[s.effort]}] ${s.text}`),
      ...(advice.length ? ["Take back:", ...advice.map((i) => `- ${steps[i].text}`)] : []),
      "Assessed by rules; the lawyer decides the final split of work.",
    ].join("\n");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/main" aria-label="Back to tools" className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Task Density Audit</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">See who does the thinking, and which step to take back.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your task</CardTitle>
            <CardDescription>Paste a prompt, or list the steps of the work yourself.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={setMode} className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="prompt">From a prompt</TabsTrigger>
                <TabsTrigger value="steps">Describe steps</TabsTrigger>
              </TabsList>
              <TabsContent value="prompt" className="space-y-3">
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={9}
                  placeholder="Paste the prompt you plan to give the AI…"
                  className="font-mono text-sm bg-muted"
                />
                <Button onClick={fromPrompt} disabled={!promptText.trim()} className="w-full gap-2">
                  <ScanText className="w-4 h-4" /> Find the steps
                </Button>
              </TabsContent>
              <TabsContent value="steps" className="space-y-3">
                <Textarea
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  rows={9}
                  placeholder={"One step per line, e.g.\nIdentify the legal issues\nResearch case law\nDraft the advice\nCheck sources"}
                  className="font-mono text-sm bg-muted"
                />
                <Button onClick={fromList} disabled={!stepsText.trim()} className="w-full gap-2">
                  <ListPlus className="w-4 h-4" /> Use these steps
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between gap-2">
                <span>Who does what</span>
                {steps.length > 0 && <Badge variant="outline" className="text-xs font-sans">{pct}% AI · {density.label}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {mode === "prompt" && promptText.trim()
                    ? "No instructions found yet. Try sentences like “Draft…”, “List…” or “I will…”."
                    : "Your steps appear here. Adjust who does each step and how heavy it is."}
                </p>
              ) : (
                <>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full transition-all ${densityBarClass(density.label)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <ul className="space-y-2">
                    {steps.map((s, i) => (
                      <li key={i} className={`rounded-md border p-2.5 space-y-2 ${advice.includes(i) ? "border-warning/50 bg-warning/5" : ""}`}>
                        <div className="flex items-start gap-2">
                          <span className="text-sm flex-1">{s.text}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Remove step" onClick={() => remove(i)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select value={s.performer} onValueChange={(v) => update(i, { performer: v as Performer })}>
                            <SelectTrigger className="h-8 text-xs" aria-label="Who does this step"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(Object.keys(PERFORMER_LABEL) as Performer[]).map((p) => <SelectItem key={p} value={p}>{PERFORMER_LABEL[p]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Select value={String(s.effort)} onValueChange={(v) => update(i, { effort: Number(v) })}>
                            <SelectTrigger className="h-8 text-xs" aria-label="How heavy is this step"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3].map((e) => <SelectItem key={e} value={String(e)}>{EFFORT_LABEL[e]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {steps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {advice.length ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      The AI does most of the thinking. Take back {advice.length === 1 ? "this step" : `these ${advice.length} steps`} to keep the work in your hands:
                    </p>
                    <ul className="text-sm space-y-1">
                      {advice.map((i) => <li key={i}>• {steps[i].text}</li>)}
                    </ul>
                    <Button variant="outline" onClick={applyAdvice} className="gap-2 w-full">
                      <Undo2 className="w-4 h-4" /> I take these steps back
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {density.label === "Human-led"
                      ? "You do most of the thinking. The AI only supports."
                      : "The work is balanced. Keep the final decision and the source check with you."}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset} className="gap-2"><XCircle className="w-4 h-4" /> Clear</Button>
                  <Button onClick={() => copyWithFeedback(auditText())} className="gap-2 flex-1"><Copy className="w-4 h-4" /> Copy audit</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskDensity;
