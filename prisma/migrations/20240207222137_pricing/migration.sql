-- DropForeignKey
ALTER TABLE "StripePlanCoupon" DROP CONSTRAINT "StripePlanCoupon_MRRSPlanId_fkey";

-- DropForeignKey
ALTER TABLE "StripePlanCoupon" DROP CONSTRAINT "StripePlanCoupon_couponId_fkey";

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_MRRSPlanId_fkey" FOREIGN KEY ("MRRSPlanId") REFERENCES "MRRSPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "StripeCoupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
