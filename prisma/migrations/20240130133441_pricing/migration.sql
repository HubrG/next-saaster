/*
  Warnings:

  - You are about to drop the column `active` on the `MRRSFeature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MRRSFeature" DROP COLUMN "active",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "onlyOnSelectedPlans" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "MRRSFeatureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Features category name',
    "description" TEXT DEFAULT 'Features category description',
    "position" INTEGER DEFAULT 999,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MRRSFeatureCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MRRSFeature" ADD CONSTRAINT "MRRSFeature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MRRSFeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
