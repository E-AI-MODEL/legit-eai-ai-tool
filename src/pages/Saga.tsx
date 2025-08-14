
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, Shield, Brain, Database, Zap } from "lucide-react";

const Saga = () => {
  const adviceLibrary = {
    "Structure": {
      "chips": [
        "Add a 'Facts (Extract)' section with exact fields and pinpoint citations.",
        "Add an 'Analysis (Interpretation)' section with risks, options, and trade-offs.",
        "Define data types for extracted fields (e.g., ISO date, boolean)."
      ]
    },
    "Evidence": {
      "chips": [
        "Require a Sources list and pinpoint citations for each claim.",
        "Ask for an Action Log of steps and tools used."
      ]
    },
    "Decision points": {
      "chips": [
        "Insert Human Approval checkpoints and pause before sending advice.",
        "Add an override note: the lawyer makes the final call."
      ]
    },
    "Tone": {
      "chips": [
        "Remove certainty language; offer 1–2 alternatives with trade-offs.",
        "Use neutral, plain English; avoid urgency language."
      ]
    },
    "Privacy": {
      "chips": [
        "Avoid PII; if needed, request redacted excerpts only.",
        "State EU storage/processing and no training on client data."
      ]
    },
    "Output format": {
      "chips": [
        "Specify the output format (bullets, table, or tracked changes).",
        "Include a short opening plan and a clear section order."
      ]
    },
    "Timing": {
      "chips": [
        "Add a review window before finalizing.",
        "If timing is critical, explain why and offer an opt-out."
      ]
    },
    "Scope & criteria": {
      "chips": [
        "Name the jurisdiction and legal criteria (law/article/case/guideline).",
        "Define key terms upfront to avoid ambiguity."
      ]
    }
  };

  const detectorRules = [
    {
      id: "missing-structure",
      label: "Structure",
      severity: "medium",
      description: "Detects missing facts/analysis sections"
    },
    {
      id: "missing-proof",
      label: "Evidence",
      severity: "high",
      description: "Checks for sources and citations"
    },
    {
      id: "missing-approval",
      label: "Decision points",
      severity: "high",
      description: "Ensures human approval checkpoints"
    },
    {
      id: "tone-certainty",
      label: "Tone",
      severity: "medium",
      description: "Flags certainty language"
    },
    {
      id: "privacy-risk",
      label: "Privacy",
      severity: "high",
      description: "Detects PII and privacy risks"
    },
    {
      id: "format-unclear",
      label: "Output format",
      severity: "low",
      description: "Checks output format clarity"
    },
    {
      id: "timing-pressure",
      label: "Timing",
      severity: "medium",
      description: "Flags urgency language"
    },
    {
      id: "missing-scope",
      label: "Scope & criteria",
      severity: "high",
      description: "Ensures jurisdiction and legal criteria"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-400/50 text-red-400';
      case 'medium': return 'border-yellow-400/50 text-yellow-400';
      case 'low': return 'border-green-400/50 text-green-400';
      default: return 'border-blue-400/50 text-blue-400';
    }
  };

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
                Backend Ready
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

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Legal AI Backend Assets
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Clean advice library and detector rule-set with plain Saga-style labels. 
            No rubric jargon on the frontend, complete with one-click apply normalizer.
          </p>
        </div>

        {/* Backend Assets Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Advice Library */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <Database className="w-6 h-6" />
                Advice Library
              </CardTitle>
              <CardDescription className="text-slate-300">
                Frontend-safe chips grouped by label with backend rationale anchors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {Object.entries(adviceLibrary).map(([category, data]) => (
                  <div key={category} className="border border-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{category}</h4>
                    <div className="space-y-1">
                      {data.chips.map((chip, index) => (
                        <div key={index} className="text-sm text-slate-300 bg-white/5 rounded px-2 py-1">
                          {chip}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detector Rules */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <Brain className="w-6 h-6" />
                Detector Rules
              </CardTitle>
              <CardDescription className="text-slate-300">
                Backend regex/heuristics mapped to plain labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {detectorRules.map((rule) => (
                  <div key={rule.id} className="border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">{rule.label}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(rule.severity)}`}
                      >
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{rule.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Normalizer Section */}
        <Card className="bg-white/5 border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <Zap className="w-6 h-6" />
              One-Click Apply Normalizer
            </CardTitle>
            <CardDescription className="text-slate-300">
              Server-side prompt normalization with structured output
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Processing Order</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  {["Structure", "Scope & criteria", "Evidence", "Decision points", "Output format", "Tone", "Privacy", "Timing"].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Default Headers</h4>
                <div className="space-y-1 text-sm text-slate-300">
                  <div>• Facts (Extract)</div>
                  <div>• Analysis (Interpretation)</div>
                  <div>• Decision points — Human approval required</div>
                  <div>• Sources & Action Log</div>
                  <div>• Human Review Hand-off</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Info */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Integration Ready
            </CardTitle>
            <CardDescription className="text-slate-300">
              Clean backend assets with EAI safeguards under the hood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">Backend Output</h4>
                <ul className="text-slate-400 space-y-1">
                  <li>• Summary with issue detection</li>
                  <li>• Plain label explanations</li>
                  <li>• Advice chips by category</li>
                  <li>• Normalized prompt ready</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Safeguards</h4>
                <ul className="text-slate-400 space-y-1">
                  <li>• No rubric jargon exposed</li>
                  <li>• Internal metrics logged</li>
                  <li>• Unit tested rules</li>
                  <li>• Audit trail maintained</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Saga;
