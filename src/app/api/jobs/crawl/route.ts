import type { AiProviderId } from "@/lib/ai/providers";
import { rateLimitResponse } from "@/lib/api/rate-limit";
import { resolveIngestAiOptions } from "@/lib/jobs/ingest-ai";
import { runJobIngest, type CrawlProgressEvent, type RunJobIngestSummary } from "@/lib/jobs/run-ingest";
import { getCurrentProfile } from "@/lib/profile";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

let crawlInFlight = false;

function encodeSse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function isAuthorizedCrawl(request: Request) {
  const secret = process.env.CRAWL_SECRET?.trim();
  if (!secret) return true;
  return request.headers.get("x-crawl-secret") === secret;
}

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "jobs-crawl", 3, 60 * 60 * 1000);
  if (limited) return limited;

  if (!isAuthorizedCrawl(request)) {
    return Response.json({ error: "Unauthorized crawl request." }, { status: 401 });
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return Response.json({ error: "Complete onboarding before running a crawl." }, { status: 403 });
  }

  if (crawlInFlight) {
    return Response.json({ error: "A crawl is already running. Try again in a minute." }, { status: 409 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    provider?: AiProviderId;
    model?: string;
    apiKey?: string;
    limit?: number;
    autoApprove?: boolean;
  };

  const limit = Number(body.limit ?? process.env.INGEST_LIMIT ?? 8);
  const ai = resolveIngestAiOptions(
    {
      provider: body.provider,
      model: body.model,
      apiKey: body.apiKey,
    },
    { allowEnvApiKey: false },
  );

  const encoder = new TextEncoder();
  crawlInFlight = true;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeSse(event, data)));
      };

      try {
        send("status", { state: "started" });

        const summary = await runJobIngest({
          sources: ["jobnet", "techcareer"],
          limitPerSource: Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 20) : 8,
          autoApprove: body.autoApprove === true,
          ai,
          onProgress: (event: CrawlProgressEvent) => send("progress", event),
        });

        const payload: Omit<RunJobIngestSummary, "results"> = {
          fetched: summary.fetched,
          imported: summary.imported,
          duplicate: summary.duplicate,
          needsReview: summary.needsReview,
          approved: summary.approved,
          provider: summary.provider,
          model: summary.model,
          aiUsed: summary.aiUsed,
        };
        send("done", payload);
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Crawl failed.",
        });
      } finally {
        crawlInFlight = false;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
