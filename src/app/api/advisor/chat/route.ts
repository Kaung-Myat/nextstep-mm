import { isAiProviderId, isPlausibleModelId, type AiProviderId } from "@/lib/ai/providers";
import { sanitizeAdvisorReply } from "@/lib/advisor/sanitize-reply";
import { normalizeAdvisorMessages } from "@/lib/advisor/normalize-messages";
import { allowRequest, clientIpFromRequest } from "@/lib/api/rate-limit";
import { getCurrentProfile } from "@/lib/profile";
import { getRoadmapByPath, type RoadmapPath } from "@/lib/roadmaps";
import { getMarketSkillHighlights } from "@/lib/jobs/market";
import { getCompletedItemSlugs } from "@/lib/roadmap-progress";

type ChatMessage = { role: "user" | "assistant"; content: string };

const rolePaths = { FRONTEND: "frontend", BACKEND: "backend", FULLSTACK: "fullstack" } as const;

let skillCache: { at: number; value: string } | null = null;
const SKILL_CACHE_MS = 60_000;

async function topMarketSkillsCached() {
  const now = Date.now();
  if (skillCache && now - skillCache.at < SKILL_CACHE_MS) return skillCache.value;
  const skills = await getMarketSkillHighlights(5);
  const value = skills.map((skill) => skill.name).join(", ");
  skillCache = { at: now, value };
  return value;
}

async function buildSystemPrompt() {
  const profile = await getCurrentProfile();
  const path: RoadmapPath = profile?.targetRole ? rolePaths[profile.targetRole] : "frontend";
  const [roadmap, completed, topSkills] = await Promise.all([
    getRoadmapByPath(path),
    getCompletedItemSlugs(path),
    topMarketSkillsCached(),
  ]);
  const items = roadmap?.sections.flatMap((section) => section.items) ?? [];
  const nextItem = items.find((item) => !completed.includes(item.slug));

  return [
    "You are NextStep MM, a practical career advisor for Myanmar junior developers.",
    "Give concise, actionable advice grounded in the user's learning path and local internship market signals.",
    "Prefer concrete next steps over generic motivation. Use short paragraphs or bullets.",
    "Reply in plain text or markdown only. Do not include audio timestamps or media cue markers.",
    `Target path: ${path}.`,
    `Roadmap progress: ${completed.length}/${items.length} topics complete.`,
    nextItem ? `Suggested next topic: ${nextItem.title}.` : "The user has completed available roadmap topics or none are published.",
    topSkills ? `Top skills in current approved listings: ${topSkills}.` : "Market skill data is limited right now.",
  ].join("\n");
}

async function callGemini(apiKey: string, model: string, messages: ChatMessage[], system: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.6 },
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Gemini request failed (${response.status})`);
  }

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("")?.trim();
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

async function callOpenRouter(apiKey: string, model: string, messages: ChatMessage[], system: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "NextStep MM",
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `OpenRouter request failed (${response.status})`);
  }

  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenRouter returned an empty response.");
  return text;
}

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    if (!(await allowRequest(`advisor-chat:${ip}`, 20, 60_000))) {
      return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const body = (await request.json()) as {
      provider?: AiProviderId;
      modelId?: string;
      apiKey?: string;
      messages?: unknown;
    };

    const provider = body.provider;
    const modelId = body.modelId?.trim();
    const apiKey = body.apiKey?.trim();
    const messages = normalizeAdvisorMessages(body.messages);

    if (!provider || !isAiProviderId(provider) || !modelId || !apiKey) {
      return Response.json({ error: "Provider, model, and API key are required." }, { status: 400 });
    }
    if (apiKey.length > 512) {
      return Response.json({ error: "Invalid API key." }, { status: 400 });
    }
    if (!isPlausibleModelId(modelId)) {
      return Response.json({ error: "Unsupported model selection." }, { status: 400 });
    }
    if (messages.length === 0 || messages.every((message) => message.role !== "user")) {
      return Response.json({ error: "At least one user message is required." }, { status: 400 });
    }

    const system = await buildSystemPrompt();
    const rawReply =
      provider === "gemini"
        ? await callGemini(apiKey, modelId, messages, system)
        : await callOpenRouter(apiKey, modelId, messages, system);

    return Response.json({ reply: sanitizeAdvisorReply(rawReply) });
  } catch (error) {
    console.error("[advisor/chat]", error instanceof Error ? error.message : error);
    return Response.json({ error: "Advisor request failed. Check your key and model, then try again." }, { status: 502 });
  }
}
