import { Feature, Plan, PlanToFeature, StripePlanCoupon } from "@prisma/client";
import { iStripeCoupon } from "./iStripeCoupons";
import { iStripeProduct } from "./iStripeProducts";

interface PlanFeature extends PlanToFeature {
  feature: Feature;
}

export interface iPlan extends Plan {
  Features: PlanFeature[];
  StripeProduct: iStripeProduct[];
  coupons: (StripePlanCoupon & {
    coupon: iStripeCoupon;
  })[];
  prevState: () => void;
}
