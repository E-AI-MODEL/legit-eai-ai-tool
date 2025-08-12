import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ViewMode = "auto" | "mobile" | "desktop";

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

const STORAGE_KEY = "view-mode";

function applyViewport(mode: ViewMode) {
  const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
  if (!meta) return;

  if (mode === "auto") {
    meta.setAttribute("content", "width=device-width, initial-scale=1.0");
  } else if (mode === "mobile") {
    // Emulate a small viewport to force mobile media queries
    meta.setAttribute("content", "width=375, initial-scale=1.0");
  } else {
    // Emulate a wider viewport to trigger desktop layouts on small screens
    meta.setAttribute("content", "width=1280, initial-scale=1.0");
  }
}

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as ViewMode | null;
    return saved ?? "auto";
  });

  const setMode = useMemo(
    () => (m: ViewMode) => {
      setModeState(m);
      try {
        localStorage.setItem(STORAGE_KEY, m);
      } catch {}
    },
    []
  );

  useEffect(() => {
    // Mark on html for CSS hooks if needed
    document.documentElement.setAttribute("data-view", mode);
    applyViewport(mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used within a ViewModeProvider");
  return ctx;
}
