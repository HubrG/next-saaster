import { Plan, StripeCoupon } from "@prisma/client";

type StripeCouponExtra = {
  Plan: Plan;
  coupon: StripeCoupon;
};

export interface iStripeCoupon extends StripeCoupon {
  Plan: StripeCouponExtra[];
}
