import { listApprovedMarketJobsPage } from "@/lib/jobs/market";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number.parseInt(searchParams.get("limit") ?? "20", 10);

  const page = await listApprovedMarketJobsPage({
    cursor,
    limit: Number.isFinite(limit) ? limit : 20,
  });

  return Response.json(page);
}
