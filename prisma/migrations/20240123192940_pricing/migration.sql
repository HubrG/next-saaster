/*
  Warnings:

  - You are about to drop the column `monthlyPrice` on the `Pricing` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyTax` on the `Pricing` table. All the data in the column will be lost.
  - You are about to drop the column `yearlyPrice` on the `Pricing` table. All the data in the column will be lost.
  - You are about to drop the column `yearlyTax` on the `Pricing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pricing" DROP COLUMN "monthlyPrice",
DROP COLUMN "monthlyTax",
DROP COLUMN "yearlyPrice",
DROP COLUMN "yearlyTax",
ADD COLUMN     "isMonthly" BOOLEAN DEFAULT false,
ADD COLUMN     "isYearly" BOOLEAN DEFAULT false,
ADD COLUMN     "price" INTEGER DEFAULT 0,
ADD COLUMN     "tax" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "PricingFeature" ADD COLUMN     "creditMonthly" INTEGER DEFAULT 0,
ADD COLUMN     "creditYearly" INTEGER DEFAULT 0,
ADD COLUMN     "yearly" BOOLEAN DEFAULT false,
ADD COLUMN     "yearlyText" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "appSettings" ADD COLUMN     "activeRefill" BOOLEAN DEFAULT true,
ADD COLUMN     "uniqueCreditType" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "UserFeatureCreditBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "balance" INTEGER DEFAULT 0,

    CONSTRAINT "UserFeatureCreditBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "amount" INTEGER,
    "currency" TEXT,
    "invoice" TEXT,
    "description" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "amount" INTEGER,
    "pricingId" TEXT,
    "currency" TEXT DEFAULT 'usd',
    "description" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apiKeys" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "key" TEXT,
    "secret" TEXT,
    "active" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "apiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFeatureCreditBalance_userId_featureId_key" ON "UserFeatureCreditBalance"("userId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_key_key" ON "apiKeys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_secret_key" ON "apiKeys"("secret");

-- AddForeignKey
ALTER TABLE "UserFeatureCreditBalance" ADD CONSTRAINT "UserFeatureCreditBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatureCreditBalance" ADD CONSTRAINT "UserFeatureCreditBalance_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "PricingFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
