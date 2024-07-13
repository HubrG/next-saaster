import {
  MeteredBillingPeriod,
  MeteredMode,
  Plan,
  SaasTypes,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";
import { z } from "zod";

export const updateFeatureSchema = z.object({
  data: z.object({
    id: z.string().cuid(),
    position: z.number().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    alias: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    active: z.boolean().optional(),
    deleted: z.boolean().optional(),
    deletedAt: z.date().nullable().optional(),
    displayOnCard: z.boolean().optional(),
    onlyOnSelectedPlans: z.boolean().optional(),
  }),
});

export const updateFeaturesCategorySchema = z.object({
  data: z.object({
    id: z.string().cuid(),
    position: z.number().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    deleted: z.boolean().optional(),
    deletedAt: z.date().nullable().optional(),
  }),
});

export const createOneTimePaymentSchema = z.object({
  data: z.object({
    userId: z.string().cuid(),
    stripePaymentIntentId: z.string(),
    stripeCustomerId: z.string().optional(),
    amount: z.number(),
    currency: z.string(),
    metadata: z.any().nullable().optional(),
    priceId: z.string().nullable().optional(),
    status: z.string(),
  }),
  stripeSignature: z.string().optional(),
});

export const createPlanSchema = z.object({
  data: z.object({
    active: z.boolean().optional(),
    name: z.string(),
    description: z.string(),
    saasType: z.nativeEnum(SaasTypes).optional(),
    stripeId: z.string().nullable().optional(),
  }),
  stripeSignature: z.string().optional(),
});

export const updatePlanSchema = z.object({
  data: z
    .object({
      id: z.string(),
      active: z.boolean(),
      name: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      saasType: z.nativeEnum(SaasTypes).optional(),
      oncePrice: z.number().nonnegative().optional(),
      monthlyPrice: z.number().nonnegative().optional(),
      yearlyPrice: z.number().nonnegative().optional(),
      deleted: z.boolean().optional(),
      deletedAt: z.date().nullable().optional(),
      updatedAt: z.date().nullable().optional(),
      stripeYearlyPriceId: z.string().nullable().optional(),
      stripeMonthlyPriceId: z.string().nullable().optional(),
      creditAllouedByMonth: z.number().nonnegative().optional(),
      isCustom: z.boolean().optional(),
      isPopular: z.boolean().optional(),
      isRecommended: z.boolean().optional(),
      isTrial: z.boolean().optional(),
      isFree: z.boolean().optional(),
      trialDays: z.number().nonnegative().optional(),
      position: z.number().nonnegative().optional(),
      unitLabel: z.string().nullable().optional(),
      meteredUnit: z.number().optional(),
      meteredMode: z.nativeEnum(MeteredMode).optional(),
      meteredBillingPeriod: z.nativeEnum(MeteredBillingPeriod).optional(),
      stripeId: z
        .string()
        .regex(/^prod_/)
        .nullable()
        .optional(),
    })
    .partial() as z.ZodType<Partial<Plan>>,
  stripeSignature: z.string().optional(),
});
export const createFeaturesCategorySchema = z.object({
  data: z.object({
    name: z.string().nullable().optional(),
  }),
});

export const stripeCouponSchema = z.object({
  data: z.object({
    id: z.string(),
    amount_off: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    name: z.string(),
    metadata: z.record(z.string()).optional().default({}),
    duration: z.string().optional().default("once"),
    duration_in_months: z.number().nullable().optional(),
    max_redemptions: z.number().nullable().optional(),
    times_redeemed: z.number(),
    valid: z.boolean(),
    percent_off: z.number().nullable().optional(),
    redeem_by: z.number().nullable().optional(),
  }),
  secret: z.string().optional(),
  type: z.enum(["create", "update"]).optional(),
  stripeSignature: z.string().optional(),
});

export const stripePriceSchema = z.object({
  data: z.object({
    id: z.string(),
    active: z.boolean(),
    billing_scheme: z.string().optional(),
    currency: z.string(),
    nickname: z.string().nullable().optional(),
    product: z.string(),
    metadata: z.any().nullable().optional(),
    recurring: z.any().nullable().optional(),
    recurring_interval: z.string().nullable().optional(),
    recurring_interval_count: z.number().nullable().optional(),
    recurring_aggregate_usage: z.string().nullable().optional(),
    recurring_trial_period_days: z.number().nullable().optional(),
    recurring_usage_type: z.string().nullable().optional(),
    tiers_mode: z.string().nullable().optional(),
    type: z.string(),
    unit_amount: z.number().nullable().default(0),
    unit_amount_decimal: z.string().nullable().default("0"),
    transform_quantity: z.any().nullable().optional(),
    transform_quantity_divide_by: z.number().nullable().optional(),
    transform_quantity_round: z.string().nullable().optional(),
    custom_unit_amount: z.any().nullable().optional(),
    custom_unit_amount_maximum: z.number().nullable().optional(),
    custom_unit_amount_minimum: z.number().nullable().optional(),
    custom_unit_amount_preset: z.number().nullable().optional(),
  }),
  secret: z.string().optional(),
  type: z.enum(["create", "update"]).optional(),
  stripeSignature: z.string().optional(),
});

export const stripeProductSchema = z.object({
  data: z.object({
    id: z.string(),
    name: z.string(),
    active: z.boolean(),
    description: z.string().nullable(),
    default_price: z.string().nullable(),
    metadata: z.any().nullable().optional(),
    unit_label: z.string().nullable(),
    statement_descriptor: z.string().nullable(),
    PlanId: z.string().optional(),
  }),
  secret: z.string().optional(),
  type: z.enum(["create", "update"]).optional(),
  stripeSignature: z.string().optional(),
  planId: z.string().cuid().optional(),
});

export const createOrUpdatePlanStripeToBddSchema = z.object({
  type: z.enum(["create", "update"]),
  stripePlan: z
    .object({
      id: z.string(),
      active: z.boolean(),
      name: z.string(),
      description: z.string().nullable(),
    })
    .partial(),
  stripeSignature: z.string().optional(),
});

export const updatePlanInAdminSectionSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  saasType: z.nativeEnum(SaasTypes),
  oncePrice: z.number().nonnegative().optional(),
  monthlyPrice: z.number().nonnegative().optional(),
  yearlyPrice: z.number().nonnegative().optional(),
  deleted: z.boolean().nullable().optional(),
  active: z.boolean(),
  stripeId: z.string().nullable(),
  meteredUnit: z.number().nullable().optional(),
  meteredMode: z.nativeEnum(MeteredMode).nullable().optional(),
  meteredBillingPeriod: z
    .nativeEnum(MeteredBillingPeriod)
    .nullable()
    .optional(),
  stripeYearlyPriceId: z.string().nullable().optional(),
  stripeMonthlyPriceId: z.string().nullable().optional(),
  creditAllouedByMonth: z.number().nonnegative().optional(),
  isCustom: z.boolean(),
  isPopular: z.boolean(),
  isRecommended: z.boolean(),
  isTrial: z.boolean(),
  isFree: z.boolean(),
  trialDays: z.number().nonnegative().nullable().optional(),
  position: z.number().nonnegative().nullable().optional(),
  unitLabel: z.string().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
}) as z.ZodType<Partial<Plan>>;


export const createSubcriptionPaymentSchema = z.object({
  data: z.object({
    id: z.string(),
    subscriptionId: z.string(),
    stripePaymentIntentId: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.string(),
  }),
  stripeSignature: z.string().optional(),
  secret: z.string().optional(),
});

export const updateSubscriptionSchema = z.object({
  stripeSignature: z.string().optional(),
  secret: z.string().optional(),
  data: z.object({
    id: z.string(),
    priceId: z.string().optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    stripeCustomerId: z.string().optional(),
    allDatas: z.any().optional(),
    nextPaymentAttempt: z.number().optional(),
  }),
});

export const userSubscriptionSchema = z.object({
  data: z.object({
    userId: z.string(),
    creditRemaining: z.number().optional(),
    subscriptionId: z.string(),
    isActive: z.boolean().optional(),
  }),
  addCredit: z.boolean().optional(),
  stripeSignature: z.string().optional(),
  secret: z.string().optional(),
});

export const updateUserSchema = z.object({
  data: z.object({
    id: z.string().cuid().optional(),
    name: z.string().nullable().optional(),
    isNewsletterSub: z.boolean().optional(),
    email: z.string().email(),
    emailVerified: z.date().nullable().optional(),
    image: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    date: z.date().nullable().optional(),
    customerId: z.string().nullable().optional(),
    planId: z.string().nullable().optional(),
    organizationId: z.string().nullable().optional(),
    creditRemaining: z.number().nullable().optional(),
    role: z.nativeEnum(UserRole).optional(),
  }),
  stripeSignature: z.string().optional(),
  secret: z.string().optional(),
});