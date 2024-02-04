/*
  Warnings:

  - You are about to drop the column `creditCost` on the `MRRSUserFeatures` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MRRSUserFeatures" DROP COLUMN "creditCost",
ADD COLUMN     "creditRemaining" INTEGER DEFAULT 0;
