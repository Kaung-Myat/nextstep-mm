import "server-only";

import { getRedisClient } from "@/lib/redis";

const LOCK_KEY = "nextstep:crawl-lock";
/** Slightly above Vercel maxDuration so a crashed instance auto-expires. */
const LOCK_TTL_MS = 310_000;

let memoryLockUntil = 0;
let memoryLockOwner: string | null = null;

function newOwnerId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Acquire a crawl lock shared across serverless instances when Redis is configured.
 * Falls back to per-process memory lock for local/dev.
 */
export async function acquireCrawlLock(): Promise<{ ok: true; owner: string } | { ok: false }> {
  const owner = newOwnerId();
  const redis = getRedisClient();

  if (redis) {
    const result = await redis.set(LOCK_KEY, owner, { nx: true, px: LOCK_TTL_MS });
    if (result === "OK") return { ok: true, owner };
    return { ok: false };
  }

  const now = Date.now();
  if (memoryLockUntil > now) return { ok: false };
  memoryLockUntil = now + LOCK_TTL_MS;
  memoryLockOwner = owner;
  return { ok: true, owner };
}

export async function releaseCrawlLock(owner: string) {
  const redis = getRedisClient();
  if (redis) {
    const current = await redis.get<string>(LOCK_KEY);
    if (current === owner) await redis.del(LOCK_KEY);
    return;
  }

  if (memoryLockOwner === owner) {
    memoryLockOwner = null;
    memoryLockUntil = 0;
  }
}
