import type { MarketRole } from "@/lib/jobs/market-types";

export type DemandTier = "hot" | "rising" | "noted";

export type ItemDemand = {
  itemSlug: string;
  share: number;
  count: number;
  topSkill: string;
  skillSlugs: string[];
  tier: DemandTier;
};

export type RoadmapDemandSnapshot = {
  role: MarketRole;
  jobCount: number;
  byItemSlug: Record<string, ItemDemand>;
};
