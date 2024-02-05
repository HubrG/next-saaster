/*
  Warnings:

  - You are about to drop the column `billing_scheme` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `custom_unit_amount` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `livemode` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `lookup_key` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `object` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `tax_behavior` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `tiers_mode` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `transform_quantity` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `attributes` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `object` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `package_dimensions` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `shippable` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `statement_descriptor` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `tax_code` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripePrice" DROP COLUMN "billing_scheme",
DROP COLUMN "custom_unit_amount",
DROP COLUMN "livemode",
DROP COLUMN "lookup_key",
DROP COLUMN "nickname",
DROP COLUMN "object",
DROP COLUMN "tax_behavior",
DROP COLUMN "tiers_mode",
DROP COLUMN "transform_quantity";

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "attributes",
DROP COLUMN "features",
DROP COLUMN "images",
DROP COLUMN "object",
DROP COLUMN "package_dimensions",
DROP COLUMN "shippable",
DROP COLUMN "statement_descriptor",
DROP COLUMN "tax_code",
DROP COLUMN "type";
