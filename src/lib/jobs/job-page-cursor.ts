import type { Prisma } from "@/generated/prisma/client";

export type JobsPageCursor = {
  postedAt: string | null;
  createdAt: string;
  id: string;
};

export function encodeJobsPageCursor(row: {
  postedAt: Date | string | null;
  createdAt: Date | string;
  id: string;
}): string {
  const payload: JobsPageCursor = {
    postedAt: row.postedAt ? new Date(row.postedAt).toISOString() : null,
    createdAt: new Date(row.createdAt).toISOString(),
    id: row.id,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeJobsPageCursor(raw: string): JobsPageCursor | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as JobsPageCursor;
    if (!parsed?.id || !parsed?.createdAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Matches orderBy: postedAt desc (nulls last), createdAt desc, id desc. */
export function jobsPageCursorWhere(cursor: JobsPageCursor): Prisma.JobWhereInput {
  const postedAt = cursor.postedAt ? new Date(cursor.postedAt) : null;
  const createdAt = new Date(cursor.createdAt);

  if (postedAt) {
    return {
      OR: [
        { postedAt: { lt: postedAt } },
        { postedAt, createdAt: { lt: createdAt } },
        { postedAt, createdAt, id: { lt: cursor.id } },
        { postedAt: null },
      ],
    };
  }

  return {
    AND: [
      { postedAt: null },
      {
        OR: [{ createdAt: { lt: createdAt } }, { createdAt, id: { lt: cursor.id } }],
      },
    ],
  };
}
