/*
  Warnings:

  - You are about to drop the column `consumeCreditAllouedByMonth` on the `UserUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserUsage" DROP COLUMN "consumeCreditAllouedByMonth",
ADD COLUMN     "AIProvider" TEXT DEFAULT 'openai',
ADD COLUMN     "consumeCredit" INTEGER DEFAULT 0;
