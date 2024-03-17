"use server";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { stripeProductSchema } from "@/src/types/schemas/dbSchema";
import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 * Get all stripe products
 * @param {string} secret - The secret (optional)
 * @returns {HandleResponseProps<iStripeProduct[]>} The response
 * @throws Will throw an error if the user secret is not authorized
 *
 */
export const getStripeProducts = action(
  z.object({ secret: z.string() }),
  async ({ secret }): Promise<HandleResponseProps<iStripeProduct[]>> => {
    // 🔐 Security
    if (secret && !verifySecretRequest(secret))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripeProducts = await prisma.stripeProduct.findMany({ include });
      if (!stripeProducts) throw new ActionError("No stripe product found");
      return handleRes<iStripeProduct[]>({
        success: stripeProducts,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Get a stripe product by id
 * @param {string} id - The id of the stripe product
 * @param {string} secret - The secret (optional)
 */
export const getStripeProduct = action(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
  }),
  async ({
    id,
    secret,
    stripeSignature,
  }): Promise<HandleResponseProps<iStripeProduct>> => {
    // 🔐 Security
    if (
      (secret && !verifySecretRequest(secret)) ||
      (!stripeSignature && !secret) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripeProduct = await prisma.stripeProduct.findUnique({
        where: { id: id },
        include: {
          prices: true,
        },
      });
      if (!stripeProduct) throw new Error("No Stripe Product found");
      return handleRes<iStripeProduct>({
        success: stripeProduct,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const createStripeProduct = action(
  stripeProductSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeProduct>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && !verifySecretRequest(secret))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripeProduct = await prisma.stripeProduct.create({
        data: {
          id: data.id ?? "",
          name: data.name ?? "",
          active: data.active ?? false,
          description: data.description,
          default_price: data.default_price,
          metadata: data.metadata ?? {},
          unit_label: data.unit_label ?? null,
          statement_descriptor: data.statement_descriptor ?? null,
          PlanId: data.PlanId,
        },
        include,
      });
      return handleRes<iStripeProduct>({
        success: stripeProduct,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateStripeProduct = action(
  stripeProductSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeProduct>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && !verifySecretRequest(secret))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const stripeProduct = await prisma.stripeProduct.update({
        where: { id: data.id },
        data: {
          name: data.name,
          active: data.active,
          description: data.description,
          default_price: data.default_price as string,
          metadata: data.metadata ?? {},
          unit_label: data.unit_label,
          statement_descriptor: data.statement_descriptor,
        },
        include,
      });
      return handleRes<iStripeProduct>({
        success: stripeProduct,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Delete a stripe product
 * @param {string} id - The id of the stripe product
 * @returns {HandleResponseProps<iStripeProduct>} The response
 * @throws Will throw an error if the user secret is not authorized
 */
export const deleteProduct = action(
  z.object({
    id: z.string(),
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
  }),
  async (
    { id, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeProduct>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const product = await prisma.stripeProduct.delete({
        where: { id: id },
        include,
      });
      if (!product) throw new Error("No Stripe Product found");
      return handleRes<iStripeProduct>({
        success: product,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const createOrUpdateProductStripeToBdd = action(
  stripeProductSchema,
  async (
    { type, planId, data, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeProduct>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const reformatData = {
        ...data,
        id: data.id,
        default_price: (data.default_price as string) ?? "",
        metadata: (data.metadata as JsonValue) ?? {},
        unit_label: data.unit_label ?? null,
        statement_descriptor: data.statement_descriptor ?? null,
        name: data.name,
        active: data.active,
        PlanId: planId,
        description: data.description,
      };
      // NOTE : Create
      let product;
      if (type === "create") {
        product = await createStripeProduct({
          data: reformatData,
          secret: process.env.NEXTAUTH_SECRET,
        });
      }
      // NOTE : Update
      else if (type === "update") {
        product = await updateStripeProduct({
          data: reformatData,
          secret: process.env.NEXTAUTH_SECRET,
        });
      } else {
        throw new ActionError("Invalid type");
      }
      if (handleError(product).error)
        throw new ActionError(handleError(product).message);
      return handleRes<iStripeProduct>({
        success: product.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeProduct>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  prices: true,
  PlanRelation: true,
};
