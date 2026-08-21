-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN IF NOT EXISTS "audience" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "RoadmapSection" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "RoadmapSection" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';

UPDATE "RoadmapSection"
SET "slug" = CONCAT('section-', "sortOrder")
WHERE "slug" IS NULL OR "slug" = '';

ALTER TABLE "RoadmapSection" ALTER COLUMN "slug" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'RoadmapSection_roadmapId_slug_key'
  ) THEN
    ALTER TABLE "RoadmapSection" ADD CONSTRAINT "RoadmapSection_roadmapId_slug_key" UNIQUE ("roadmapId", "slug");
  END IF;
END $$;

-- RoadmapItem: replace string detail fields with structured JSON
ALTER TABLE "RoadmapItem" ADD COLUMN IF NOT EXISTS "difficulty" TEXT NOT NULL DEFAULT 'beginner';
ALTER TABLE "RoadmapItem" ADD COLUMN IF NOT EXISTS "miniProjects" JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE "RoadmapItem" DROP COLUMN IF EXISTS "miniProject";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'RoadmapItem' AND column_name = 'commonMistakes'
      AND data_type IN ('text', 'character varying')
  ) THEN
    ALTER TABLE "RoadmapItem" RENAME COLUMN "commonMistakes" TO "commonMistakes_legacy";
  END IF;
END $$;

ALTER TABLE "RoadmapItem" ADD COLUMN IF NOT EXISTS "commonMistakes" JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "RoadmapItem" DROP COLUMN IF EXISTS "commonMistakes_legacy";

-- App content documents (internship prep, advisor templates, etc.)
CREATE TABLE IF NOT EXISTS "AppContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AppContent_key_key" ON "AppContent"("key");
