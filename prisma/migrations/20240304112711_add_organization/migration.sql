/*
  Warnings:

  - You are about to drop the column `discount` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "discount",
DROP COLUMN "items";
