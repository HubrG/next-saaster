/*
  Warnings:

  - You are about to drop the column `activeRefill` on the `appSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaasSettings" ADD COLUMN     "activeRefillCredit" BOOLEAN DEFAULT true,
ALTER COLUMN "tax" SET DEFAULT 0,
ALTER COLUMN "tax" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "appSettings" DROP COLUMN "activeRefill";
