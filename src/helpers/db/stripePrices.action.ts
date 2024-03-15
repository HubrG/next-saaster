"use server";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, adminAction } from "@/src/lib/safe-actions";
import { iSearchPrices, iStripePrice } from "@/src/types/db/iStripePrices";
import { stripePriceSchema } from "@/src/types/schemas/dbSchema";
import { StripePrice } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 * Get all stripe prices
 * @param {string} secret - The secret (optional)
 * @returns {HandleResponseProps<iStripePrice[]>} The response
 * @throws Will throw an error if the user secret is not authorized
 *
 */
export const getStripePrices = action(
  z.object({ secret: z.string() }),
  async ({ secret }): Promise<HandleResponseProps<iStripePrice[]>> => {
    // 🔐 Security
    if (secret && secret !== process.env.NEXTAUTH_SECRET)
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripePrices = await prisma.stripePrice.findMany({
        include,
      });
      if (!stripePrices) throw new Error("No stripe prices found");
      return handleRes<iStripePrice[]>({
        success: stripePrices,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Get a stripe price
 * @param {string} id - The stripe price id
 * @param {string} stripeSignature - The stripe signature (optional)
 * @param {string} secret - The secret (optional)
 * @returns {HandleResponseProps<iStripePrice>} The response
 *
 */
export const getStripePrice = action(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
  }),
  async ({
    id,
    secret,
    stripeSignature,
  }): Promise<HandleResponseProps<iStripePrice>> => {
    // 🔐 Security
    if (
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (!stripeSignature && !secret) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripePrice = await prisma.stripePrice.findFirst({
        where: { id },
        include,
      });
      if (!stripePrice) throw new Error("No stripe price found");
      return handleRes<iStripePrice>({
        success: stripePrice,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Create a stripe price
 * @param {iStripePrice} data - The stripe price data
 * @param {string} secret - The secret (optional)
 *
 */
export const createStripePrice = action(
  stripePriceSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripePrice>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && secret !== process.env.NEXTAUTH_SECRET)
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripePrice = await prisma.stripePrice.create({
        data: {
          ...data,
          metadata: { ...data.metadata },
        },
        include,
      });
      return handleRes<iStripePrice>({
        success: stripePrice,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Update a stripe price
 * @param {iStripePrice} data - The stripe price data
 * @param {string} secret - The secret (optional)
 */
export const updateStripePrice = action(
  stripePriceSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripePrice>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && secret !== process.env.NEXTAUTH_SECRET)
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripePrice = await prisma.stripePrice.update({
        where: { id: data.id },
        data,
        include,
      });
      return handleRes<iStripePrice>({
        success: stripePrice,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Delete a stripe price
 * @param {string} id - The stripe price id
 * @param {string} stripeSignature - The stripe signature (optional)
 * @param {string} secret - The secret (optional)
 * @returns {HandleResponseProps<iStripePrice>} The response
 * @throws Will throw an error if the user is not authorized
 * @throws Will throw an error if the stripe signature is not valid
 * @throws Will throw an error if the secret is not valid
 * @throws Will throw an error if the stripe price is not found
 */
export const deleteStripePrice = action(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
  }),
  async (
    { id, secret, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<iStripePrice>> => {
    if (
      (userSession && userSession?.user.role === "USER") ||
      (!stripeSignature && !secret) ||
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const price = await prisma.stripePrice.delete({
        where: { id },
        include,
      });
      if (!price) throw new Error("Stripe price not found");
      return handleRes<iStripePrice>({
        success: price,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Search for stripe prices (for deactivation)
 * Need to be an admin
 * @param {iSearchPrices} query - The search query
 * @returns {HandleResponseProps<any>} The response
 */
export const searchPricesRaw = adminAction(
  z.object({
    product: z.string(),
    active: z.boolean(),
    type: z.string(),
    recurringInterval: z.string(),
    oldPrice: z.number(),
    defaultPrice: z.string(),
    newPriceId: z.string(),
  }),
  async (query): Promise<HandleResponseProps<StripePrice[]>> => {
    try {
      const prices = await prisma.$queryRaw`SELECT * FROM "StripePrice" 
      WHERE "product" = ${query.product}
      AND "active" = ${query.active}
      AND "recurring_interval" = ${query.recurringInterval}
      AND "id" != ${query.defaultPrice}
      AND "id" != ${query.newPriceId}
      `;
      return handleRes<StripePrice[]>({
        success: prices as StripePrice[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<StripePrice[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Create or update a stripe price
 * @param {iStripePrice} data - The stripe price data
 * @param {string} stripeSignature - The stripe signature
 * @param {string} secret - The secret
 * @returns {HandleResponseProps<iStripePrice>} The response
 */
export const createOrUpdatePriceStripeToBdd = action(
  stripePriceSchema,
  async (
    { type, data, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripePrice>> => {
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
      let price;
      const reformatData = {
        ...data,
        transform_quantity_round: data.transform_quantity?.round ?? undefined,
        metadata: (data.metadata as JsonValue) ?? {},
        transform_quantity: (data.transform_quantity as JsonValue) ?? undefined,
        custom_unit_amount: (data.custom_unit_amount as JsonValue) ?? undefined,
        transform_quantity_divide_by:
          data.transform_quantity?.divide_by ?? undefined,
        recurring: (data.recurring as JsonValue) ?? undefined,
        recurring_interval: data.recurring?.interval ?? undefined,
        recurring_interval_count: data.recurring?.interval_count ?? undefined,
        recurring_aggregate_usage: data.recurring?.aggregate_usage ?? undefined,
        recurring_trial_period_days:
          data.recurring?.trial_period_days ?? undefined,
        recurring_usage_type: data.recurring?.usage_type ?? undefined,
      };

      if (type === "create") {
        price = await createStripePrice({
          data: reformatData,
          secret: process.env.NEXTAUTH_SECRET ?? "",
        });
      } else if (type === "update") {
        price = await updateStripePrice({
          data: reformatData,
          secret: process.env.NEXTAUTH_SECRET ?? "",
        });
      } else {
        throw new ActionError("Invalid type");
      }
      if (handleError(price).error)
        throw new ActionError(handleError(price).message);
      return handleRes<iStripePrice>({
        success: price.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripePrice>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  productRelation: true,
};
