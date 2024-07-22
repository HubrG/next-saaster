/*
  Warnings:

  - You are about to drop the column `input` on the `UserUsage` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `UserUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserUsage" DROP COLUMN "input",
DROP COLUMN "output",
ADD COLUMN     "inputTokenAI" INTEGER DEFAULT 0,
ADD COLUMN     "outputTokenAI" INTEGER DEFAULT 0;
