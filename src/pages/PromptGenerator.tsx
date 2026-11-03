import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wand2, Copy, ShieldCheck, BookOpen, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClipboardNotification from "@/components/ClipboardNotification";
import EaiCockpit from "@/components/eai/EaiCockpit";
import { buildPrompt } from "@/lib/eai/engine";
import { issueCertificate, renderCertificate } from "@/lib/eai/certificate";
import { copyWithFeedback } from "@/lib/feedback";
import { generatorPhases } from "@/data/generatorScenarios";

const AREAS = ["Contracts", "Litigation", "Privacy & Data", "Employment", "IP", "M&A / Corporate", "Compliance & Regulatory", "Other"];
const FORMATS = ["Memo", "Bullet list", "Table", "Checklist", "Client email"];
const NONE = "none";

const PromptGenerator = () => {
  const [task, setTask] = useState("");
  const [area, setArea] = useState<string>(NONE);
  const [format, setFormat] = useState<string>(NONE);
  const [lawyerDecides, setLawyerDecides] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { document.title = "Prompt Generator | L.E.G.I.T."; }, []);

  const certificate = useMemo(() => (result ? issueCertificate(result) : null), [result]);

  const generate = () => {
    if (!task.trim()) return;
    setResult(
      buildPrompt({
        task,
        area: area === NONE ? undefined : area,
        format: format === NONE ? undefined : format,
        lawyerDecides,
      }),
    );
    setCopied(false);
  };

  const useScenario = (key: string) => {
    const [p, s] = key.split(":").map(Number);
    const sc = generatorPhases.find((ph) => ph.number === p)?.scenarios[s];
    if (sc) { setTask(sc.prompt); setResult(null); }
  };

  const reset = () => { setTask(""); setArea(NONE); setFormat(NONE); setLawyerDecides(""); setResult(null); setCopied(false); };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/main" aria-label="Back to tools" className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Wand2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Prompt Generator</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Describe the task, pick a few options, get a certified professional prompt.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your task</CardTitle>
            <CardDescription>Only the task is required. Everything else sharpens the prompt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="scenario" className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Start from an example (optional)</Label>
              <Select onValueChange={useScenario}>
                <SelectTrigger id="scenario"><SelectValue placeholder="Choose one of 30 legal scenarios" /></SelectTrigger>
                <SelectContent className="max-h-80">
                  {generatorPhases.map((ph) => (
                    <SelectGroup key={ph.number}>
                      <SelectLabel>{ph.title}</SelectLabel>
                      {ph.scenarios.map((sc, i) => (
                        <SelectItem key={sc.name} value={`${ph.number}:${i}`}>{sc.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task">Task</Label>
              <Textarea
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                rows={6}
                placeholder="E.g. Review the liability clauses of this SaaS agreement for a Dutch buyer."
                className="font-mono text-sm bg-muted"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="area">Area of law</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger id="area"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Not specified</SelectItem>
                    {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="format">Output format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Standard sections</SelectItem>
                    {FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="decides">What do you decide yourself? (optional)</Label>
              <Input
                id="decides"
                value={lawyerDecides}
                onChange={(e) => setLawyerDecides(e.target.value)}
                placeholder="E.g. which clauses we accept"
              />
            </div>

            <div className="flex gap-2">
              {(task || result) && (
                <Button variant="outline" onClick={reset} className="gap-2">
                  <XCircle className="w-4 h-4" /> Clear
                </Button>
              )}
              <Button onClick={generate} disabled={!task.trim()} className="flex-1 gap-2">
                <Wand2 className="w-4 h-4" /> Generate prompt
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result && certificate ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Professional prompt</span>
                    <Badge variant="outline" className={`text-xs font-sans ${certificate.verdict === "Certified" ? "text-success border-success/50" : "text-warning border-warning/50"}`}>
                      {certificate.verdict} · {certificate.assessment.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <pre className="bg-muted border rounded-md p-3 font-mono text-xs whitespace-pre-wrap break-words max-h-[28rem] overflow-y-auto">{result}</pre>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={async () => setCopied(await copyWithFeedback(result))} className="gap-2 flex-1">
                      <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy prompt"}
                    </Button>
                    <ClipboardNotification text={renderCertificate(certificate)}>
                      <Button variant="outline" className="gap-2"><ShieldCheck className="w-4 h-4" /> Copy certificate</Button>
                    </ClipboardNotification>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80 font-mono">{certificate.id}</p>
                </CardContent>
              </Card>
              <EaiCockpit prompt={result} />
            </>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Your generated prompt, its score and its certificate appear here.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromptGenerator;
