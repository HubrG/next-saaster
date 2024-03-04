/*
  Warnings:

  - You are about to drop the column `priceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_priceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_subscriptionId_fkey";

-- DropIndex
DROP INDEX "User_subscriptionId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "priceId",
DROP COLUMN "subscriptionId";
