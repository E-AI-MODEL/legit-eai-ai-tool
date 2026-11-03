import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import ClipboardNotification from "@/components/ClipboardNotification";
import EaiCockpit from "@/components/eai/EaiCockpit";
import { overline } from "@/components/eai/ToolShell";
import { analyzePrompt, improvePrompt, type EaiResult } from "@/lib/eai/engine";
import { issueCertificate, renderCertificate, type Certificate } from "@/lib/eai/certificate";
import { estimateTaskDensity, type TaskDensity } from "@/lib/eai/taskDensity";
import { copyWithFeedback } from "@/lib/feedback";

interface PromptWorkbenchProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  placeholder?: string;
}

const statusClass = (status: EaiResult["status"]) =>
  status === "pass" ? "text-success" : status === "warning" ? "text-warning" : "text-destructive";
const statusWord = (status: EaiResult["status"]) => (status === "pass" ? "Pass" : status === "warning" ? "Weak" : "Missing");

export const verdictClass = (v: Certificate["verdict"]) =>
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
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <section className="space-y-4">
        <Textarea
          placeholder={placeholder ?? "E.g. Review this NDA for a Dutch client and list the risky clauses…"}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="bg-card font-mono text-sm min-h-[320px] resize-none"
          rows={15}
          maxLength={20000}
        />
        <div className="flex gap-2">
          {hasText && <Button variant="outline" onClick={clearAll}>Clear</Button>}
          <Button onClick={processPrompt} disabled={!hasText} className="flex-1">Improve & Copy</Button>
        </div>
        {copied && certificate && (
          <p className="text-xs text-success">The professional prompt is in the box and on your clipboard.</p>
        )}
      </section>

      <div className="space-y-12">
        <EaiCockpit prompt={prompt} before={certificate ? originalDensity : null} />

        {certificate && (
          <section className="border-t border-border pt-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className={overline}>Verification</p>
              <span className={`text-[10px] tracking-[0.15em] uppercase border px-2 py-1 ${verdictClass(certificate.verdict)}`}>
                {certificate.verdict}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your original passed {passedChecks} of {checkResults.length} rules. The missing parts were added.
            </p>
            {certificate.reasons.length > 0 && (
              <ul className="text-sm text-muted-foreground space-y-1">
                {certificate.reasons.map((r) => <li key={r}>{r}</li>)}
              </ul>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-muted-foreground font-mono">{certificate.id}</span>
              <ClipboardNotification text={renderCertificate(certificate)}>
                <Button variant="outline" size="sm">Copy certificate</Button>
              </ClipboardNotification>
            </div>
            <details>
              <summary className={`${overline} cursor-pointer select-none`}>Rules for your original</summary>
              <ul className="border-t border-border mt-3">
                {checkResults.map((r) => (
                  <li key={r.rubric} className="py-2.5 border-b border-border">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-foreground">{r.rubric}</span>
                      <span className={`text-[10px] tracking-[0.15em] uppercase shrink-0 ${statusClass(r.status)}`}>{statusWord(r.status)}</span>
                    </div>
                    {r.status !== "pass" && <p className="text-xs text-muted-foreground mt-1">{r.advice}</p>}
                  </li>
                ))}
              </ul>
            </details>
          </section>
        )}
      </div>
    </div>
  );
};

export default PromptWorkbench;
