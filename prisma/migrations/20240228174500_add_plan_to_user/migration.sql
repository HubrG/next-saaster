/*
  Warnings:

  - You are about to drop the column `creditRemaining` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "creditRemaining" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "creditRemaining";
