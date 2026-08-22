import { fallbackModelsForProvider, listModelsForProvider } from "@/lib/ai/list-models";
import { isAiProviderId, type AiProviderId } from "@/lib/ai/providers";
import { allowRequest, clientIpFromRequest } from "@/lib/api/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    if (!(await allowRequest(`ai-models:${ip}`, 30, 60_000))) {
      return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const body = (await request.json()) as { provider?: string; apiKey?: string };
    const provider = body.provider;
    const apiKey = body.apiKey?.trim();

    if (!isAiProviderId(provider) || !apiKey || apiKey.length < 8 || apiKey.length > 512) {
      return Response.json({ error: "Provider and API key are required." }, { status: 400 });
    }

    try {
      const models = await listModelsForProvider(provider as AiProviderId, apiKey);
      return Response.json({ models });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load models.";
      const fallback = fallbackModelsForProvider(provider as AiProviderId);
      console.warn("[ai/models] using fallback catalog:", message);
      return Response.json({
        models: fallback,
        warning: message,
        fallback: true,
      });
    }
  } catch (error) {
    console.error("[ai/models]", error instanceof Error ? error.message : error);
    return Response.json({ error: "Could not load models. Check your API key and try again." }, { status: 502 });
  }
}
