import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database operations.");
  }

  const runtimeUrl = new URL(connectionString);
  // Keep Neon/pg SSL compatible while staying explicit for upcoming pg major changes.
  if (runtimeUrl.searchParams.get("sslmode") === "require") {
    runtimeUrl.searchParams.set("sslmode", "verify-full");
  }

  return new Pool({
    connectionString: runtimeUrl.toString(),
    // Neon pooler + cold starts need more than the pg default (~0 / immediate fail under load).
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 20_000,
    max: 5,
  });
}

function createPrismaClient() {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = createPool();
    globalForPrisma.pgPool.on("error", (error) => {
      console.error("Unexpected Postgres pool error:", error.message);
    });
  }

  return new PrismaClient({ adapter: new PrismaPg(globalForPrisma.pgPool) });
}

export function getPrisma() {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}
