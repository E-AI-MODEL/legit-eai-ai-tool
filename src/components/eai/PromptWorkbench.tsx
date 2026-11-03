import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle, XCircle, Scale, Sparkles, Copy, ShieldCheck } from "lucide-react";
import { useState } from "react";
import ClipboardNotification from "@/components/ClipboardNotification";
import EaiCockpit from "@/components/eai/EaiCockpit";
import { analyzePrompt, improvePrompt, type EaiResult } from "@/lib/eai/engine";
import { issueCertificate, renderCertificate, type Certificate } from "@/lib/eai/certificate";
import { estimateTaskDensity, type TaskDensity } from "@/lib/eai/taskDensity";
import { copyWithFeedback } from "@/lib/feedback";

interface PromptWorkbenchProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  placeholder?: string;
}

const statusIcon = (status: EaiResult["status"]) =>
  status === "pass" ? <CheckCircle className="w-4 h-4 text-success shrink-0" /> :
  status === "warning" ? <AlertTriangle className="w-4 h-4 text-warning shrink-0" /> :
  <XCircle className="w-4 h-4 text-destructive shrink-0" />;

const statusBorder = (status: EaiResult["status"]) =>
  status === "pass" ? "border-success/40" : status === "warning" ? "border-warning/40" : "border-destructive/40";

const verdictClass = (v: Certificate["verdict"]) =>
  v === "Certified" ? "text-success border-success/50" : v === "Conditional" ? "text-warning border-warning/50" : "text-destructive border-destructive/50";

/** Write → live cockpit → one "Improve & Copy" → certificate. Used by the hidden library section and the Prompt Checker. */
const PromptWorkbench = ({ prompt, onPromptChange, placeholder }: PromptWorkbenchProps) => {
  const [checkResults, setCheckResults] = useState<EaiResult[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [originalDensity, setOriginalDensity] = useState<TaskDensity | null>(null);
  const [copied, setCopied] = useState(false);

  const hasText = prompt.trim().length > 0;

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

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Your prompt
          </CardTitle>
          <CardDescription>Write or paste your prompt. The cockpit updates while you type.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={placeholder ?? "E.g. Review this NDA for a Dutch client and list the risky clauses…"}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="bg-muted border-border font-mono text-sm min-h-[300px] resize-none"
            rows={15}
            maxLength={20000}
          />
          <div className="flex gap-2">
            {hasText && (
              <Button variant="outline" onClick={clearAll} className="gap-2">
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button onClick={processPrompt} disabled={!hasText} className="flex-1">
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
        <EaiCockpit prompt={prompt} before={certificate ? originalDensity : null} />

        {certificate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Verification
                </span>
                <Badge variant="outline" className={`text-xs font-sans ${verdictClass(certificate.verdict)}`}>
                  {certificate.verdict}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
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
                          <span className="font-medium text-sm">{r.rubric}</span>
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

export default PromptWorkbench;
