import "dotenv/config";

import { getPrisma } from "@/lib/db";

async function main() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  const pending = await getPrisma().job.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: Number.isFinite(limit) && limit && limit > 0 ? Math.floor(limit) : undefined,
    select: { id: true, title: true, sourceName: true },
  });

  if (pending.length === 0) {
    console.log("No PENDING jobs to approve.");
    return;
  }

  const result = await getPrisma().job.updateMany({
    where: { id: { in: pending.map((job) => job.id) } },
    data: { status: "APPROVED", reviewedAt: new Date() },
  });

  for (const job of pending) {
    console.log(`APPROVED ${job.id}: ${job.title} (${job.sourceName})`);
  }
  console.log(`Approved ${result.count} job(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
