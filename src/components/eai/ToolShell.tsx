import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import type { ReactNode } from "react";

export const overline = "text-[11px] tracking-[0.25em] uppercase text-muted-foreground";

interface ToolShellProps {
  label: string;
  title: string;
  back?: string;
  children: ReactNode;
}

/** Shared editorial frame for every tool page: wordmark, back link, small-caps label, serif headline. */
const ToolShell = ({ label, title, back = "/main", children }: ToolShellProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-primary" strokeWidth={1.5} />
          <span className="font-serif text-lg tracking-[0.2em] text-primary">L.E.G.I.T.</span>
        </div>
        <Link
          to={back}
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Back
        </Link>
      </div>
    </header>
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-20">
      <section className="pt-14 pb-10 sm:pt-20">
        <p className={`${overline} mb-6`}>{label}</p>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-foreground leading-[1.08]">{title}</h1>
      </section>
      {children}
    </main>
  </div>
);

export default ToolShell;
