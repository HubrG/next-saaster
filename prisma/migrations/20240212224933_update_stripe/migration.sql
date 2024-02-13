/*
  Warnings:

  - You are about to drop the column `default_price` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `default_price_currency` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `default_price_id` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "default_price",
DROP COLUMN "default_price_currency",
DROP COLUMN "default_price_id";
