/*
  Warnings:

  - You are about to drop the `Pricing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricingFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricingFeatureCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricingToFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFeatureCreditBalance` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPERADMIN';

-- DropForeignKey
ALTER TABLE "PricingFeature" DROP CONSTRAINT "PricingFeature_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PricingToFeature" DROP CONSTRAINT "PricingToFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "PricingToFeature" DROP CONSTRAINT "PricingToFeature_pricingId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pricingId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeatureCreditBalance" DROP CONSTRAINT "UserFeatureCreditBalance_featureId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeatureCreditBalance" DROP CONSTRAINT "UserFeatureCreditBalance_userId_fkey";

-- DropTable
DROP TABLE "Pricing";

-- DropTable
DROP TABLE "PricingFeature";

-- DropTable
DROP TABLE "PricingFeatureCategory";

-- DropTable
DROP TABLE "PricingToFeature";

-- DropTable
DROP TABLE "UserFeatureCreditBalance";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "MRRSPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
