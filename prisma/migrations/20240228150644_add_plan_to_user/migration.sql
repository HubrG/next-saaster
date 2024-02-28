/*
  Warnings:

  - You are about to alter the column `amount` on the `OneTimePayment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "OneTimePayment" ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
