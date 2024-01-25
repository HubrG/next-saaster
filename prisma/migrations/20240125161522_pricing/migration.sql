/*
  Warnings:

  - You are about to drop the column `currency` on the `MRRSPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MRRSPlan" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "SaasSettings" ADD COLUMN     "currency" TEXT DEFAULT 'usd';
