import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ArrowUpRight, Scale } from "lucide-react";
import { useDoubleTap } from "@/hooks/use-double-tap";

const tools = [
  { no: "01", title: "Task Density Audit", line: "Who does the thinking.", path: "/task-density" },
  { no: "02", title: "Prompt Checker", line: "Test a prompt against EAI rules.", path: "/prompt-checker" },
  { no: "03", title: "Prompt Generator", line: "Build a certified prompt.", path: "/prompt-generator" },
];

const principles = [
  { title: "Integrity", line: "Safeguards by design" },
  { title: "Standards", line: "Professional and regulatory" },
  { title: "Transparency", line: "Human oversight, always" },
];

const Main = () => {
  const navigate = useNavigate();
  const openSaga = useCallback(() => navigate("/lp-ai-x9k3m7"), [navigate]);
  const handleLogoTap = useDoubleTap(openSaga);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogoTap}
            aria-label="L.E.G.I.T. logo"
            className="flex items-center gap-3 select-none focus:outline-none"
            style={{ touchAction: "manipulation" }}
          >
            <Scale className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg tracking-[0.2em] text-primary">L.E.G.I.T.</span>
          </button>
          <Link
            to="/lp-ai-x9k3m7"
            className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground opacity-20 hover:opacity-100 transition-opacity"
          >
            V1.0
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6">
        <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
            Ethical AI for legal practice
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-foreground leading-[1.05] max-w-3xl">
            The lawyer decides.
            <span className="block text-muted-foreground">AI assists.</span>
          </h1>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 border-t border-border">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className={`py-6 sm:pr-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-border sm:pl-6" : ""}`}
            >
              <h2 className="font-serif text-lg text-foreground">{p.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{p.line}</p>
            </div>
          ))}
        </section>

        <section className="pt-14 pb-20">
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">Tools</p>
          <ul className="border-t border-border">
            {tools.map((t) => (
              <li key={t.path} className="border-b border-border">
                <Link
                  to={t.path}
                  className="group flex items-center gap-5 py-6 focus:outline-none focus-visible:bg-accent"
                >
                  <span className="font-mono text-xs text-muted-foreground w-6 shrink-0">{t.no}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-serif text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                      {t.title}
                    </span>
                    <span className="block text-sm text-muted-foreground mt-0.5">{t.line}</span>
                  </span>
                  <ArrowUpRight
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto w-full px-6 py-6 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          Legal Guidance for Integrity and Transparency
        </div>
      </footer>
    </div>
  );
};

export default Main;
