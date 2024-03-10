import { StripeCoupon } from "@prisma/client";
import { iStripePlanCoupon } from "./iStripePlanCoupons";

export interface iStripeCoupon extends StripeCoupon {
  Plan: iStripePlanCoupon[];
}
