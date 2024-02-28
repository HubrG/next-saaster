/*
  Warnings:

  - You are about to drop the column `productDescription` on the `OneTimePayment` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeature" DROP CONSTRAINT "UserFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeature" DROP CONSTRAINT "UserFeature_planId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeature" DROP CONSTRAINT "UserFeature_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "OneTimePayment" DROP COLUMN "productDescription",
ADD COLUMN     "priceId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "priceId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "UserFeature";

-- DropTable
DROP TABLE "UserSettings";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "StripePrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneTimePayment" ADD CONSTRAINT "OneTimePayment_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "StripePrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
