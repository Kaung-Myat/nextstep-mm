import { rateLimitResponse } from "@/lib/api/rate-limit";
import { listApprovedMarketJobsPage, MarketJobsQueryError } from "@/lib/jobs/market";

export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "jobs-list", 120, 60 * 1000);
  if (limited) return limited;
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number.parseInt(searchParams.get("limit") ?? "20", 10);

  try {
    const page = await listApprovedMarketJobsPage({
      cursor,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    return Response.json(page);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load jobs.";
    const status = error instanceof MarketJobsQueryError && message.includes("cursor") ? 400 : 503;
    return Response.json({ error: message, jobs: [], nextCursor: null, hasMore: false }, { status });
  }
}
