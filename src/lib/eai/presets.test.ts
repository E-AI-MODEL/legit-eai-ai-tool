import { describe, it, expect } from "vitest";
import { sagaPresets } from "@/data/sagaPresets";
import { issueCertificate } from "./certificate";
import { humanCheckpoints } from "./checkpoints";

describe("SAGA presets meet the EAI standard", () => {
  it("there are 27 presets", () => expect(sagaPresets.length).toBe(27));
  it.each(sagaPresets.map((p) => [p.id, p.prompt_template]))("%s is Certified, under 70% AI work, all lawyer checkpoints closed", (_id, text) => {
    const c = issueCertificate(text);
    expect(c.reasons).toEqual([]);
    expect(c.verdict).toBe("Certified");
    expect(c.assessment.density.value).toBeLessThan(0.7);
    expect(humanCheckpoints(text).filter((k) => !k.ok).map((k) => k.id)).toEqual([]);
  });
});

import { buildPrompt } from "./engine";
import { generatorPhases } from "@/data/generatorScenarios";

describe("Prompt Generator output", () => {
  const scenarios = generatorPhases.flatMap((p) => p.scenarios.map((s) => [s.name, s.prompt] as const));
  it.each(scenarios)("scenario '%s' becomes a Certified prompt", (_n, task) => {
    expect(issueCertificate(buildPrompt({ task })).reasons).toEqual([]);
  });
  it("a bare task with all options is Certified and keeps the lawyer's own decision", () => {
    const out = buildPrompt({ task: "Review the liability clauses of this SaaS agreement.", area: "Contracts", format: "Memo", lawyerDecides: "which clauses we accept" });
    expect(issueCertificate(out).verdict).toBe("Certified");
    expect(out).toContain("I decide: which clauses we accept.");
    expect(out).toContain("as a memo");
  });
});
