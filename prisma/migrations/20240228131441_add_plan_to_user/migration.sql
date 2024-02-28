/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `SubscriptionPayment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubscriptionPayment" DROP COLUMN "paymentMethod",
ALTER COLUMN "stripePaymentIntentId" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
