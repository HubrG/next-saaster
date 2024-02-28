/*
  Warnings:

  - You are about to drop the column `amount` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `canceled` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isMonthly` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isYearly` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `nextPayment` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `stripeSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "amount",
DROP COLUMN "canceled",
DROP COLUMN "currency",
DROP COLUMN "isFree",
DROP COLUMN "isMonthly",
DROP COLUMN "isYearly",
DROP COLUMN "nextPayment",
DROP COLUMN "planId",
DROP COLUMN "sessionId",
DROP COLUMN "stripePriceId",
DROP COLUMN "stripeProductId",
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "priceId" INTEGER,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'usd',
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amount" INTEGER,
    "currency" TEXT,
    "status" TEXT DEFAULT 'usd',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneTimePayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneTimePayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneTimePayment" ADD CONSTRAINT "OneTimePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
