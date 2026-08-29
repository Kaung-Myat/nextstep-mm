import "server-only";

import { Redis } from "@upstash/redis";

let redisClient: Redis | null | undefined;

/** Shared Upstash Redis client. Returns null when env is unset. */
export function getRedisClient() {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

export function isRedisConfigured() {
  return getRedisClient() !== null;
}
