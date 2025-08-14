import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Brain, CheckCircle, FileText, Scale } from "lucide-react";
import { useState, useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [showTapHint, setShowTapHint] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  const tools = [
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
    },
    {
      id: "task-density",
      title: "Task-Density & Ownership Audit",
      description: "Analyse how AI and humans share cognitive work in any legal or learning task.",
      icon: Brain,
      path: "/task-density",
      color: "bg-blue-500"
    }
  ];

  const handleVersionClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    console.log('Click detected, time since last:', timeSinceLastClick); // Debug logging
    
    if (timeSinceLastClick < 600 && timeSinceLastClick > 50) {
      // Double-tap detected (within 600ms but not too fast to avoid accidental triggers)
      console.log('Double-tap detected, navigating to saga'); // Debug logging
      navigate('/saga');
      setShowTapHint(false);
      lastClickTimeRef.current = 0; // Reset
    } else {
      // First tap - show hint and record timestamp
      console.log('First tap detected'); // Debug logging
      setShowTapHint(true);
      lastClickTimeRef.current = now;
      
      // Clear hint after 1 second if no second tap
      setTimeout(() => {
        setShowTapHint(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">EAI Model</h1>
                <p className="text-xs text-slate-500">Ethical AI Integration</p>
              </div>
            </div>
            <div className="relative">
              <Badge 
                variant="outline" 
                className={`text-slate-600 border-slate-300 hover:bg-slate-100 cursor-pointer transition-all duration-200 ${
                  showTapHint ? 'ring-2 ring-blue-300 bg-blue-50' : ''
                }`}
                onClick={handleVersionClick}
              >
                v1.0
              </Badge>
              {showTapHint && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap animate-pulse">
                  Tap again!
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            AI Tools for Legal Practice
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Professional AI assistance tools designed for legal professionals, 
            built on ethical AI principles.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-all duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  <Link to={tool.path}>Launch Tool</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
