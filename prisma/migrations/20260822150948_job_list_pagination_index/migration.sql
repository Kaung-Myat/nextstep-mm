-- CreateIndex
CREATE INDEX "Job_status_postedAt_createdAt_idx" ON "Job"("status", "postedAt", "createdAt");
