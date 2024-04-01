/*
  Warnings:

  - You are about to drop the column `quantity` on the `UserUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserUsage" DROP COLUMN "quantity",
ADD COLUMN     "ConsumeCreditAllouedByMonth" INTEGER DEFAULT 0,
ADD COLUMN     "quantityForFeature" INTEGER DEFAULT 0;
