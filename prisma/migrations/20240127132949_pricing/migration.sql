/*
  Warnings:

  - You are about to drop the `MRRSFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_featureId_fkey";

-- AlterTable
ALTER TABLE "MRRSPlanToFeature" ADD COLUMN     "creditAllouedByMonth" INTEGER DEFAULT 0,
ADD COLUMN     "creditCost" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "MRRSFeature";

-- CreateTable
CREATE TABLE "MMRSFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "alias" TEXT,
    "description" TEXT,
    "active" BOOLEAN DEFAULT false,
    "position" INTEGER DEFAULT 0,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MMRSFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MMRSFeature_alias_key" ON "MMRSFeature"("alias");

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MMRSFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
