/*
  Warnings:

  - You are about to drop the column `unsubscribe` on the `ResendContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResendContact" DROP COLUMN "unsubscribe",
ADD COLUMN     "unsubscribed" BOOLEAN DEFAULT false;
