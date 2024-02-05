/*
  Warnings:

  - You are about to drop the column `planId` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeProduct" DROP CONSTRAINT "StripeProduct_planId_fkey";

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "planId",
ADD COLUMN     "MRRSPlanId" TEXT;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_MRRSPlanId_fkey" FOREIGN KEY ("MRRSPlanId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
