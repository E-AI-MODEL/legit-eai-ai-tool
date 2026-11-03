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

import { humanCheckpoints } from "./checkpoints";

describe("lawyer checkpoints", () => {
  const byId = (p: string) => Object.fromEntries(humanCheckpoints(p).map((c) => [c.id, c.ok]));
  it("a bare request leaves sources, lawyer decision, counterarguments and audit open", () => {
    const c = byId("Summarise this NDA.");
    expect(c).toMatchObject({ sources: false, lawyerDecides: false, counter: false, audit: false, privacy: true });
  });
  it("personal data closes the privacy checkpoint", () => {
    expect(byId("Mail jan@kantoor.nl about the NDA.").privacy).toBe(false);
  });
  it("an improved prompt closes every checkpoint", () => {
    expect(humanCheckpoints(improvePrompt("Review this NDA.")).every((c) => c.ok)).toBe(true);
  });
  it("letting the AI decide does not count as 'lawyer decides'", () => {
    expect(byId("Write the full NDA review and decide which clauses to accept.").lawyerDecides).toBe(false);
    expect(byId("Review this NDA.").lawyerDecides).toBe(false);
    expect(byId("We need you to decide on the termination clause.").lawyerDecides).toBe(false);
  });
  it("an explicit human decision closes 'lawyer decides'", () => {
    expect(byId("Suggest options; the lawyer decides which clauses to accept.").lawyerDecides).toBe(true);
    expect(byId("List risks and wait for my approval.").lawyerDecides).toBe(true);
    expect(byId("The AI does not decide anything.").lawyerDecides).toBe(true);
  });
});

import { densityFromSteps, takeBackAdvice, classifyUnits } from "./taskDensity";

describe("task density audit", () => {
  it("weights steps by effort: AI 3 + human 1 = 75% AI", () => {
    expect(densityFromSteps([{ text: "a", performer: "ai", effort: 3 }, { text: "b", performer: "human", effort: 1 }]).value).toBe(0.75);
  });
  it("a shared step counts half", () => {
    expect(densityFromSteps([{ text: "a", performer: "shared", effort: 1 }, { text: "b", performer: "human", effort: 1 }]).value).toBe(0.25);
  });
  it("audit and SAGA bar give the same number for the same prompt", () => {
    const p = "Write the full NDA review and decide which clauses to accept.\nI will check the sources.";
    expect(densityFromSteps(classifyUnits(p)).value).toBe(estimateTaskDensity(p).value);
  });
  it("advises taking back the heaviest AI step first, only until no longer AI-heavy", () => {
    const steps = [
      { text: "research", performer: "ai" as const, effort: 1 },
      { text: "draft advice", performer: "ai" as const, effort: 3 },
      { text: "check", performer: "human" as const, effort: 1 },
    ];
    expect(takeBackAdvice(steps)).toEqual([1]);
    expect(takeBackAdvice([{ text: "x", performer: "human", effort: 1 }])).toEqual([]);
  });
});
