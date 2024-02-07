import { MRRSPlan, StripeCoupon, StripePlanCoupon } from "@prisma/client";

export type MRRSStripeCouponsWithPlans = StripeCoupon & {
  MRRSPlan: MRRSPlan;
  StripePlanCoupons: StripePlanCoupon[];
};
