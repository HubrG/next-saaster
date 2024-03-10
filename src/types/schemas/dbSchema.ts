import { Plan, SaasTypes } from "@prisma/client";
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
      stripeId: z.string().regex(/^prod_/).nullable().optional(),
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
