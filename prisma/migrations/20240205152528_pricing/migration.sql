/*
  Warnings:

  - You are about to drop the `PlanCoupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanCoupon" DROP CONSTRAINT "PlanCoupon_MRRSPlanId_fkey";

-- DropForeignKey
ALTER TABLE "PlanCoupon" DROP CONSTRAINT "PlanCoupon_couponId_fkey";

-- DropTable
DROP TABLE "PlanCoupon";

-- CreateTable
CREATE TABLE "StripePlanCoupon" (
    "MRRSPlanId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,

    CONSTRAINT "StripePlanCoupon_pkey" PRIMARY KEY ("MRRSPlanId","couponId")
);

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_MRRSPlanId_fkey" FOREIGN KEY ("MRRSPlanId") REFERENCES "MRRSPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "StripeCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
