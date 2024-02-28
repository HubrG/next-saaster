/*
  Warnings:

  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "amount" TEXT,
ADD COLUMN     "percentOff" INTEGER DEFAULT 0,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "recurring" TEXT DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" DEFAULT 'unpaid';
