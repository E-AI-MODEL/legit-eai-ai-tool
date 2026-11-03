import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Brain, FileCheck, Wand2, Scale, ArrowRight, Shield, BookOpen } from "lucide-react";
import { useDoubleTap } from "@/hooks/use-double-tap";

const Main = () => {
  const navigate = useNavigate();
  const openSaga = useCallback(() => navigate("/lp-ai-x9k3m7"), [navigate]);
  const handleLogoTap = useDoubleTap(openSaga);

  const tools = [
    {
      title: "Task Density & Ownership Audit",
      description: "Analyze AI task distribution and human oversight in legal workflows. Ensure proper balance between AI assistance and human control.",
      icon: Brain,
      path: "/task-density",
      category: "EAI Analysis",
    },
    {
      title: "Prompt Checker",
      description: "Validate and analyze AI prompts for legal compliance, bias detection, and ethical considerations in legal practice.",
      icon: FileCheck,
      path: "/prompt-checker",
      category: "EAI Compliance",
    },
    {
      title: "Prompt Generator",
      description: "Generate ethically-compliant prompts for legal AI applications with built-in safeguards and best practices.",
      icon: Wand2,
      path: "/prompt-generator",
      category: "EAI Tools",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogoTap}
                aria-label="L.E.G.I.T. logo"
                className="flex items-center gap-2 select-none focus:outline-none"
                style={{ touchAction: "manipulation" }}
              >
                <Scale className="w-8 h-8 text-primary" />
                <Shield className="w-6 h-6 text-primary" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary">L.E.G.I.T.</h1>
                <p className="text-sm text-muted-foreground">Legal Guidance for Integrity and Transparency</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>EAI & Legal Tools</span>
              </div>
              {/* Secret V1.0 Button */}
              <Button asChild variant="ghost" size="sm" className="opacity-20 hover:opacity-100 transition-opacity">
                <Link to="/lp-ai-x9k3m7">V1.0</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ethical AI Tools for Legal Practice
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive suite of tools designed to ensure responsible AI adoption in legal workflows, 
            with focus on transparency, accountability, and ethical compliance.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Ethical Compliance</h3>
            <p className="text-muted-foreground text-sm">Built-in safeguards and ethical guidelines for AI use in legal contexts</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-success/15 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Scale className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Legal Standards</h3>
            <p className="text-muted-foreground text-sm">Aligned with professional legal standards and regulatory requirements</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Transparency</h3>
            <p className="text-muted-foreground text-sm">Clear visibility into AI decision-making processes and human oversight</p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Available Tools</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-primary flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                    {tool.description}
                  </CardDescription>
                  <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                    <Link to={tool.path} className="flex items-center justify-center gap-2">
                      Launch Tool
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-card border-t">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Enhance Your Legal AI Practice?
          </h3>
          <p className="text-muted-foreground mb-6">
            Choose a tool above to begin analyzing and improving your AI-assisted legal workflows
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/task-density">
                Start with Task Density Audit
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/prompt-checker">
                Check Your Prompts
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
