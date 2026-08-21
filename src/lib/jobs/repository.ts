import { JobLevel, JobType } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/db";
import type { DedupCandidate, ExtractedSkill, NormalizedJobRecord, TrendRow } from "@/lib/jobs/types";

export interface JobsRepository {
  findDedupCandidates(job: NormalizedJobRecord): Promise<DedupCandidate[]>;
  save(job: NormalizedJobRecord, skills: ExtractedSkill[]): Promise<string>;
  listTrendRows(): Promise<TrendRow[]>;
}

export class PrismaJobsRepository implements JobsRepository {
  async findDedupCandidates(job: NormalizedJobRecord): Promise<DedupCandidate[]> {
    const rows = await getPrisma().job.findMany({
      where: {
        OR: [
          { sourceUrl: job.sourceUrl },
          { company: { name: { equals: job.companyName, mode: "insensitive" } }, title: { equals: job.title, mode: "insensitive" } },
        ],
      },
      select: { id: true, sourceUrl: true, title: true, location: true, postedAt: true, company: { select: { name: true } } },
      take: 20,
    });
    return rows.map((row) => ({ ...row, companyName: row.company.name }));
  }

  async save(job: NormalizedJobRecord, skills: ExtractedSkill[]) {
    return getPrisma().$transaction(async (tx) => {
      const existingCompany = await tx.company.findFirst({ where: { name: { equals: job.companyName, mode: "insensitive" } } });
      const company = existingCompany
        ? await tx.company.update({ where: { id: existingCompany.id }, data: { website: job.companyWebsite ?? undefined, location: job.location ?? undefined } })
        : await tx.company.create({ data: { name: job.companyName, website: job.companyWebsite, location: job.location } });
      const created = await tx.job.create({
        data: {
          companyId: company.id,
          title: job.title,
          sourceUrl: job.sourceUrl,
          sourceName: job.sourceName,
          location: job.location,
          level: job.level ? JobLevel[job.level] : null,
          jobType: JobType[job.jobType],
          status: "PENDING",
          rawDescription: job.rawDescription,
          normalizedDescription: job.normalizedDescription,
          postedAt: job.postedAt,
          lastCheckedAt: new Date(),
          skills: {
            create: skills.map((skill) => ({
              skill: {
                connectOrCreate: {
                  where: { slug: skill.slug },
                  create: { slug: skill.slug, name: skill.name, category: skill.category },
                },
              },
            })),
          },
        },
      });
      return created.id;
    });
  }

  async listTrendRows(): Promise<TrendRow[]> {
    const jobs = await getPrisma().job.findMany({ where: { status: "APPROVED" }, select: { id: true, title: true, level: true, jobType: true, skills: { select: { skill: { select: { slug: true } } } } } });
    return jobs.map((job) => ({ jobId: job.id, title: job.title, level: job.level, jobType: job.jobType, skillSlugs: job.skills.map((link) => link.skill.slug) }));
  }
}
