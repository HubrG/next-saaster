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
  User,
  UserSubscription,
} from "@prisma/client";
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
interface subscriptionUserSub extends UserSubscription {
  user: User | null;
}
export interface iSubscription extends Subscription {
  users: subscriptionUserSub[] | null;
  SubscriptionPayments?: Partial<SubscriptionPayment>[];
  price?: subscriptionPrice | null;
}



// 
interface Metadata {
  [key: string]: any; // Utilisez un type plus spécifique si vous connaissez la structure du metadata
}

interface TransformUsage {
  round: string;
  divide_by: number;
}

interface Recurring {
  interval: string;
  usage_type: string;
  interval_count: number;
  aggregate_usage: string;
  trial_period_days: null | number;
}

interface PlanItem {
  id: string;
  active: boolean;
  amount: number;
  object: string;
  created: number;
  product: string;
  currency: string;
  interval: string;
  livemode: boolean;
  metadata: Metadata;
  nickname: null | string;
  tiers_mode: null | string;
  usage_type: string;
  amount_decimal: string;
  billing_scheme: string;
  interval_count: number;
  aggregate_usage: string;
  transform_usage: TransformUsage;
  trial_period_days: null | number;
}

export interface SubscriptionPrice {
  id: string;
  type: string;
  active: boolean;
  object: string;
  created: number;
  product: string;
  currency: string;
  livemode: boolean;
  metadata: Metadata;
  nickname: null | string;
  recurring: Recurring;
  lookup_key: null | string;
  tiers_mode: null | string;
  unit_amount: number;
  tax_behavior: string;
  billing_scheme: string;
  custom_unit_amount: null; // ou spécifiez un type si cela peut avoir une valeur autre que null
  transform_quantity: TransformUsage;
  unit_amount_decimal: string;
}

export interface SubscriptionItem {
  id: string;
  // plan: Partial<PlanItem>;
  price: Partial<SubscriptionPrice>;
  // object: string;
  // created: number;
  // metadata: Metadata;
  // tax_rates: any[]; // Spécifiez un type plus précis si vous connaissez la structure des taux de taxe
  // subscription: string;
  // billing_thresholds: null; // ou spécifiez un type si cela peut avoir une valeur autre que null
}

export type SubscriptionItemsArray = SubscriptionItem[];
