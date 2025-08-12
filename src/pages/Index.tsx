
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
      description: "Structured scenarios for AI-assisted legal practice.",
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-normal text-black">L.E.G.I.T.</h1>
                <p className="text-xs text-gray-500">Responsible Legal-AI via the EAI Model</p>
              </div>
            </div>
            <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs">
              v1.0
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-6">
            Responsible Legal-AI via the EAI Model
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            L.E.G.I.T. combines Task-Density analysis, Prompt Checking, and Prompt Generation in one auditable platform. 
            Built on the EAI Model: learning and legal work with AI remain legitimate only when human agency, ownership, and reasoning are visible.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <a href="https://sites.google.com/view/eaimodel/eai-beyond-explainability?authuser=0" target="_blank" rel="noopener noreferrer">
                Learn More About EAI Model
              </a>
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-all duration-300 cursor-pointer group border-gray-100">
              <CardHeader className="pb-4">
                <div className={`w-10 h-10 ${tool.color} rounded flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-normal">{tool.title}</CardTitle>
                <CardDescription className="text-sm font-light">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-black hover:bg-gray-800 text-white">
                  <Link to={tool.path}>Start Analysis</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EAI Model Overview */}
        <Card className="mb-8 border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-black" />
              <div>
                <CardTitle className="text-xl font-normal">The EAI Model</CardTitle>
                <CardDescription className="font-light">Transparent, didactically sound, and compliant framework for AI use</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-normal text-base mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-black" />
                  Core Concepts
                </h4>
                <ul className="space-y-3">
                  {eaiConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm font-light">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded">
                <h4 className="font-normal text-base mb-3 text-black">Model Purpose</h4>
                <p className="text-gray-700 mb-4 font-light text-sm leading-relaxed">
                  Provide a transparent, didactically sound, and compliant framework for AI use in legal practice and operations.
                </p>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  The EAI Model ensures that human agency, ownership, and reasoning remain visible throughout AI-assisted legal workflows,
                  maintaining compliance with emerging AI regulations while promoting responsible usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 mb-4 md:mb-0 font-light">
              © 2025 L.E.G.I.T. | Legal AI & EAI Model
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-black font-light">Privacy</Link>
              <Link to="/terms" className="text-xs text-gray-500 hover:text-black font-light">Terms</Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-black font-light">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
