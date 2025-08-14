
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, Shield, Users, Brain, Gavel } from "lucide-react";

const Saga = () => {
  const sagaFeatures = [
    {
      title: "Advanced Legal Analytics",
      description: "Deep analysis of legal documents with AI-powered insights",
      icon: Brain,
      status: "Beta"
    },
    {
      title: "Compliance Dashboard",
      description: "Real-time monitoring of regulatory compliance across cases",
      icon: Shield,
      status: "Coming Soon"
    },
    {
      title: "Team Collaboration",
      description: "Secure workspace for legal teams with AI assistance",
      icon: Users,
      status: "Beta"
    },
    {
      title: "Case Precedent Search",
      description: "AI-enhanced search through legal precedents and case law",
      icon: Gavel,
      status: "Development"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">SAGA</h1>
                <p className="text-xs text-slate-300">Advanced Legal AI Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-white border-white/30">
                Professional
              </Badge>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Welcome to SAGA
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            The next generation of AI-powered legal practice tools. Built for professionals 
            who demand the highest standards of accuracy, compliance, and ethical AI use.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-slate-300 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Private Beta Access
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sagaFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      feature.status === 'Beta' ? 'border-green-400/50 text-green-400' :
                      feature.status === 'Coming Soon' ? 'border-blue-400/50 text-blue-400' :
                      'border-yellow-400/50 text-yellow-400'
                    }`}
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-300">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  disabled={feature.status !== 'Beta'}
                >
                  {feature.status === 'Beta' ? 'Try Now' : 'Notify Me'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Professional Legal AI Platform
            </CardTitle>
            <CardDescription className="text-slate-300">
              Advanced tools for legal professionals who need enterprise-grade AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Enterprise Security</h4>
                  <p className="text-slate-400">End-to-end encryption, SOC 2 compliance, and data residency controls</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">AI Transparency</h4>
                  <p className="text-slate-400">Full audit trails, explainable AI decisions, and bias detection</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Professional Support</h4>
                  <p className="text-slate-400">Dedicated support team with legal AI expertise</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Saga;
