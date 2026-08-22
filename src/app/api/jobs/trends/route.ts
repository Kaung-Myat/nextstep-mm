import { getMarketTrends, type MarketTrendsFilters } from "@/lib/jobs/market";

function parseRole(value: string | null): MarketTrendsFilters["role"] {
  if (value === "frontend" || value === "backend" || value === "fullstack") return value;
  return "all";
}

function parseLevel(value: string | null): MarketTrendsFilters["level"] {
  if (value === "intern" || value === "junior") return value;
  return "all";
}

function parseRange(value: string | null): MarketTrendsFilters["range"] {
  const parsed = Number.parseInt(value ?? "90", 10);
  if (parsed === 30 || parsed === 90 || parsed === 999) return parsed;
  return 90;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const snapshot = await getMarketTrends({
    role: parseRole(searchParams.get("role")),
    level: parseLevel(searchParams.get("level")),
    range: parseRange(searchParams.get("range")),
  });

  return Response.json(snapshot);
}
