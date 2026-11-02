import { describe, it, expect } from "vitest";
import { improvePrompt, generatePrompt } from "./engine";
import { estimateTaskDensity, densityLabel } from "./taskDensity";
import { detectPhases } from "./workflowPhases";
import { issueCertificate, checkConfidentiality } from "./certificate";

describe("task density", () => {
  it("uses the audit page thresholds: <30% human-led, <70% balanced, else AI-heavy", () => {
    expect(densityLabel(0.29)).toBe("Human-led");
    expect(densityLabel(0.3)).toBe("Balanced");
    expect(densityLabel(0.69)).toBe("Balanced");
    expect(densityLabel(0.7)).toBe("AI-heavy");
  });
  it("a prompt where AI does everything is AI-heavy", () => {
    expect(estimateTaskDensity("Write the full NDA review and decide which clauses to accept.").label).toBe("AI-heavy");
  });
  it("an improved prompt is never left AI-heavy", () => {
    expect(estimateTaskDensity(improvePrompt("Write the full NDA review.")).label).not.toBe("AI-heavy");
  });
  it("human-owned steps lower the density", () => {
    const d = estimateTaskDensity("I will draft my own view first.\nI will decide.\nSummarise the contract.");
    expect(d.value).toBeLessThan(0.5);
  });
});

describe("workflow phases", () => {
  it("next phase is the first missing one, in order", () => {
    expect(detectPhases("Extract the facts from the lease.").next?.id).toBe("analysis");
  });
  it("improved prompt covers all four phases", () => {
    expect(detectPhases(improvePrompt("Review this NDA.")).missing).toEqual([]);
  });
});

describe("certificate", () => {
  it("same prompt gives the same certificate id", () => {
    const a = issueCertificate("Review this NDA.", new Date("2026-01-01"));
    const b = issueCertificate("Review this NDA.", new Date("2026-06-01"));
    expect(a.id).toBe(b.id);
  });
  it("a bare one-line prompt is not certified", () => {
    expect(issueCertificate("Write an NDA.").verdict).toBe("Not certified");
  });
  it("a generated professional prompt has no failed rules", () => {
    const c = issueCertificate(generatePrompt("Review an NDA for a Dutch SME"));
    expect(c.assessment.results.filter((r) => r.status === "fail")).toEqual([]);
    expect(c.verdict).not.toBe("Not certified");
  });
  it("personal data blocks certification", () => {
    expect(checkConfidentiality("Client: jan@example.nl, BSN 123456782")).toEqual(["email", "bsn"]);
    const c = issueCertificate(improvePrompt("Review the NDA for jan@example.nl"));
    expect(c.verdict).toBe("Not certified");
  });
});
