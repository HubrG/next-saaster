/*
  Warnings:

  - You are about to drop the column `consumeCredit` on the `UserUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserUsage" DROP COLUMN "consumeCredit",
ADD COLUMN     "consumeStripeMeteredCredit" INTEGER DEFAULT 0;
