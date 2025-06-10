
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, CheckCircle, FileText, Scale, Shield, Users } from "lucide-react";

const Index = () => {
  const tools = [
    {
      id: "task-density",
      title: "Task-Density & Ownership Audit",
      description: "Analyse how AI and humans share cognitive work in any legal or learning task.",
      icon: Brain,
      path: "/task-density",
      color: "bg-blue-500"
    },
    {
      id: "prompt-checker",
      title: "Prompt Checker (pCheck)",
      description: "Paste any AI prompt and run a full compliance & quality check.",
      icon: CheckCircle,
      path: "/prompt-checker",
      color: "bg-green-500"
    },
    {
      id: "prompt-generator",
      title: "Prompt Generator (pGen)",
      description: "Structured scenarios for AI-assisted legal education.",
      icon: FileText,
      path: "/prompt-generator",
      color: "bg-purple-500"
    }
  ];

  const eaiConcepts = [
    "Ownership & Traceability — users can retrace and justify every step",
    "Agency Control — clear human review points; AI suggestions never final by default",
    "Task Density — measures how much real thinking is done by AI vs. human",
    "Bias & Inclusion — detects stereotyping or unfair language automatically",
    "Audit Trail — every decision is logged for EU-AI-Act compliance",
    "Output Quality — checks format, depth of reasoning, and error-handling steps",
    "Reflective Practice — prompts always include room for human reflection"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0B3C5D] rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0B3C5D]">L.E.G.I.T.</h1>
                <p className="text-sm text-gray-600">Responsible Legal-AI via the EAI Model</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[#0B3C5D] border-[#0B3C5D]">
              v1.0
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Responsible Legal-AI via the EAI Model
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            L.E.G.I.T. combines Task-Density analysis, Prompt Checking, and Prompt Generation in one auditable platform. 
            Built on the EAI Model: learning and legal work with AI remain legitimate only when human agency, ownership, and reasoning are visible.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">
              <a href="https://sites.google.com/view/eaimodel/eai-beyond-explainability?authuser=0" target="_blank" rel="noopener noreferrer">
                Learn More About EAI Model
              </a>
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={tool.path}>Start Analysis</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EAI Model Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#0B3C5D]" />
              <div>
                <CardTitle className="text-2xl">The EAI Model</CardTitle>
                <CardDescription>Transparent, didactically sound, and compliant framework for AI use</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0B3C5D]" />
                  Core Concepts
                </h4>
                <ul className="space-y-2">
                  {eaiConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-[#0B3C5D] rounded-full mt-2 flex-shrink-0"></div>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-[#0B3C5D]">Model Purpose</h4>
                <p className="text-gray-700 mb-4">
                  Provide a transparent, didactically sound, and compliant framework for AI use in legal and educational contexts.
                </p>
                <p className="text-sm text-gray-600">
                  The EAI Model ensures that human agency, ownership, and reasoning remain visible throughout AI-assisted workflows, 
                  maintaining compliance with emerging AI regulations while promoting responsible usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2025 L.E.G.I.T. | SAGA Lawyers AI & EAI Model
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#0B3C5D]">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-[#0B3C5D]">Terms</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-[#0B3C5D]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
