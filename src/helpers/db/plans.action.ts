"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/db/iFeatures";
import { iPlan } from "@/src/types/db/iPlans";
import {
  createOrUpdatePlanStripeToBddSchema,
  createPlanSchema,
  updatePlanSchema,
} from "@/src/types/schemas/dbSchema";
import { SaasTypes } from "@prisma/client";
import { z } from "zod";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";
import { getFeatures } from "./features.action";

/**
 * Get all plans
 * @param secret - Internal secret for security, to prevent unauthorized access to the database from an external source
 * @throws {ActionError} - Unauthorized
 */
export const getPlans = action(
  z.object({
    secret: z.string(),
  }),
  async ({ secret }): Promise<HandleResponseProps<iPlan[]>> => {
    if (secret !== process.env.NEXTAUTH_SECRET)
      throw new ActionError("Unauthorized");
    try {
      const plans = await prisma.plan.findMany({
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include,
      });
      if (!plans) throw new Error("No plans found");
      return handleRes<iPlan[]>({
        success: plans,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iPlan[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Get once plan
 * @param id - Plan ID
 * @param secret - Internal secret for security, to prevent unauthorized access to the database from an external source
 * @throws {ActionError} - Unauthorized
 * - if stripeSignature is provided and is not valid
 * - if secret is provided and is not valid
 * - if stripeSignature and secret are not provided
 */
export const getPlan = action(
  z.object({
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
    id: z
      .string()
      .cuid()
      .or(z.string().regex(/^prod_/)),
  }),
  async ({
    id,
    secret,
    stripeSignature,
  }): Promise<HandleResponseProps<iPlan>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const plan = await prisma.plan.findFirst({
        where: {
          OR: [{ stripeId: id }, { id: id }],
        },
        include,
      });
      if (!plan) throw new Error("No plan found");
      return handleRes<iPlan>({
        success: plan as iPlan,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iPlan>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Create a plan
 * @param data - Plan data
 * @param stripeSignature - Stripe signature
 * @throws {ActionError} - Unauthorized
 * - if stripeSignature is provided and is not valid
 * - if user is not an admin/super_admin and stripeSignature is not provided
 * @returns {Promise<HandleResponseProps<iPlan>>} - Plan
 */
export const createPlan = action(
  createPlanSchema,
  async (
    { data, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<iPlan>> => {
    // 🔐 Security
    if (stripeSignature && !verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    if (!stripeSignature && userSession?.user?.role === "USER")
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const plan = await prisma.plan.create({
        data,
        include,
      });
      if (!plan)
        throw new ActionError("An error has occured while creating the plan");
      const linkFeatures = await getFeatures({
        secret: process.env.NEXTAUTH_SECRET ?? "",
      });
      if (linkFeatures.serverError) throw new Error(linkFeatures.serverError);
      const features = linkFeatures.data?.success as iFeature[];
      const newFeatures = await Promise.all(
        features.map((feature: iFeature) =>
          prisma.planToFeature.create({
            data: {
              planId: plan?.id,
              featureId: feature.id,
            },
          })
        )
      );
      if (!newFeatures)
        throw new ActionError(
          "An error has occured while linking features to the plan"
        );
      return handleRes<iPlan>({
        success: plan as iPlan,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iPlan>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Update a plan
 * @param data - Plan data
 * @param stripeSignature - Stripe signature
 * @throws {ActionError} - Unauthorized
 * - if stripeSignature is provided and is not valid
 * - if user is not an admin/super_admin and stripeSignature is not provided
 * @returns {Promise<HandleResponseProps<iPlan>>} - Plan
 * @throws {ActionError} - An unknown error occurred
 * - if an unknown error occurred
 */
export const updatePlan = action(
  updatePlanSchema,
  async (
    { data, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<iPlan>> => {
    // 🔐 Security
    if (stripeSignature && !verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    if (!stripeSignature && userSession?.user?.role === "USER")
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const existingPlan = await prisma.plan.findFirst({
        where: {
          // ℹ️ « Or », 'cause it depends if the update comes from createOrUpdatePlanStripeToBdd (need to find by stripeId), or from the client
          OR: [{ stripeId: data.id }, { id: data.id }],
        },
      });
      if (!existingPlan) throw new ActionError("Plan not found");

      const plan = await prisma.plan.update({
        where: { id: existingPlan.id },
        // ℹ️ 'Cause ID comes with "data" from Stripe, we remove it by destructuring
        data: { id: undefined, ...data },
        include,
      });
      return handleRes<iPlan>({
        success: plan,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iPlan>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
/**
 * Delete a plan
 * @param id - Plan ID / Stripe ID
 * @param secret - Internal secret for security, to prevent unauthorized access to the database from an external source
 * @param stripeSignature - Stripe signature
 * @throws {ActionError} - Unauthorized
 * - if stripeSignature is provided and is not valid
 * - if secret is provided and is not valid
 * - if stripeSignature and secret are not provided
 * - if user is not an admin/super_admin
 *
 */
export const deletePlan = action(
  z.object({
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
    id: z
      .string()
      .cuid()
      .or(z.string().regex(/^prod_/)),
  }),
  async (
    { id, secret, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<boolean>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (!stripeSignature && !secret) ||
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      if (!id) throw new Error("No plan id provided");
      const plan = await prisma.plan.deleteMany({
        where: {
          OR: [{ stripeId: id }, { id: id }],
        },
      });
      if (!plan)
        throw new Error("An error has occured while deleting the plan");
      return handleRes<boolean>({
        success: true,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<boolean>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Create or update a plan from stripe to the database
 * This allow a synchronization between stripe and the database. If you create a product (plan) in stripe, it will be created in the database. If you update a product (plan) in stripe, it will be updated in the database.
 * @param type - Type of action (create or update)
 * @param stripePlan - Stripe plan (event from Stripe)
 * @param stripeSignature - Stripe signature (for security)
 * @throws {ActionError} - An unknown error occurred
 */
export const createOrUpdatePlanStripeToBdd = action(
  createOrUpdatePlanStripeToBddSchema,
  async ({
    type,
    stripePlan,
    stripeSignature,
  }): Promise<HandleResponseProps<iPlan>> => {
    try {
      const planData = {
        active: stripePlan.active,
        stripeId: stripePlan.id,
        saasType: type === "create" ? ("CUSTOM" as SaasTypes) : undefined,
        name: stripePlan.name ?? "Plan name",
        description: stripePlan.description
          ? stripePlan.description
          : "New plan description",
      };
      // NOTE : Create
      if (type === "create") {
        const plan = await createPlan({
          data: planData,
          stripeSignature,
        });
        if (plan.serverError || plan.validationErrors)
          throw new ActionError(
            plan.serverError
              ? plan.serverError
              : plan.validationErrors?.data && plan.validationErrors?.data[0]
          );
        return handleRes<iPlan>({
          success: plan.data?.success,
          statusCode: 200,
        });
        // NOTE : Update
      } else if (type === "update") {
        const plan = await updatePlan({
          data: { ...planData, id: stripePlan.id },
          stripeSignature,
        });
        if (plan.serverError || plan.validationErrors)
          throw new ActionError(
            plan.serverError
              ? plan.serverError
              : plan.validationErrors?.data && plan.validationErrors?.data[0]
          );
        return handleRes<iPlan>({
          success: plan.data?.success,
          statusCode: 200,
        });
      } else {
        throw new ActionError("An unknown error occurred");
      }
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iPlan>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  Features: {
    include: {
      feature: true,
    },
  },
  StripeProduct: {
    include: {
      prices: true,
    },
  },
  coupons: {
    include: {
      coupon: true,
    },
  },
};
