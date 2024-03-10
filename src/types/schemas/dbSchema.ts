import { MeteredBillingPeriod, MeteredMode, Plan, SaasTypes } from "@prisma/client";
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
    priceId: z.string(),
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
      isRecommanded: z.boolean().optional(),
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
