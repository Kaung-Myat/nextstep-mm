-- CreateTable
CREATE TABLE "InternshipPrepProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipPrepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternshipPrepProgress_userId_idx" ON "InternshipPrepProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipPrepProgress_userId_itemKey_key" ON "InternshipPrepProgress"("userId", "itemKey");

-- AddForeignKey
ALTER TABLE "InternshipPrepProgress" ADD CONSTRAINT "InternshipPrepProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
