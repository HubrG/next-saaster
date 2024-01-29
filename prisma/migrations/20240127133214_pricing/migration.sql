/*
  Warnings:

  - You are about to drop the `MMRSFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_featureId_fkey";

-- DropTable
DROP TABLE "MMRSFeature";

-- CreateTable
CREATE TABLE "MRRSFeature" (
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

    CONSTRAINT "MRRSFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MRRSFeature_alias_key" ON "MRRSFeature"("alias");

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MRRSFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
