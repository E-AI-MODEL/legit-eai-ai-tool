import React from "react";
import { useViewMode } from "@/context/view-mode";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Smartphone, MonitorSmartphone } from "lucide-react";

export default function ViewModeSwitcher() {
  const { mode, setMode } = useViewMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-md border border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => v && setMode(v as any)}
          className="p-1"
        >
          <ToggleGroupItem
            value="auto"
            aria-label="Auto view"
            className="px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <MonitorSmartphone className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mobile"
            aria-label="Mobile view"
            className="px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Smartphone className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="desktop"
            aria-label="Desktop view"
            className="px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Monitor className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
