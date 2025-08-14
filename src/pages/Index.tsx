import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Scale } from "lucide-react";
import { useState, useRef } from "react";
import ViewModeSwitcher from "@/components/ViewModeSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const [showTapHint, setShowTapHint] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  const tools = [
    {
      name: "SAGA Legal AI",
      description: "Professional Legal Prompt Platform",
      href: "/saga",
      icon: Scale,
      color: "bg-blue-500",
    },
    {
      name: "Prompt Checker (pCheck)",
      description: "EAI Model Compliance & Quality Check",
      href: "/promptchecker",
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  const handleVersionClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 5000) {
      setShowTapHint(true);
      setTimeout(() => setShowTapHint(false), 3000);
    } else {
      lastClickTimeRef.current = now;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0B3C5D] rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0B3C5D]">legit.eai</h1>
                <p className="text-xs text-slate-500">Ethical AI Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ViewModeSwitcher />
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to legit.eai
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our tools for ethical AI integration.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tool.icon className="w-5 h-5 text-gray-500" />
                  {tool.name}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate(tool.href)} className="w-full">
                  Explore {tool.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
