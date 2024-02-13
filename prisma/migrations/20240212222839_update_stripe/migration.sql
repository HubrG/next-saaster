/*
  Warnings:

  - You are about to drop the column `created` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `livemode` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "created",
DROP COLUMN "livemode",
DROP COLUMN "updated",
DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "default_price" TEXT,
ADD COLUMN     "default_price_currency" TEXT,
ADD COLUMN     "default_price_id" TEXT,
ADD COLUMN     "statement_descriptor" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
