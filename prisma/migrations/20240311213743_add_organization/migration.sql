/*
  Warnings:

  - You are about to drop the column `amountOff` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `durationInMonths` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxRedemptions` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `percentOff` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `redeemBy` on the `StripeCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `timesRedeemed` on the `StripeCoupon` table. All the data in the column will be lost.
  - Added the required column `times_redeemed` to the `StripeCoupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripeCoupon" DROP COLUMN "amountOff",
DROP COLUMN "durationInMonths",
DROP COLUMN "maxRedemptions",
DROP COLUMN "percentOff",
DROP COLUMN "redeemBy",
DROP COLUMN "timesRedeemed",
ADD COLUMN     "amount_off" DOUBLE PRECISION,
ADD COLUMN     "duration_in_months" INTEGER,
ADD COLUMN     "max_redemptions" INTEGER,
ADD COLUMN     "percent_off" DOUBLE PRECISION,
ADD COLUMN     "redeem_by" INTEGER,
ADD COLUMN     "times_redeemed" INTEGER NOT NULL;
