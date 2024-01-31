/*
  Warnings:

  - You are about to drop the column `displayFeaturesByList` on the `SaasSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaasSettings" DROP COLUMN "displayFeaturesByList",
ADD COLUMN     "activeFeatureAdvancedComparison" BOOLEAN DEFAULT false,
ADD COLUMN     "activeFeatureComparison" BOOLEAN DEFAULT false,
ADD COLUMN     "displayFeaturesByCategory" BOOLEAN DEFAULT false;
