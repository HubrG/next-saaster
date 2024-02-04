/*
  Warnings:

  - You are about to drop the column `description` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `pricingId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pricingId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "description",
DROP COLUMN "pricingId",
DROP COLUMN "status",
ADD COLUMN     "canceled" BOOLEAN DEFAULT false,
ADD COLUMN     "isFree" BOOLEAN DEFAULT false,
ADD COLUMN     "isMonthly" BOOLEAN DEFAULT false,
ADD COLUMN     "isYearly" BOOLEAN DEFAULT false,
ADD COLUMN     "nextPayment" TIMESTAMP(3),
ADD COLUMN     "planId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "StripePaymentId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscriptionId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MRRSPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
