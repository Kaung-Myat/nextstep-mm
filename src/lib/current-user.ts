import { cookies } from "next/headers";

import { getPrisma } from "@/lib/db";

const USER_COOKIE = "nextstep_user";

export async function getCurrentUserId() {
  return (await cookies()).get(USER_COOKIE)?.value ?? null;
}

export async function requireCurrentUser() {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(USER_COOKIE)?.value;
  const prisma = getPrisma();

  if (existingId) {
    const existingUser = await prisma.user.findUnique({ where: { id: existingId } });
    if (existingUser) return existingUser;
  }

  const id = crypto.randomUUID();
  const user = await prisma.user.create({
    data: { id, email: `${id}@anonymous.nextstep-mm.local` },
  });

  cookieStore.set(USER_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return user;
}
