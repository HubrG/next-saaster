import { StripePlanCoupon } from "@prisma/client";
import { iPlan } from "./iPlans";
import { iStripeCoupon } from "./iStripeCoupons";

export interface iStripePlanCoupon extends StripePlanCoupon {
  Plan: iPlan;
  coupon: iStripeCoupon;
}
