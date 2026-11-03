
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Brain, Calculator, FileDown, Save } from "lucide-react";
import { Link } from "react-router-dom";

interface SubStep {
  id: string;
  name: string;
  performer: "Human" | "AI" | "Both" | "";
  effort: number;
  justification: string;
  reviewed: "Yes" | "No" | "";
}

const TaskDensity = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    taskDescription: "",
    actors: "",
    goal: "",
    phase: "",
    subSteps: "",
    commentary: ""
  });
  
  const [subStepData, setSubStepData] = useState<SubStep[]>([]);
  const [calculatedTD, setCalculatedTD] = useState<number | null>(null);

  const totalSteps = 6;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const parseSubSteps = () => {
    if (!formData.subSteps) return;
    
    const steps = formData.subSteps.split('\n').filter(step => step.trim());
    const newSubSteps: SubStep[] = steps.map((step, index) => ({
      id: `step-${index}`,
      name: step.trim(),
      performer: "",
      effort: 0.5,
      justification: "",
      reviewed: ""
    }));
    
    setSubStepData(newSubSteps);
    setCurrentStep(3);
  };

  const updateSubStep = (id: string, field: keyof SubStep, value: any) => {
    setSubStepData(prev => prev.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const calculateTaskDensity = () => {
    const totalSteps = subStepData.length;
    const aiEffort = subStepData.reduce((sum, step) => {
      if (step.performer === "AI") return sum + step.effort;
      if (step.performer === "Both") return sum + (step.effort * 0.5);
      return sum;
    }, 0);
    
    const td = totalSteps > 0 ? aiEffort / totalSteps : 0;
    setCalculatedTD(td);
    
    toast({
      title: "Task Density Calculated",
      description: `TD Score: ${(td * 100).toFixed(1)}% AI effort`
    });
  };

  const getTDColor = (td: number) => {
    if (td < 0.3) return "text-success";
    if (td < 0.7) return "text-warning";
    return "text-destructive";
  };

  const getTDLabel = (td: number) => {
    if (td < 0.3) return "Human-Led";
    if (td < 0.7) return "Balanced";
    return "AI-Heavy";
  };

  const exportResults = () => {
    const results = {
      context: formData,
      subSteps: subStepData,
      taskDensity: calculatedTD,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-density-audit.json';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Task density audit downloaded successfully."
    });
  };

  const saveProgress = () => {
    localStorage.setItem('legit-task-density', JSON.stringify({ formData, subStepData, calculatedTD }));
    toast({
      title: "Progress Saved",
      description: "Your work has been saved locally."
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-primary hover:text-primary/80">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">Task-Density & Ownership Audit</h1>
            </div>
            <Button variant="outline" onClick={saveProgress} className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Context */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Context</CardTitle>
              <CardDescription>Define the task, actors, goals, and current phase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="task">Task / Activity *</Label>
                <Textarea 
                  id="task"
                  placeholder="Describe the legal or learning task..."
                  value={formData.taskDescription}
                  onChange={(e) => handleInputChange('taskDescription', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="actors">Actors *</Label>
                  <Input 
                    id="actors"
                    placeholder="e.g., Lawyer, Client, AI"
                    value={formData.actors}
                    onChange={(e) => handleInputChange('actors', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="goal">Goal *</Label>
                  <Input 
                    id="goal"
                    placeholder="What should be achieved?"
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phase">Phase *</Label>
                <Input 
                  id="phase"
                  placeholder="e.g., Research, Analysis, Drafting"
                  value={formData.phase}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!formData.taskDescription || !formData.actors || !formData.goal || !formData.phase}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Break Down Actions */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Break Down Actions</CardTitle>
              <CardDescription>List all sub-steps involved in this task, one per line.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="substeps">List Sub-steps *</Label>
                <Textarea 
                  id="substeps"
                  placeholder="1. Identify legal issues&#10;2. Research relevant cases&#10;3. Analyze precedents&#10;4. Draft preliminary opinion..."
                  value={formData.subSteps}
                  onChange={(e) => handleInputChange('subSteps', e.target.value)}
                  rows={8}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">Enter each sub-step on a new line</p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={parseSubSteps} disabled={!formData.subSteps}>
                  Parse Steps <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Map Ownership */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Map Ownership</CardTitle>
              <CardDescription>Assign performers and effort levels for each sub-step.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {subStepData.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{step.name}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Performer</Label>
                        <Select value={step.performer} onValueChange={(value) => updateSubStep(step.id, 'performer', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select performer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Human">Human</SelectItem>
                            <SelectItem value="AI">AI</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Effort Level: {step.effort.toFixed(2)}</Label>
                        <Slider
                          value={[step.effort]}
                          onValueChange={(value) => updateSubStep(step.id, 'effort', value[0])}
                          max={1}
                          min={0}
                          step={0.05}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} disabled={subStepData.some(step => !step.performer)}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Analyse & Flags */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Analyse & Flags</CardTitle>
              <CardDescription>Calculate task density and add commentary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                <Button onClick={calculateTaskDensity} className="mb-4">
                  Calculate Task Density
                </Button>
                {calculatedTD !== null && (
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getTDColor(calculatedTD)}`}>
                      {(calculatedTD * 100).toFixed(1)}%
                    </div>
                    <Badge className={getTDColor(calculatedTD)}>{getTDLabel(calculatedTD)}</Badge>
                    <p className="text-sm text-muted-foreground">
                      Task Density: Percentage of cognitive work performed by AI
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="commentary">Commentary</Label>
                <Textarea 
                  id="commentary"
                  placeholder="Add your analysis and observations about the task density distribution..."
                  value={formData.commentary}
                  onChange={(e) => handleInputChange('commentary', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Audit Trail */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Audit Trail</CardTitle>
              <CardDescription>Provide justifications for each performer assignment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {subStepData.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{step.name}</span>
                      <Badge className={step.performer === "AI" ? "bg-destructive/15 text-destructive" : 
                                      step.performer === "Human" ? "bg-success/15 text-success" : 
                                      "bg-warning/15 text-warning"}>
                        {step.performer}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label>Why this performer?</Label>
                        <Textarea 
                          placeholder="Justify the performer assignment..."
                          value={step.justification}
                          onChange={(e) => updateSubStep(step.id, 'justification', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Reviewed?</Label>
                        <Select value={step.reviewed} onValueChange={(value) => updateSubStep(step.id, 'reviewed', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Export */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Export Results</CardTitle>
              <CardDescription>Review and export your task density audit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Summary</h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p><strong>Task:</strong> {formData.taskDescription}</p>
                    <p><strong>Actors:</strong> {formData.actors}</p>
                    <p><strong>Goal:</strong> {formData.goal}</p>
                    <p><strong>Phase:</strong> {formData.phase}</p>
                    {calculatedTD !== null && (
                      <p className={`font-bold ${getTDColor(calculatedTD)}`}>
                        <strong>Task Density:</strong> {(calculatedTD * 100).toFixed(1)}% ({getTDLabel(calculatedTD)})
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Actions</h4>
                  <div className="space-y-2">
                    <Button onClick={exportResults} className="w-full gap-2">
                      <FileDown className="w-4 h-4" />
                      Download PDF Report
                    </Button>
                    <Button variant="outline" onClick={saveProgress} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      Save Progress
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button asChild>
                  <Link to="/">Complete Analysis</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskDensity;
