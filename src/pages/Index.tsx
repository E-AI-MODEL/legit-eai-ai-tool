
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, Lightbulb, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Simple Header */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-[#0B3C5D]" />
              <span className="text-xl font-bold text-[#0B3C5D]">EAI Model</span>
              <Badge variant="secondary">v1.0</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Education & AI Compliance Framework
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Responsible AI use in education through research-backed rubrics.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prompt Checker */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-[#0B3C5D]" />
                  <CardTitle>Prompt Checker</CardTitle>
                </div>
                <CardDescription>
                  Check AI prompts for compliance with EAI rubrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/prompt-checker">
                  <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">
                    Check Prompts <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Prompt Generator */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-6 h-6 text-[#0B3C5D]" />
                  <CardTitle>Prompt Generator</CardTitle>
                </div>
                <CardDescription>
                  Generate compliant educational prompts automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/prompt-generator">
                  <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">
                    Generate Prompts <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Task Density */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-[#0B3C5D]" />
                  <CardTitle>Task Density</CardTitle>
                </div>
                <CardDescription>
                  Analyze the balance between AI assistance and human cognition.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/task-density">
                  <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">
                    Analyze Density <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Research */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-[#0B3C5D]" />
                  <CardTitle>Research & Guidelines</CardTitle>
                </div>
                <CardDescription>
                  Access research papers and implementation guides.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">
                  View Research <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
