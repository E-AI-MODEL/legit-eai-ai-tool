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
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Prompt Checker",
      description: "Validate and analyze AI prompts for legal compliance, bias detection, and ethical considerations in legal practice.",
      icon: FileCheck,
      path: "/prompt-checker",
      category: "EAI Compliance",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Prompt Generator",
      description: "Generate ethically-compliant prompts for legal AI applications with built-in safeguards and best practices.",
      icon: Wand2,
      path: "/prompt-generator",
      category: "EAI Tools",
      color: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
                <Scale className="w-8 h-8 text-[#0B3C5D]" />
                <Shield className="w-6 h-6 text-[#0B3C5D]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#0B3C5D]">L.E.G.I.T.</h1>
                <p className="text-sm text-gray-600">Legal Guidance for Integrity and Transparency</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ethical AI Tools for Legal Practice
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive suite of tools designed to ensure responsible AI adoption in legal workflows, 
            with focus on transparency, accountability, and ethical compliance.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ethical Compliance</h3>
            <p className="text-gray-600 text-sm">Built-in safeguards and ethical guidelines for AI use in legal contexts</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Scale className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Legal Standards</h3>
            <p className="text-gray-600 text-sm">Aligned with professional legal standards and regulatory requirements</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Transparency</h3>
            <p className="text-gray-600 text-sm">Clear visibility into AI decision-making processes and human oversight</p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Available Tools</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-gray-900 group-hover:text-[#0B3C5D] transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {tool.description}
                  </CardDescription>
                  <Button asChild className="w-full group-hover:bg-[#0B3C5D] transition-colors">
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
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Enhance Your Legal AI Practice?
          </h3>
          <p className="text-gray-600 mb-6">
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
