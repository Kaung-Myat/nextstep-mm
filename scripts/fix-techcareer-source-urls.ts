import "dotenv/config";

import { getPrisma } from "@/lib/db";

const FROM = "https://techcareerweb.com/articles/";
const TO = "https://techcareerweb.com/article-details/";

async function main() {
  const jobs = await getPrisma().job.findMany({
    where: { sourceUrl: { startsWith: FROM } },
    select: { id: true, title: true, sourceUrl: true },
  });

  if (jobs.length === 0) {
    console.log("No Tech Career /articles/ URLs to rewrite.");
    return;
  }

  for (const job of jobs) {
    const nextUrl = job.sourceUrl.replace(FROM, TO);
    await getPrisma().job.update({ where: { id: job.id }, data: { sourceUrl: nextUrl } });
    console.log(`UPDATED ${job.id}: ${job.title}`);
    console.log(`  ${job.sourceUrl}`);
    console.log(`  → ${nextUrl}`);
  }

  console.log(`Rewrote ${jobs.length} Tech Career source URL(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
