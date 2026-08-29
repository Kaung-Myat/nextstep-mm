import "server-only";

import { Ratelimit } from "@upstash/ratelimit";

import { getRedisClient, isRedisConfigured } from "@/lib/redis";

/** In-memory fallback when Redis env is not configured (local dev). */
type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();
const redisLimiters = new Map<string, Ratelimit>();
let warnedMissingRedis = false;

export function isDistributedRateLimitEnabled() {
  return isRedisConfigured();
}

function getRedisLimiter(keyPrefix: string, limit: number, windowMs: number) {
  const cacheKey = `${keyPrefix}:${limit}:${windowMs}`;
  const existing = redisLimiters.get(cacheKey);
  if (existing) return existing;

  const redis = getRedisClient();
  if (!redis) throw new Error("Redis is not configured.");

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: `nextstep:${keyPrefix}`,
    analytics: false,
  });
  redisLimiters.set(cacheKey, limiter);
  return limiter;
}

export function clientIpFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function allowRequestInMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = memoryBuckets.get(key);
  if (!current || current.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function allowRequest(key: string, limit: number, windowMs: number) {
  const redis = getRedisClient();
  if (!redis) {
    if (process.env.NODE_ENV === "production" && !warnedMissingRedis) {
      warnedMissingRedis = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN unset. Using per-process in-memory limits (not shared across instances).",
      );
    }
    return allowRequestInMemory(key, limit, windowMs);
  }

  const prefix = key.split(":")[0] ?? "api";
  const limiter = getRedisLimiter(prefix, limit, windowMs);
  const result = await limiter.limit(key);
  return result.success;
}

export async function rateLimitResponse(request: Request, keyPrefix: string, limit: number, windowMs: number) {
  const ip = clientIpFromRequest(request);
  const allowed = await allowRequest(`${keyPrefix}:${ip}`, limit, windowMs);
  if (allowed) return null;
  return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of memoryBuckets) {
      if (bucket.resetAt <= now) memoryBuckets.delete(key);
    }
  }, 60_000).unref?.();
}
