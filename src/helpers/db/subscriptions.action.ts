import {
  HandleResponseProps,
  handleRes
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iSubscription } from "@/src/types/db/iSubscription";
import { updateSubscriptionSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

export const getSubscription = action(
  z.object({
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
    id: z.string(),
  }),
  async ({
    stripeSignature,
    secret,
    id,
  }): Promise<HandleResponseProps<iSubscription>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include,
      });
      if (!subscription) throw new Error("No subscription found");
      return handleRes<iSubscription>({
        success: subscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const createSubscription = action(
  updateSubscriptionSchema,
  async ({
    stripeSignature,
    secret,
    data,
  }): Promise<HandleResponseProps<iSubscription>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const dataWithCorrectItemsType = {
        ...data,
        allDatas: data.allDatas ? JSON.parse(data.allDatas as string) : {},
      };
      const subscription = await prisma.subscription.create({
        data: dataWithCorrectItemsType,
        include: include,
      });
      if (!subscription)
        throw new ActionError("Problem while creating subscription");
      return handleRes<iSubscription>({
        success: subscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateSubscription = action(
  updateSubscriptionSchema,
  async ({
    stripeSignature,
    secret,
    data,
  }): Promise<HandleResponseProps<iSubscription>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const dataWithCorrectItemsType = {
        ...data,
        allDatas: data.allDatas ? JSON.parse(data.allDatas as string) : {},
        updatedAt: new Date(),
      };
      const subscription = await prisma.subscription.update({
        where: { id: data.id },
        data: dataWithCorrectItemsType,
        include,
      });
      if (!subscription)
        throw new ActionError("Problem while updating subscription");
      return handleRes<iSubscription>({
        success: subscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const deleteSubscription = action(
  z.object({
    secret: z.string().optional(),
    stripeSignature: z.string().optional(),
    id: z.string(),
  }),
  async ({
    stripeSignature,
    secret,
    id,
  }): Promise<HandleResponseProps<iSubscription>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const subscription = await prisma.subscription.delete({
        where: { id },
        include,
      });
      if (!subscription)
        throw new ActionError("Problem while deleting subscription");
      return handleRes<iSubscription>({
        success: subscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  users: {
    include: {
      user: true,
    },
  },
  price: {
    include: {
      productRelation: {
        include: {
          PlanRelation: {
            include: {
              Features: {
                include: { feature: true },
              },
              coupons: {
                include: {
                  coupon: true,
                },
              },
            },
          },
        },
      },
    },
  },
  SubscriptionPayments: true,
};
