import {
  Feature,
  Plan,
  PlanToFeature,
  StripeCoupon,
  StripePlanCoupon,
  StripePrice,
  StripeProduct,
} from "@prisma/client";

interface PlanFeature extends PlanToFeature {
  feature: Feature;
}

interface PlanStripeProduct extends StripeProduct {
  prices: StripePrice[];
}

interface PlanStripeCoupon extends StripePlanCoupon {
  coupon: StripeCoupon;
}

export interface iPlan extends Plan {
  Features: PlanFeature[];
  StripeProduct: PlanStripeProduct[];
  coupons: PlanStripeCoupon[];
  prevState?: () => void;
}
