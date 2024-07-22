/*
  Warnings:

  - You are about to drop the column `ConsumeCredit` on the `UserUsage` table. All the data in the column will be lost.
  - You are about to drop the column `ConsumeCreditAllouedByMonth` on the `UserUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserUsage" DROP COLUMN "ConsumeCredit",
DROP COLUMN "ConsumeCreditAllouedByMonth",
ADD COLUMN     "consumeCredit" INTEGER DEFAULT 0,
ADD COLUMN     "consumeCreditAllouedByMonth" INTEGER DEFAULT 0;
