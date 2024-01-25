/*
  Warnings:

  - You are about to drop the column `uniqueCreditType` on the `appSettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SaasTypes" AS ENUM ('CREDIT', 'MRR_SIMPLE', 'MRR_COMPLEXE');

-- AlterTable
ALTER TABLE "appSettings" DROP COLUMN "uniqueCreditType";

-- CreateTable
CREATE TABLE "SaasSettings" (
    "id" TEXT NOT NULL,
    "saasType" "SaasTypes" NOT NULL DEFAULT 'MRR_SIMPLE',
    "activeYearlyPlans" BOOLEAN DEFAULT true,
    "activeMonthlyPlans" BOOLEAN DEFAULT true,
    "tax" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SaasSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MRRSPlan" (
    "id" TEXT NOT NULL,
    "isCustom" BOOLEAN DEFAULT false,
    "isPopular" BOOLEAN DEFAULT false,
    "isRecommended" BOOLEAN DEFAULT false,
    "isTrial" BOOLEAN DEFAULT false,
    "trialDays" INTEGER DEFAULT 0,
    "isMonthly" BOOLEAN DEFAULT false,
    "monthlyPrice" DOUBLE PRECISION DEFAULT 0,
    "isYearly" BOOLEAN DEFAULT false,
    "yearlyPrice" DOUBLE PRECISION DEFAULT 0,
    "isCredit" BOOLEAN DEFAULT false,
    "creditAllouedByMonth" INTEGER DEFAULT 0,
    "currency" TEXT DEFAULT 'usd',
    "active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MRRSPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MRRSFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "alias" TEXT,
    "description" TEXT,
    "active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MRRSFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MRRSPlanToFeature" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "MRRSPlanToFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MRRSFeature_alias_key" ON "MRRSFeature"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "MRRSPlanToFeature_planId_featureId_key" ON "MRRSPlanToFeature"("planId", "featureId");

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRRSPlanToFeature" ADD CONSTRAINT "MRRSPlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "MRRSFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
