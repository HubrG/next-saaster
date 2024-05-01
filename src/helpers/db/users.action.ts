"use server";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, authAction } from "@/src/lib/safe-actions";
import { iUsers } from "@/src/types/db/iUsers";
import { updateUserSchema } from "@/src/types/schemas/dbSchema";
import { User } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import Stripe from "stripe";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";
import { removeUserFromOrganization } from "./organization.action";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

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

export const getUsers = action(
  z.object({
    secret: z.string().optional(),
  }),
  async ({ secret }): Promise<HandleResponseProps<iUsers[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const users = await prisma.user.findMany({
        include,
      });
      if (!users) throw new ActionError("No users found");
      return handleRes<iUsers[]>({
        success: users,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUsers[]>({
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
        where: { customerId },
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
  async (
    { data, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iUsers>> => {
    // 🔐 Security
    if (
      (!stripeSignature && !secret) ||
      (userSession &&
        userSession?.user.email !== data.email &&
        userSession?.user.role === "USER") ||
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

export const deleteUser = authAction(
  z.object({
    email: z.string().email(),
  }),
  async ({ email }, { userSession }): Promise<HandleResponseProps<User>> => {
    // 🔐 Security
    if (userSession.user.email !== email && userSession.user.role === "USER") {
      throw new ActionError("Unauthorized");
    }
    // 🔓 Unlocked
    const t = await getTranslations();
    try {
      // We get user
      const user = await getUser({
        email,
        secret: chosenSecret(),
      });
      if (user.serverError) throw new ActionError("User not found");
      // We get organization if user is owner, we throw error (forbidden)
      if (
        user.data?.success?.organizationId &&
        user.data?.success?.organization?.ownerId === user.data?.success?.id
      ) {
        throw new ActionError(
          t(
            "Components.Helpers.DB.Users.deleteUser.throws.delete"
          )
        );
      }
      // If  user has an active aubscription and is not member of an organization, we cancel the subscription
      const subscription = user.data?.success?.subscriptions?.find(
        (sub) => sub.isActive
      );
      if (subscription && !user.data?.success?.organizationId) {
        const cancelSubscriptions = await stripe.subscriptions.cancel(
          subscription.subscriptionId,
          {
            cancellation_details: {
              comment: "User deleted account",
            },
          }
        );
        if (!cancelSubscriptions)
          throw new ActionError(
            t("Components.Helpers.DB.Users.deleteUser.throws.cancel-subscription")
          );
      }
      // We get organization if user is member, we remove user from organization
      if (
        user.data?.success?.organizationId &&
        user.data?.success?.organization?.ownerId !== user.data?.success?.id
      ) {
        const deleteUserFromOrganization = await removeUserFromOrganization({
          email,
          organizationId: user.data?.success?.organizationId,
        });
        if (deleteUserFromOrganization.serverError)
          throw new ActionError(deleteUserFromOrganization.serverError);
      }
      // We delete the user, definitely
      const deleteDefinitely = await prisma.user.delete({
        where: { email },
      });
      if (!deleteDefinitely)
        throw new ActionError(t("Components.Helpers.DB.Users.deleteUser.throws.cancel"));
      return handleRes<User>({
        success: deleteDefinitely,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<User>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  accounts: true,
  organization: {
    include: {
      owner: true,
      members: true,
    },
  },
  subscriptions: {
    // where: { isActive: true },
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
  usage: {
    include: {
      feature: true,
    },
  },
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
