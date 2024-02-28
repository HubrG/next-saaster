import {
  Feature,
  Plan,
  PlanToFeature,
  StripeCoupon,
  StripePlanCoupon,
  StripePrice,
  StripeProduct,
  Subscription,
  SubscriptionPayment,
} from "@prisma/client";
import { iUsers } from "./iUsers";
interface PlanFeature extends PlanToFeature {
  feature: Feature;
}

interface PlanCoupon extends StripePlanCoupon {
  coupon: StripeCoupon;
}

interface subscriptionPriceProductRelationPlanRelation extends Plan {
  Features: PlanFeature[] | null;
  coupons: PlanCoupon[] | null;
}

interface subscriptionPriceProductRelation extends StripeProduct {
  PlanRelation?: subscriptionPriceProductRelationPlanRelation | null;
}

interface subscriptionPrice extends StripePrice {
  productRelation?: subscriptionPriceProductRelation | null;
}

export interface iSubscription extends Subscription {
  user: iUsers | null;
  SubscriptionPayments?: Partial<SubscriptionPayment>[];
  price?: subscriptionPrice | null;
}

