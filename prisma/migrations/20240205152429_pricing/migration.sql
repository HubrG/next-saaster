/*
  Warnings:

  - You are about to drop the `CouponMRRSPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CouponMRRSPlan" DROP CONSTRAINT "CouponMRRSPlan_MRRSPlanId_fkey";

-- DropForeignKey
ALTER TABLE "CouponMRRSPlan" DROP CONSTRAINT "CouponMRRSPlan_couponId_fkey";

-- AlterTable
ALTER TABLE "MRRSPlan" ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT;

-- DropTable
DROP TABLE "CouponMRRSPlan";

-- CreateTable
CREATE TABLE "PlanCoupon" (
    "MRRSPlanId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,

    CONSTRAINT "PlanCoupon_pkey" PRIMARY KEY ("MRRSPlanId","couponId")
);

-- AddForeignKey
ALTER TABLE "PlanCoupon" ADD CONSTRAINT "PlanCoupon_MRRSPlanId_fkey" FOREIGN KEY ("MRRSPlanId") REFERENCES "MRRSPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCoupon" ADD CONSTRAINT "PlanCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "StripeCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
