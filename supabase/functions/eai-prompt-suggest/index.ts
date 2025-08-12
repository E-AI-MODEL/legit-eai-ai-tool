import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface RubricStatus {
  rubric: string;
  status: "pass" | "warning" | "fail";
  note: string;
}

interface SuggestResponse {
  prompt: string;
  notes?: string;
  rubric_status?: RubricStatus[];
}

// Sanitize prompt text to ensure plain, complete, text-only output
function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";
  let s = input.trim();
  // Strip fenced blocks
  s = s.replace(/```[\s\S]*?```/g, "");

  // If the entire content is JSON, extract the prompt field
  const onlyJsonLike = /^\s*\{[\s\S]*\}\s*$/; // not strict JSON parse to avoid cost
  if (onlyJsonLike.test(s)) {
    try {
      const obj = JSON.parse(s);
      if (obj && typeof obj.prompt === "string") {
        s = String(obj.prompt);
      }
    } catch (_) {
      // ignore JSON parse errors, keep original text
    }
  }

  // Remove explicit Example sections (headers like "Example", "Examples", "Example Implementation")
  s = s.replace(/(?:^|\n)#{1,6}\s*Example(?:s)?(?: Implementation)?[\s\S]*$/i, "");
  // Remove standalone JSON example blocks that are not fenced
  s = s.replace(/\n\{[\s\S]*?\n\}\s*/g, "\n");
  // Remove markdown table rows and separators
  s = s.replace(/^\|.*\|.*$/gm, "");
  s = s.replace(/^\s*\|?\s*-{2,}.*$/gm, "");
  // Remove stray helper lines
  s = s.replace(/Copy Example:?/gi, "");

  // Normalize multiple blank lines
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const body = await req.json().catch(() => ({}));
    const mode = (body?.mode as string) || "improve"; // "improve" | "generate"

    if (mode === "improve") {
      const userPrompt = body?.prompt as string;
      const constraints = (body?.constraints as string) || "";
      if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'prompt' for improve mode" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const system = `You are an expert EAI (Education & AI) prompt coach. Rewrite prompts to maximize compliance with:
- Cognitive Ownership & Traceability
- Agency & Controllability
- Reverse Scaffolding/Task Density
- Sycophancy & Drift Awareness
- Compliance, Audit & Logging
- Bias, Inclusion & Neutrality
- Output Specification & Structure
- Problem Complexity & Visible Reasoning
- Error & Failure Analysis
- Legal Learning Mode (reflection)
Language: Respond in ENGLISH only.
Return STRICT JSON with shape SuggestResponse = { prompt: string; notes?: string; rubric_status?: { rubric: string; status: "pass"|"warning"|"fail"; note: string }[] }.
Constraints: The "prompt" must be a single, complete, plain-text instructional prompt with labeled sections (no JSON, no code fences, no markdown tables, no templates, no example data). Use clear headings and bullet lists only.`;


      const user = `Original prompt to improve:\n"""${userPrompt}"""\n\nOptional constraints/context:\n${constraints}\n\nRequirements for the improved prompt:\n- Keep user's intent but add missing EAI compliance instructions\n- Specify output format (bulleted sections, not tables)\n- Include audit/logging and reflection steps\n- Explicit user vs AI roles\n- Neutral language with bias checks\n- Respond in ENGLISH only (translate if needed)`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-2025-04-14",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("OpenAI error (improve):", err);
        return new Response(
          JSON.stringify({ error: "OpenAI request failed", details: err }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content ?? "";

      let parsed: SuggestResponse | null = null;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        const fenced = content.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, "$1").trim();
        try {
          parsed = JSON.parse(fenced);
        } catch (e2) {
          const start = content.indexOf("{");
          const end = content.lastIndexOf("}");
          if (start !== -1 && end !== -1 && end > start) {
            const slice = content.slice(start, end + 1);
            try {
              parsed = JSON.parse(slice);
            } catch (e3) {
              console.error("JSON parse error (improve):", content);
              return new Response(
                JSON.stringify({ error: "Model returned non-JSON response" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
              );
            }
          } else {
            console.error("JSON parse error (improve):", content);
            return new Response(
              JSON.stringify({ error: "Model returned non-JSON response" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
        }
      }

      if (parsed && typeof parsed.prompt === "string") {
        parsed.prompt = cleanText(parsed.prompt);
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // generate mode
    const ctx = body?.context || {};
    const topic = ctx.topic || ctx.goal || ctx.intent || "a legal education task";
    const audience = ctx.audience || "law students";
    const output = ctx.output || "Bullet-list sections with clear headings";
    const tone = ctx.tone || "professional, neutral";
    const extra = ctx.constraints || "";

    const systemGen = `You are an expert EAI prompt designer for legal education. Craft prompts that:
- Clearly assign roles (AI suggests, human reviews/approves)
- Require visible reasoning, error checks, and audit logging
- Specify unbiased language, alternatives, and reflection
- Define explicit output format and review steps
Language: Respond in ENGLISH only.
Return STRICT JSON: { prompt: string; notes?: string }.
Constraints: The "prompt" must be a single, complete, plain-text instructional prompt with labeled sections (no JSON, no code fences, no markdown tables, no templates, no example data). Use clear headings and bullet lists only.`;


    const userGen = `Design a single, high-quality prompt for the following context:\nTopic/goal: ${topic}\nAudience: ${audience}\nDesired output: ${output}\nTone: ${tone}\nExtra constraints: ${extra}\n\nMake it fully EAI-compliant with labeled sections (Instructions, Inputs, Steps, Output Requirements, Audit/Logging, Bias Check, Reflection, Human Review). Respond in ENGLISH only.`;

    const responseGen = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          { role: "system", content: systemGen },
          { role: "user", content: userGen },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!responseGen.ok) {
      const err = await responseGen.text();
      console.error("OpenAI error (generate):", err);
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const dataGen = await responseGen.json();
    const contentGen = dataGen?.choices?.[0]?.message?.content ?? "";

    let parsedGen: SuggestResponse | null = null;
    try {
      parsedGen = JSON.parse(contentGen);
    } catch (e) {
      const fenced = contentGen.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, "$1").trim();
      try {
        parsedGen = JSON.parse(fenced);
      } catch (e2) {
        const start = contentGen.indexOf("{");
        const end = contentGen.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          const slice = contentGen.slice(start, end + 1);
          try {
            parsedGen = JSON.parse(slice);
          } catch (e3) {
            console.error("JSON parse error (generate):", contentGen);
            return new Response(
              JSON.stringify({ error: "Model returned non-JSON response" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
        } else {
          console.error("JSON parse error (generate):", contentGen);
          return new Response(
            JSON.stringify({ error: "Model returned non-JSON response" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
    }

    if (parsedGen && typeof parsedGen.prompt === "string") {
      parsedGen.prompt = cleanText(parsedGen.prompt);
    }

    return new Response(JSON.stringify(parsedGen), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in eai-prompt-suggest:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
