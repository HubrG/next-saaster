import {
  Account,
  Feature,
  OneTimePayment,
  Organization,
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
  UserSubscription,
  UserUsage
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

interface UserSubscriptionDetail extends Subscription {
  price: UserSubscriptionPrice | null;
  SubscriptionPayments: SubscriptionPayment[];
}

interface UserOneTimePayment extends OneTimePayment {
  price: UserSubscriptionPrice | null;
  metadata: {
    name?: string;
    refill?: number;
  }; 
}
interface UserSubscriptionClassic extends UserSubscription {
  subscription: UserSubscriptionDetail | null;
}
interface UserOrganization extends Organization {
  members?: User[] | null;
  owner?: User | null;
}
interface UserUserUsage extends UserUsage {
  feature?: Feature | null;
}
export interface iUsers extends User {
  subscriptions?: UserSubscriptionClassic[] | null;
  oneTimePayments?: UserOneTimePayment[] | null;
  contacts?: ResendContact[];
  stripePrice?: UserStripePrice | null;
  organization?: UserOrganization | null;
  accounts?: Account[] | null;
  usage?: UserUserUsage[] | null;
}


// SECTION METADATAS OF SUBSCRIPTION
interface Metadata {
  [key: string]: any;
}
interface MetadataUser {
  [key: string]: any;
}
export interface Coupon {
  id: string;
  name: string;
  valid: boolean;
  object: string;
  created: number;
  currency: null | string; // Utilisez 'string' si la devise peut avoir une valeur, 'null' si non applicable
  duration: string;
  livemode: boolean;
  metadata: Metadata;
  redeem_by: null | number; // Utilisez 'number' pour un timestamp UNIX, 'null' si non applicable
  amount_off: null | number;
  percent_off: number;
  times_redeemed: number;
  max_redemptions: number;
  duration_in_months: null | number;
}
export interface SubscriptionDiscount  {
  id: string;
  end: null | number; // Utilisez 'number' pour un timestamp UNIX, 'null' si non applicable
  start: number;
  coupon: Coupon;
  object: string;
  invoice: null | string; // Utilisez 'string' pour l'ID de facture, 'null' si non applicable
  customer: string;
  invoice_item: null | string; // Utilisez 'string' pour l'ID de l'article de facture, 'null' si non applicable
  subscription: string;
  promotion_code: null | string; // Utilisez 'string' pour l'ID du code promotionnel, 'null' si non applicable
  checkout_session: null | string; // Utilisez 'string' pour l'ID de la session de paiement, 'null' si non applicable
}

// Plan

export interface SubItemsPlan {
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
  aggregate_usage: null | string;
  transform_usage: null | string; 
  trial_period_days: null | number;
}
export interface SubItemsRecurring {
  interval: string;
  usage_type: string;
  interval_count: number;
  aggregate_usage: null | string;
  trial_period_days: null | number;
}

export interface SubItemsPrice {
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
  recurring: SubItemsRecurring;
  lookup_key: null | string;
  tiers_mode: null | string;
  unit_amount: number;
  tax_behavior: string;
  billing_scheme: string;
  custom_unit_amount: null | number;
  transform_quantity: null | string;
  unit_amount_decimal: string;
}

export interface Item {
  id: string;
  plan: SubItemsPlan;
  price: SubItemsPrice;
  object: string;
  created: number;
  metadata: Metadata;
  quantity: number;
  tax_rates: any[];
  subscription: string;
  billing_thresholds: null | string;
}


export type SubscriptionItem = Item[];


