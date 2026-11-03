import { useState } from "react";
import PromptWorkbench from "@/components/eai/PromptWorkbench";
import ToolShell from "@/components/eai/ToolShell";

const PromptChecker = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <ToolShell label="Prompt Checker" title="Test, improve, copy.">
      <PromptWorkbench prompt={prompt} onPromptChange={setPrompt} placeholder="Paste or type your prompt here…" />
    </ToolShell>
  );
};

export default PromptChecker;
