import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iSubscriptionPayment } from "@/src/types/db/iSubscriptionPayments";
import { createSubcriptionPaymentSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 * Get a subscription payment
 * @param secret - internal secret key
 * @param id - subscription payment id
 * @returns
 */
export const getSubscriptionPayment = action(
  z.object({ secret: z.string(), id: z.string() }),
  async ({
    secret,
    id,
  }): Promise<HandleResponseProps<iSubscriptionPayment>> => {
    // 🔐 Security
    if (secret && !verifySecretRequest(secret))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
        where: { id },
        include,
      });
      if (!subscriptionPayment) throw new ActionError("No user found");
      return handleRes<iSubscriptionPayment>({
        success: subscriptionPayment,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscriptionPayment>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Create a subscription payment
 * @param stripeSignature - stripe signature
 * @param data - subscription payment data
 * @param secret - internal secret key
 * @returns subscription payment
 * @throws ActionError
 * - Unauthorized - if user is not authorized / not an admin / not a stripe request / secret is wrong / signature is wrong
 * - Problem creating payment
 */
export const createSubcriptionPayment = action(
  createSubcriptionPaymentSchema,
  async (
    { stripeSignature, data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iSubscriptionPayment>> => {
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
      const subscriptionPayment = await prisma.subscriptionPayment.create({
        data: data,
        include,
      });
      if (!subscriptionPayment)
        throw new ActionError("Problem creating payment");
      return handleRes<iSubscriptionPayment>({
        success: subscriptionPayment,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscriptionPayment>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * Update a subscription payment
 * @param stripeSignature - stripe signature
 * @param data - subscription payment data
 * @param secret - internal secret key
 * @returns subscription payment
 * @throws ActionError
 * - Unauthorized - if user is not authorized / not an admin / not a stripe request / secret is wrong / signature is wrong
 * - Problem updating payment
 */
export const updateSubscriptionPayment = action(
  createSubcriptionPaymentSchema,
  async (
    { stripeSignature, data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iSubscriptionPayment>> => {
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
      const subscriptionPayment = await prisma.subscriptionPayment.update({
        where: { id: data.subscriptionId },
        data: { ...data, updatedAt: new Date() },
        include,
      });
      if (!subscriptionPayment)
        throw new ActionError("Problem creating payment");
      return handleRes<iSubscriptionPayment>({
        success: subscriptionPayment,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscriptionPayment>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

//
const include = {
  subscription: true,
};
