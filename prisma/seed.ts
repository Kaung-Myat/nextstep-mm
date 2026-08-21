import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { LearningPath, UserLevel } from "../src/generated/prisma/enums";
import { CONTENT_KEYS } from "../src/lib/content/keys";
import {
  loadAdvisorTemplatesSource,
  loadInternshipPrepSource,
  loadRoadmapSources,
} from "../src/lib/content/load-source";
import type { RoadmapContentDefinition } from "../src/lib/content/schemas";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const pathEnum = {
  frontend: LearningPath.FRONTEND,
  backend: LearningPath.BACKEND,
  fullstack: LearningPath.FULLSTACK,
} as const;

const stageEnum = {
  beginner: UserLevel.BEGINNER,
  intermediate: UserLevel.INTERMEDIATE,
  "job-ready": UserLevel.JOB_READY,
} as const;

async function seedRoadmap(definition: RoadmapContentDefinition) {
  const roadmap = await prisma.roadmap.upsert({
    where: { path: pathEnum[definition.path] },
    create: {
      slug: definition.slug,
      title: definition.title,
      description: definition.summary,
      audience: definition.audience,
      path: pathEnum[definition.path],
    },
    update: {
      slug: definition.slug,
      title: definition.title,
      description: definition.summary,
      audience: definition.audience,
    },
  });

  for (const section of definition.sections) {
    const existing = await prisma.roadmapSection.findFirst({
      where: { roadmapId: roadmap.id, OR: [{ slug: section.slug }, { sortOrder: section.order }] },
    });

    const roadmapSection = existing
      ? await prisma.roadmapSection.update({
          where: { id: existing.id },
          data: {
            slug: section.slug,
            title: section.title,
            description: section.description,
            stage: stageEnum[section.stage],
            sortOrder: section.order,
          },
        })
      : await prisma.roadmapSection.create({
          data: {
            roadmapId: roadmap.id,
            slug: section.slug,
            title: section.title,
            description: section.description,
            stage: stageEnum[section.stage],
            sortOrder: section.order,
          },
        });

    for (const [index, item] of section.items.entries()) {
      const sortOrder = index + 1;
      await prisma.roadmapItem.upsert({
        where: { sectionId_slug: { sectionId: roadmapSection.id, slug: item.slug } },
        create: {
          sectionId: roadmapSection.id,
          slug: item.slug,
          title: item.title,
          description: item.description,
          difficulty: item.difficulty,
          whyItMatters: item.whyItMatters,
          expectedOutcome: item.expectedOutcome,
          miniProjects: item.miniProjects,
          commonMistakes: item.commonMistakes,
          nextTopic: item.nextTopic,
          resourceLinks: item.recommendedResources,
          sortOrder,
        },
        update: {
          title: item.title,
          description: item.description,
          difficulty: item.difficulty,
          whyItMatters: item.whyItMatters,
          expectedOutcome: item.expectedOutcome,
          miniProjects: item.miniProjects,
          commonMistakes: item.commonMistakes,
          nextTopic: item.nextTopic,
          resourceLinks: item.recommendedResources,
          sortOrder,
        },
      });
    }
  }
}

async function seedAppContentJson(key: string, payload: unknown) {
  await prisma.appContent.upsert({
    where: { key },
    create: { key, payload: payload as object },
    update: { payload: payload as object },
  });
}

async function main() {
  const roadmaps = loadRoadmapSources();
  const internshipPrep = loadInternshipPrepSource();
  const advisorTemplates = loadAdvisorTemplatesSource();

  for (const roadmap of roadmaps) {
    await seedRoadmap(roadmap);
  }
  await seedAppContentJson(CONTENT_KEYS.internshipPrep, internshipPrep);
  await seedAppContentJson(CONTENT_KEYS.advisorTemplates, advisorTemplates);

  console.log(
    `Seed complete: ${roadmaps.length} roadmaps, ${CONTENT_KEYS.internshipPrep}, ${CONTENT_KEYS.advisorTemplates}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
