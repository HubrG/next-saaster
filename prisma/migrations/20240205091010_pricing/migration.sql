/*
  Warnings:

  - Changed the type of `created` on the `StripePrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created` on the `StripeProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updated` on the `StripeProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StripePrice" DROP COLUMN "created",
ADD COLUMN     "created" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "created",
ADD COLUMN     "created" INTEGER NOT NULL,
DROP COLUMN "updated",
ADD COLUMN     "updated" INTEGER NOT NULL;
