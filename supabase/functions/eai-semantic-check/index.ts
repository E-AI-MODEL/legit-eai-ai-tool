import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface CheckResult {
  rubric: string;
  flag: string;
  check: string;
  advice: string;
  status: "pass" | "warning" | "fail";
}

const RUBRICS: Omit<CheckResult, "status">[] = [
  {
    rubric: "Cognitive Ownership & Traceability",
    flag: "🟠 Traceability missing",
    check:
      "Prompt does not require users to reconstruct or justify their own reasoning; no trace-back or justification mapping.",
    advice:
      "Add a step for user to annotate, explain, or justify acceptance/rejection of AI output.",
  },
  {
    rubric: "Agency & Didactic Controllability",
    flag: "🚨 Agency risk",
    check:
      "Unclear or missing specification of who decides (AI or human); no explicit review/approval workflow.",
    advice:
      "Define exact roles: when AI suggests, when human reviews/approves, and where handover occurs.",
  },
  {
    rubric: "Reverse Scaffolding/Task Density",
    flag: "⚠️ Reverse scaffolding",
    check:
      "AI is assigned most or all thinking, drafting, and review steps; user is passive.",
    advice:
      "Distribute key steps: require user to plan, draft, or reflect before/after AI involvement.",
  },
  {
    rubric: "Sycophancy & Drift Awareness",
    flag: "🟡 Drift risk",
    check:
      "Prompt lacks user-AI comparison, critique, or challenge step; risk of passive alignment.",
    advice:
      "Ask user to compare their reasoning to AI, challenge differences, and justify agreement/disagreement.",
  },
  {
    rubric: "Compliance, Audit & Logging",
    flag: "🔒 Audit trail missing",
    check:
      "No mention of how decisions or outputs will be logged for audit/compliance.",
    advice:
      "Specify who logs decisions, changes, and rationale; require an audit trail.",
  },
  {
    rubric: "Bias, Inclusion & Professional Neutrality",
    flag: "🚨 Potential bias",
    check:
      "Prompt uses absolute/biased terms, or lacks instruction for alternatives/perspectives.",
    advice:
      "Use neutral language; require multiple viewpoints or explicit alternative interpretations.",
  },
  {
    rubric: "Output Specification & Structure",
    flag: "⚪ Output format missing",
    check: "Output structure is not specified or is ambiguous.",
    advice:
      "State required format: table, memo, checklist, log; assign section reviewers if needed.",
  },
  {
    rubric: "Problem Complexity & Visible Reasoning",
    flag: "⚠️ Shallow reasoning",
    check:
      "Prompt requests only final answer, no breakdown, no trace or alternative solutions.",
    advice:
      "Request stepwise reasoning, breakdowns, and explicit reasoning traces.",
  },
  {
    rubric: "Error & Failure Analysis",
    flag: "🟠 Error awareness missing",
    check:
      "No error detection, correction, or reflection step in the prompt.",
    advice:
      "Add a requirement to identify, reflect on, and correct mistakes or edge cases.",
  },
  {
    rubric: "Legal Learning Mode",
    flag: "🟣 Reflection missing",
    check:
      "Prompt does not ask for user reflection, learning summary, or uncertainty analysis.",
    advice:
      "Require summary of insights, open questions, or next steps for deeper learning.",
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'prompt'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const system = `You are an EAI (Education & AI) compliance analyst. Assess a user prompt across the 10 rubrics below.
Return STRICT JSON only with the shape: { "results": CheckResult[] }.
Type CheckResult = { rubric: string; flag: string; check: string; advice: string; status: "pass" | "warning" | "fail" }.
Rules:
- Use the exact rubric/flag/check/advice texts provided.
- Decide status based on the user's prompt content.
- Return results for ALL provided rubrics in the SAME ORDER as given.
- If uncertain between two statuses, choose "warning" (deterministic policy).
- No extra prose outside JSON.`;

    const rubricsText = JSON.stringify(RUBRICS);

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content:
          `Rubrics (authoritative): ${rubricsText}\n\nUser prompt to assess:\n"""${prompt}"""\n\nReturn: {"results": CheckResult[]}`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    let parsed: { results: CheckResult[] } | null = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("JSON parse error from OpenAI content:", content);
      return new Response(
        JSON.stringify({ error: "Model returned non-JSON response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!parsed || !Array.isArray(parsed.results)) {
      return new Response(
        JSON.stringify({ error: "Invalid response shape from model" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Enforce rubric order and texts; fill missing statuses as "warning" for determinism
    const byRubric = new Map(parsed.results.map((r: CheckResult) => [r.rubric, r]));
    const ordered: CheckResult[] = RUBRICS.map((r) => {
      const got = byRubric.get(r.rubric);
      const status = got?.status ?? "warning";
      return { ...r, status };
    });

    return new Response(JSON.stringify({ results: ordered }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in eai-semantic-check:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
