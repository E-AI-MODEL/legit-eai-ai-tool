import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Briefcase, 
  Scale, 
  Search, 
  Shield, 
  Users, 
  Lightbulb, 
  Building, 
  Leaf, 
  CheckCircle, 
  MessageSquare, 
  BookOpen, 
  AlertTriangle, 
  AlertCircle, 
  FileCheck 
} from "lucide-react";
import { useState } from "react";
import { sagaPresets, presetCategories, LegalPreset } from "@/data/sagaPresets";

interface SagaPresetGridProps {
  onSelectPreset: (preset: LegalPreset) => void;
}

const iconMap = {
  FileText,
  Briefcase,
  Scale,
  Search,
  Shield,
  Users,
  Lightbulb,
  Building,
  Leaf,
  CheckCircle,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  FileCheck
};

const SagaPresetGrid = ({ onSelectPreset }: SagaPresetGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPresets = sagaPresets.filter(preset => {
    const matchesSearch = preset.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'basic': return 'text-green-400 border-green-400/50';
      case 'intermediate': return 'text-yellow-400 border-yellow-400/50';
      case 'advanced': return 'text-red-400 border-red-400/50';
      default: return 'text-blue-400 border-blue-400/50';
    }
  };

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction) {
      case 'NL': return 'text-orange-400 border-orange-400/50';
      case 'EU': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const handleUsePrompt = async (preset: LegalPreset) => {
    try {
      // Copy to clipboard - using the correct property name
      await navigator.clipboard.writeText(preset.prompt_template);
      
      // Very gentle screen buzz effect - barely noticeable
      document.body.style.animation = 'subtle-buzz 0.15s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 150);
      
      // Soft bleep sound effect
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
      
      // Call the original handler
      onSelectPreset(preset);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback - still call the original handler
      onSelectPreset(preset);
    }
  };

  return (
    <>
      <style>{`
        @keyframes subtle-buzz {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(0.5px); }
        }
      `}</style>
      
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="space-y-4">
          <Input
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "" : "text-slate-400 border-slate-600 hover:text-white"}
            >
              All
            </Button>
            {presetCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "" : "text-slate-400 border-slate-600 hover:text-white"}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPresets.map((preset) => {
            const category = presetCategories.find(cat => cat.id === preset.category);
            const IconComponent = category ? iconMap[category.icon as keyof typeof iconMap] : FileText;
            
            return (
              <Card key={preset.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getJurisdictionColor(preset.jurisdiction)}`}
                      >
                        {preset.jurisdiction}
                      </Badge>
                    </div>
                    {preset.complexity && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getComplexityColor(preset.complexity)}`}
                      >
                        {preset.complexity}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm text-white leading-tight line-clamp-2">
                    {preset.label}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2">
                    {category?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="text-xs text-slate-500">
                    Format: <span className="text-slate-300">{preset.output_format}</span>
                  </div>
                  
                  {preset.tags && preset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {preset.tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="text-xs text-slate-400 border-slate-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {preset.tags.length > 2 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs text-slate-400 border-slate-600"
                        >
                          +{preset.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleUsePrompt(preset)}
                    size="sm"
                    className="w-full text-xs font-medium"
                  >
                    Use This Prompt
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredPresets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No presets found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SagaPresetGrid;
