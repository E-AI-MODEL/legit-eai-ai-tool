import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { copyWithFeedback } from "@/lib/feedback";
import { sagaPresets, presetCategories, LegalPreset } from "@/data/sagaPresets";

interface SagaPresetGridProps {
  onSelectPreset: (preset: LegalPreset) => void;
}

/** Preset library as an editorial list: category filter, search, one row per preset. */
const SagaPresetGrid = ({ onSelectPreset }: SagaPresetGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const q = searchTerm.toLowerCase();
  const filteredPresets = sagaPresets.filter((preset) => {
    const matchesSearch =
      preset.label.toLowerCase().includes(q) ||
      preset.category.toLowerCase().includes(q) ||
      preset.tags?.some((tag) => tag.toLowerCase().includes(q));
    const matchesCategory = !selectedCategory || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUsePrompt = async (preset: LegalPreset) => {
    await copyWithFeedback(preset.prompt_template);
    onSelectPreset(preset);
  };

  const filterClass = (active: boolean) =>
    `shrink-0 pb-1 text-[11px] tracking-[0.18em] uppercase border-b transition-colors ${
      active ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
    }`;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 bg-transparent border-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-foreground"
          />
        </div>

        <div className="flex gap-5 overflow-x-auto pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-y-3">
          <button type="button" onClick={() => setSelectedCategory(null)} className={filterClass(selectedCategory === null)}>
            All
          </button>
          {presetCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={filterClass(selectedCategory === category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <ul className="border-t border-border">
        {filteredPresets.map((preset, i) => {
          const category = presetCategories.find((cat) => cat.id === preset.category);
          return (
            <li key={preset.id} className="border-b border-border">
              <button
                type="button"
                onClick={() => handleUsePrompt(preset)}
                className="group w-full text-left flex items-start gap-5 py-5 focus:outline-none focus-visible:bg-accent"
              >
                <span className="font-mono text-xs text-muted-foreground w-6 shrink-0 pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                    {category?.name ?? preset.category} · {preset.jurisdiction}
                  </span>
                  <span className="block font-serif text-lg text-foreground group-hover:text-primary transition-colors mt-1 leading-snug">
                    {preset.label}
                  </span>
                </span>
                <ArrowUpRight
                  className="w-5 h-5 mt-1 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
                  strokeWidth={1.5}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {filteredPresets.length === 0 && (
        <p className="text-sm text-muted-foreground py-8">Nothing matches "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SagaPresetGrid;
