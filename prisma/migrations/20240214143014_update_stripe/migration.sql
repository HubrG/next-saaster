/*
  Warnings:

  - You are about to drop the column `created` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `object` on the `StripeCoupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeCoupon" DROP COLUMN "created",
DROP COLUMN "object";
