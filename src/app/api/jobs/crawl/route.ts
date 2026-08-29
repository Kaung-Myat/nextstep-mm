import type { AiProviderId } from "@/lib/ai/providers";
import { rateLimitResponse } from "@/lib/api/rate-limit";
import { acquireCrawlLock, releaseCrawlLock } from "@/lib/jobs/crawl-lock";
import { resolveIngestAiOptions } from "@/lib/jobs/ingest-ai";
import { runJobIngest, type CrawlProgressEvent, type RunJobIngestSummary } from "@/lib/jobs/run-ingest";
import { getCurrentProfile } from "@/lib/profile";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function encodeSse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function requestHost(request: Request) {
  return request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host")?.trim() || "";
}

function isSameOriginBrowserRequest(request: Request) {
  const host = requestHost(request).toLowerCase();
  if (!host) return false;

  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  // Block explicit cross-site / same-site (sibling subdomain) browser requests.
  if (secFetchSite === "cross-site" || secFetchSite === "same-site") return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  // Privacy tools may strip Origin/Referer. Allow when a session cookie is present
  // and Sec-Fetch-Site is same-origin, none, or missing. Profile auth still required.
  const hasSessionCookie = Boolean(request.headers.get("cookie")?.includes("nextstep_user"));
  return hasSessionCookie && (secFetchSite === "same-origin" || secFetchSite === "none" || !secFetchSite);
}

function isAuthorizedCrawl(request: Request) {
  const secret = process.env.CRAWL_SECRET?.trim();

  if (secret) {
    if (request.headers.get("x-crawl-secret") === secret) return true;
    return isSameOriginBrowserRequest(request);
  }

  if (process.env.NODE_ENV === "production") {
    return isSameOriginBrowserRequest(request);
  }

  return true;
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

  const lock = await acquireCrawlLock();
  if (!lock.ok) {
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
  const lockOwner = lock.owner;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(encodeSse(event, data)));
        } catch {
          // Client disconnected — keep ingest running to completion.
        }
      };

      try {
        send("status", { state: "started" });

        const summary = await runJobIngest({
          sources: ["jobnet", "techcareer"],
          limitPerSource: Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 20) : 8,
          autoApprove: body.autoApprove === true,
          ai,
          allowEnvApiKey: false,
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
          aiSuccessCount: summary.aiSuccessCount,
        };
        send("done", payload);
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Crawl failed.",
        });
      } finally {
        await releaseCrawlLock(lockOwner);
        try {
          controller.close();
        } catch {
          // already closed
        }
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
