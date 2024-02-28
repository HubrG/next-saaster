/*
  Warnings:

  - You are about to drop the column `amount` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `percentOff` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `recurring` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "percentOff",
DROP COLUMN "quantity",
DROP COLUMN "recurring",
ADD COLUMN     "items" JSONB;
