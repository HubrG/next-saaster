/*
  Warnings:

  - You are about to drop the column `planId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OneTimePayment" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "planId";
