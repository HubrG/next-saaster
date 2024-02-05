/*
  Warnings:

  - You are about to drop the column `plan` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeProduct" DROP CONSTRAINT "StripeProduct_plan_fkey";

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "plan",
ADD COLUMN     "planId" TEXT;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
