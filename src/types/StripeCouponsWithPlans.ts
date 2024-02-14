import { Plan, StripeCoupon, StripePlanCoupon } from "@prisma/client";

export type StripeCouponsWithPlans = StripeCoupon & {
  Plan: Plan;
  StripePlanCoupons?: StripePlanCoupon[]; // Rendre la propriété optionnelle
};