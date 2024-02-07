/*
  Warnings:

  - The primary key for the `StripePlanCoupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StripePlanCoupon` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StripePlanCoupon_MRRSPlanId_couponId_key";

-- AlterTable
ALTER TABLE "StripePlanCoupon" DROP CONSTRAINT "StripePlanCoupon_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StripePlanCoupon_pkey" PRIMARY KEY ("MRRSPlanId", "couponId");
