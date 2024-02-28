/*
  Warnings:

  - You are about to drop the column `priceId` on the `OneTimePayment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OneTimePayment" DROP CONSTRAINT "OneTimePayment_priceId_fkey";

-- AlterTable
ALTER TABLE "OneTimePayment" DROP COLUMN "priceId";
