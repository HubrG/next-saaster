import {
  Feature,
  OneTimePayment,
  Plan,
  PlanToFeature,
  ResendContact,
  StripeCoupon,
  StripePlanCoupon,
  StripePrice,
  StripeProduct,
  Subscription,
  SubscriptionPayment,
  User,
} from "@prisma/client";


interface PlanFeature extends PlanToFeature {
  feature: Feature;
}

interface PlanCoupon extends StripePlanCoupon {
  coupon: StripeCoupon;
}

interface UserPriceProductRelationPlanRelation extends Plan {
  Features?: PlanFeature[] | null;
  coupons?: PlanCoupon[] | null;
}

interface UserStripePricePlanRelation extends StripeProduct {
  PlanRelation?: UserPriceProductRelationPlanRelation | null;
}
interface UserStripePrice extends StripePrice {
  productRelation: UserStripePricePlanRelation | null;
}
// 
interface UserSubscriptionPriceProduct extends StripeProduct {
  PlanRelation: UserPriceProductRelationPlanRelation | null;
}
interface UserSubscriptionPrice extends StripePrice {
  productRelation: UserSubscriptionPriceProduct | null;
}

interface UserSubscription extends Subscription {
  price: UserSubscriptionPrice | null;
  SubscriptionPayments: SubscriptionPayment[];
}

interface UserOneTimePayment extends OneTimePayment {
  price: UserSubscriptionPrice | null;
}

export interface iUsers extends User {
  subscriptions?: UserSubscription[] | null;
  oneTimePayments?: UserOneTimePayment[] | null;
  contacts?: ResendContact[];
  stripePrice?: UserStripePrice | null;
}
