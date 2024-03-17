"use server";
import {
  HandleResponseProps,
  handleRes
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iUsers } from "@/src/types/db/iUsers";
import { updateUserSchema } from "@/src/types/schemas/dbSchema";
import { User } from "@prisma/client";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 *  Get user by email
 *
 * @remarks
 * This method is part of the {@link utils/users | users utilities}.
 *
 * @param email - The email of the user
 * @returns The user object
 */
export const getUser = action(
  z.object({
    email: z.string(),
    stripeSignature: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({
    email,
    stripeSignature,
    secret,
  }): Promise<HandleResponseProps<iUsers>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
        include,
      });
      if (!user) throw new ActionError("No user found");
      return handleRes<iUsers>({
        success: user,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUsers>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getUserByCustomerId = action(
  z.object({
    customerId: z.string(),
    stripeSignature: z.string().optional(),
    secret: z.string().optional(),
  }),
  async ({
    customerId,
    stripeSignature,
    secret,
  }): Promise<HandleResponseProps<Partial<User>>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const user = await prisma.user.findFirst({
        where: { customerId: customerId },
        select: {
          id: true,
          email: true,
        },
      });
      if (!user) throw new ActionError("No user found");
      return handleRes<Partial<User>>({
        success: user,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<Partial<User>>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateUser = action(
  updateUserSchema,
  async ({
    data,
    stripeSignature,
    secret,
  }): Promise<HandleResponseProps<iUsers>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (secret && !verifySecretRequest(secret)) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const user = await prisma.user.update({
        where: { email: data.email },
        data,
        include,
      });
      if (!user) throw new ActionError("Problem while updating user");
      return handleRes<iUsers>({
        success: user,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUsers>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  organization: {
    include: {
      owner: true,
      members: true,
    },
  },
  subscriptions: {
    where: { isActive: true },
    include: {
      subscription: {
        include: {
          SubscriptionPayments: true,
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
        },
      },
    },
  },
  contacts: true,
  oneTimePayments: {
    include: {
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
    },
  },
};
