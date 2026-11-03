import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClipboardNotification from "@/components/ClipboardNotification";
import EaiCockpit from "@/components/eai/EaiCockpit";
import ToolShell, { overline } from "@/components/eai/ToolShell";
import { verdictClass } from "@/components/eai/PromptWorkbench";
import { buildPrompt } from "@/lib/eai/engine";
import { issueCertificate, renderCertificate } from "@/lib/eai/certificate";
import { copyWithFeedback } from "@/lib/feedback";
import { generatorPhases } from "@/data/generatorScenarios";

const AREAS = ["Contracts", "Litigation", "Privacy & Data", "Employment", "IP", "M&A / Corporate", "Compliance & Regulatory", "Other"];
const FORMATS = ["Memo", "Bullet list", "Table", "Checklist", "Client email"];
const NONE = "none";
const field = `${overline} block`;

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
    setResult(buildPrompt({ task, area: area === NONE ? undefined : area, format: format === NONE ? undefined : format, lawyerDecides }));
    setCopied(false);
  };

  const pickScenario = (key: string) => {
    const [p, s] = key.split(":").map(Number);
    const sc = generatorPhases.find((ph) => ph.number === p)?.scenarios[s];
    if (sc) { setTask(sc.prompt); setResult(null); }
  };

  const reset = () => { setTask(""); setArea(NONE); setFormat(NONE); setLawyerDecides(""); setResult(null); setCopied(false); };

  return (
    <ToolShell label="Prompt Generator" title="Describe the task. Get a certified prompt.">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <section className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task" className={field}>Task</Label>
            <Textarea
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={6}
              placeholder="E.g. Review the liability clauses of this SaaS agreement for a Dutch buyer."
              className="font-mono text-sm bg-card"
            />
            <Select onValueChange={pickScenario}>
              <SelectTrigger aria-label="Start from an example" className="h-9 text-xs text-muted-foreground bg-transparent">
                <SelectValue placeholder="Or start from one of 30 examples" />
              </SelectTrigger>
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

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="area" className={field}>Area of law</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger id="area" className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Not specified</SelectItem>
                  {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format" className={field}>Output</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format" className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Standard sections</SelectItem>
                  {FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decides" className={field}>You decide</Label>
            <Input id="decides" value={lawyerDecides} onChange={(e) => setLawyerDecides(e.target.value)} placeholder="E.g. which clauses we accept" className="bg-card" />
          </div>

          <div className="flex gap-2">
            {(task || result) && <Button variant="outline" onClick={reset}>Clear</Button>}
            <Button onClick={generate} disabled={!task.trim()} className="flex-1">Generate</Button>
          </div>
        </section>

        <div className="space-y-12">
          {result && certificate ? (
            <>
              <section className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className={overline}>Professional prompt</p>
                  <span className={`text-[10px] tracking-[0.15em] uppercase border px-2 py-1 whitespace-nowrap ${verdictClass(certificate.verdict)}`}>
                    {certificate.verdict} · {certificate.assessment.score}
                  </span>
                </div>
                <pre className="bg-card border border-border p-4 font-mono text-xs whitespace-pre-wrap break-words max-h-[28rem] overflow-y-auto">{result}</pre>
                <div className="flex gap-2">
                  <Button onClick={async () => setCopied(await copyWithFeedback(result))} className="flex-1">
                    {copied ? "Copied" : "Copy prompt"}
                  </Button>
                  <ClipboardNotification text={renderCertificate(certificate)}>
                    <Button variant="outline">Certificate</Button>
                  </ClipboardNotification>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">{certificate.id}</p>
              </section>
              <EaiCockpit prompt={result} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground border-t border-border pt-6">The prompt, its score and its certificate appear here.</p>
          )}
        </div>
      </div>
    </ToolShell>
  );
};

export default PromptGenerator;
