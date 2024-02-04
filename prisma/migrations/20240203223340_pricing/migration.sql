/*
  Warnings:

  - You are about to drop the `MRRSUserFeatures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MRRSUserFeatures" DROP CONSTRAINT "MRRSUserFeatures_featureId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSUserFeatures" DROP CONSTRAINT "MRRSUserFeatures_planId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSUserFeatures" DROP CONSTRAINT "MRRSUserFeatures_userId_fkey";

-- DropTable
DROP TABLE "MRRSUserFeatures";

-- CreateTable
CREATE TABLE "MRRSUserFeature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "creditRemaining" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MRRSUserFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MRRSUserFeature_userId_featureId_planId_key" ON "MRRSUserFeature"("userId", "featureId", "planId");

-- AddForeignKey
ALTER TABLE "MRRSUserFeature" ADD CONSTRAINT "MRRSUserFeature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSUserFeature" ADD CONSTRAINT "MRRSUserFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MRRSFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSUserFeature" ADD CONSTRAINT "MRRSUserFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
