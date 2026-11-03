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
