import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { getPrisma } from "@/lib/db";

const USER_COOKIE = "nextstep_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function sessionSecret() {
  const fromEnv =
    process.env.SESSION_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.CRAWL_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[auth] SESSION_SECRET is not set. Anonymous session cookies are weakly protected. Set SESSION_SECRET in production.",
    );
  }
  return "nextstep-dev-session-secret";
}

function signUserId(userId: string) {
  const sig = createHmac("sha256", sessionSecret()).update(userId).digest("base64url");
  return `${userId}.${sig}`;
}

function verifySignedUserId(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const separator = raw.lastIndexOf(".");
  if (separator <= 0) {
    // Legacy unsigned cookie — accept only when no production secret is configured.
    const hasStrongSecret = Boolean(
      process.env.SESSION_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || process.env.CRAWL_SECRET?.trim(),
    );
    if (hasStrongSecret && process.env.NODE_ENV === "production") return null;
    if (/^[0-9a-f-]{36}$/i.test(raw)) return raw;
    return null;
  }

  const userId = raw.slice(0, separator);
  const provided = raw.slice(separator + 1);
  if (!userId || !provided) return null;

  const expected = createHmac("sha256", sessionSecret()).update(userId).digest("base64url");
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return userId;
}

function setUserCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, userId: string) {
  cookieStore.set(USER_COOKIE, signUserId(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getCurrentUserId() {
  const raw = (await cookies()).get(USER_COOKIE)?.value;
  return verifySignedUserId(raw);
}

export async function requireCurrentUser() {
  const cookieStore = await cookies();
  const existingId = verifySignedUserId(cookieStore.get(USER_COOKIE)?.value);
  const prisma = getPrisma();

  if (existingId) {
    const existingUser = await prisma.user.findUnique({ where: { id: existingId } });
    if (existingUser) {
      // Re-sign legacy cookies so they pick up HMAC after SESSION_SECRET is added.
      const current = cookieStore.get(USER_COOKIE)?.value;
      if (current && !current.includes(".")) setUserCookie(cookieStore, existingUser.id);
      return existingUser;
    }
  }

  const id = crypto.randomUUID();
  const user = await prisma.user.create({
    data: { id, email: `${id}@anonymous.nextstep-mm.local` },
  });

  setUserCookie(cookieStore, user.id);
  return user;
}
