
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, Zap, Target, ArrowRight, Lightbulb, Shield, Scale, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [versionClicks, setVersionClicks] = useState(0);
  const navigate = useNavigate();

  // Reset click counter after 5 seconds of inactivity
  useEffect(() => {
    if (versionClicks > 0) {
      const timer = setTimeout(() => setVersionClicks(0), 5000);
      return () => clearTimeout(timer);
    }
  }, [versionClicks]);

  const handleVersionClick = () => {
    const newCount = versionClicks + 1;
    setVersionClicks(newCount);
    
    if (newCount === 2) {
      // Navigate to secret Saga environment
      navigate('/saga-secret');
      setVersionClicks(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3C5D]/5 to-blue-600/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-10 h-10 text-[#0B3C5D]" />
              <span className="text-2xl font-bold text-[#0B3C5D]">EAI Model</span>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleVersionClick}
              >
                v1.0
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Education & AI<br />
              <span className="text-[#0B3C5D]">Compliance Framework</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The EAI Model ensures responsible AI use in education through 10 research-backed rubrics. 
              Build prompts that maintain learning integrity, cognitive ownership, and ethical boundaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prompt-checker">
                <Button size="lg" className="bg-[#0B3C5D] hover:bg-[#0B3C5D]/90 text-white gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Check Your Prompts
                </Button>
              </Link>
              <Link to="/prompt-generator">
                <Button size="lg" variant="outline" className="border-[#0B3C5D] text-[#0B3C5D] hover:bg-[#0B3C5D]/10 gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Generate Compliant Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0B3C5D] mb-2">10</div>
              <div className="text-gray-600">Core Rubrics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0B3C5D] mb-2">98%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0B3C5D] mb-2">5K+</div>
              <div className="text-gray-600">Prompts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0B3C5D] mb-2">24/7</div>
              <div className="text-gray-600">Compliance Check</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why EAI Model Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for educators, administrators, and learners who need AI that enhances rather than replaces human thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-transparent hover:border-[#0B3C5D]/20 transition-all">
              <CardHeader>
                <Shield className="w-12 h-12 text-[#0B3C5D] mb-4" />
                <CardTitle>Learning Integrity</CardTitle>
                <CardDescription>
                  Ensures AI supports genuine learning while maintaining academic honesty and cognitive development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-[#0B3C5D]/20 transition-all">
              <CardHeader>
                <Scale className="w-12 h-12 text-[#0B3C5D] mb-4" />
                <CardTitle>Ethical Boundaries</CardTitle>
                <CardDescription>
                  Built-in safeguards for bias prevention, privacy protection, and responsible AI deployment in education.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-[#0B3C5D]/20 transition-all">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-[#0B3C5D] mb-4" />
                <CardTitle>Research-Backed</CardTitle>
                <CardDescription>
                  Every rubric is grounded in educational research and tested with real classroom scenarios.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              EAI Model Tools
            </h2>
            <p className="text-xl text-gray-600">
              Complete suite for responsible AI integration in education
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prompt Checker */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-[#0B3C5D]" />
                  <CardTitle className="text-xl">Prompt Checker (pCheck)</CardTitle>
                </div>
                <CardDescription>
                  Instant compliance analysis for any AI prompt against all 10 EAI rubrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Real-time Analysis</Badge>
                    <Badge variant="secondary">Detailed Reports</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cognitive Ownership</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <Link to="/prompt-checker">
                    <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90 group-hover:bg-[#0B3C5D] transition-colors">
                      Try Prompt Checker <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Generator */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-8 h-8 text-[#0B3C5D]" />
                  <CardTitle className="text-xl">Prompt Generator (pGen)</CardTitle>
                </div>
                <CardDescription>
                  Generate compliant educational prompts from simple requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Smart Templates</Badge>
                    <Badge variant="secondary">Custom Context</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <strong>Input:</strong> "Help students analyze poetry"<br />
                    <strong>Output:</strong> Full EAI-compliant prompt with cognitive scaffolding...
                  </div>
                  <Link to="/prompt-generator">
                    <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90 group-hover:bg-[#0B3C5D] transition-colors">
                      Generate Prompts <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Task Density */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-[#0B3C5D]" />
                  <CardTitle className="text-xl">Task Density Analyzer</CardTitle>
                </div>
                <CardDescription>
                  Visualize the balance between AI assistance and human cognitive load.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Visual Analysis</Badge>
                    <Badge variant="secondary">Cognitive Balance</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">65%</div>
                      <div className="text-blue-700">Human Tasks</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-600">35%</div>
                      <div className="text-gray-700">AI Support</div>
                    </div>
                  </div>
                  <Link to="/task-density">
                    <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90 group-hover:bg-[#0B3C5D] transition-colors">
                      Analyze Task Density <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Research Hub */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-[#0B3C5D]" />
                  <CardTitle className="text-xl">Research & Guidelines</CardTitle>
                </div>
                <CardDescription>
                  Access research papers, implementation guides, and best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Academic Papers</Badge>
                    <Badge variant="secondary">Case Studies</Badge>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• 10 Core EAI Rubrics Explained</li>
                    <li>• Implementation in K-12 & Higher Ed</li>
                    <li>• Measuring Learning Outcomes</li>
                    <li>• Ethical AI in Education</li>
                  </ul>
                  <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90 group-hover:bg-[#0B3C5D] transition-colors">
                    Explore Research <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0B3C5D] to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Building Responsible AI Prompts Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join educators worldwide who trust the EAI Model for ethical AI integration in learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/prompt-checker">
              <Button size="lg" className="bg-white text-[#0B3C5D] hover:bg-gray-100 gap-2">
                <CheckCircle className="w-5 h-5" />
                Check a Prompt Now
              </Button>
            </Link>
            <Link to="/prompt-generator">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                <Zap className="w-5 h-5" />
                Generate Your First Prompt
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
