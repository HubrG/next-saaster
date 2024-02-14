/*
  Warnings:

  - You are about to drop the column `MRRSPlanId` on the `StripePlanCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `MRRSPlanId` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the `MRRSFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MRRSFeatureCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MRRSPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MRRSPlanToFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MRRSUserFeature` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[PlanId,couponId,recurrence]` on the table `StripePlanCoupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PlanId]` on the table `StripeProduct` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `PlanId` to the `StripePlanCoupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MRRSFeature" DROP CONSTRAINT "MRRSFeature_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSPlanToFeature" DROP CONSTRAINT "MRRSPlanToFeature_planId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSUserFeature" DROP CONSTRAINT "MRRSUserFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSUserFeature" DROP CONSTRAINT "MRRSUserFeature_planId_fkey";

-- DropForeignKey
ALTER TABLE "MRRSUserFeature" DROP CONSTRAINT "MRRSUserFeature_userId_fkey";

-- DropForeignKey
ALTER TABLE "StripePlanCoupon" DROP CONSTRAINT "StripePlanCoupon_MRRSPlanId_fkey";

-- DropForeignKey
ALTER TABLE "StripeProduct" DROP CONSTRAINT "StripeProduct_MRRSPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropIndex
DROP INDEX "StripePlanCoupon_MRRSPlanId_couponId_recurrence_key";

-- DropIndex
DROP INDEX "StripeProduct_MRRSPlanId_key";

-- AlterTable
ALTER TABLE "StripePlanCoupon" DROP COLUMN "MRRSPlanId",
ADD COLUMN     "PlanId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "MRRSPlanId",
ADD COLUMN     "PlanId" TEXT;

-- DropTable
DROP TABLE "MRRSFeature";

-- DropTable
DROP TABLE "MRRSFeatureCategory";

-- DropTable
DROP TABLE "MRRSPlan";

-- DropTable
DROP TABLE "MRRSPlanToFeature";

-- DropTable
DROP TABLE "MRRSUserFeature";

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Plan name',
    "description" TEXT DEFAULT 'Plan description',
    "isCustom" BOOLEAN DEFAULT false,
    "isPopular" BOOLEAN DEFAULT false,
    "isRecommended" BOOLEAN DEFAULT false,
    "isTrial" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN DEFAULT false,
    "trialDays" INTEGER DEFAULT 0,
    "isMonthly" BOOLEAN DEFAULT false,
    "monthlyPrice" DOUBLE PRECISION DEFAULT 0,
    "isYearly" BOOLEAN DEFAULT false,
    "yearlyPrice" DOUBLE PRECISION DEFAULT 0,
    "oncePrice" DOUBLE PRECISION DEFAULT 0,
    "isCredit" BOOLEAN DEFAULT false,
    "creditAllouedByMonth" INTEGER DEFAULT 0,
    "stripeId" TEXT,
    "stripeYearlyPriceId" TEXT,
    "stripeMonthlyPriceId" TEXT,
    "stripeFreePriceId" TEXT,
    "saasType" "SaasTypes" NOT NULL DEFAULT 'MRR_SIMPLE',
    "active" BOOLEAN DEFAULT false,
    "position" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT '',
    "alias" TEXT,
    "description" TEXT DEFAULT '',
    "onlyOnSelectedPlans" BOOLEAN DEFAULT false,
    "categoryId" TEXT,
    "position" INTEGER DEFAULT 9999,
    "positionCategory" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanToFeature" (
    "id" TEXT NOT NULL,
    "creditCost" INTEGER DEFAULT 0,
    "creditAllouedByMonth" INTEGER DEFAULT 0,
    "active" BOOLEAN DEFAULT false,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "PlanToFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT DEFAULT 'Features category description',
    "position" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FeatureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "creditRemaining" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripeId_key" ON "Plan"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_alias_key" ON "Feature"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "PlanToFeature_planId_featureId_key" ON "PlanToFeature"("planId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureCategory_name_key" ON "FeatureCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeature_userId_featureId_planId_key" ON "UserFeature"("userId", "featureId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePlanCoupon_PlanId_couponId_recurrence_key" ON "StripePlanCoupon"("PlanId", "couponId", "recurrence");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_PlanId_key" ON "StripeProduct"("PlanId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanToFeature" ADD CONSTRAINT "PlanToFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanToFeature" ADD CONSTRAINT "PlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_PlanId_fkey" FOREIGN KEY ("PlanId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_PlanId_fkey" FOREIGN KEY ("PlanId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
