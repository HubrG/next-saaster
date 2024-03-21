"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, authAction } from "@/src/lib/safe-actions";
import { iUsers } from "@/src/types/db/iUsers";
import { updateUserSchema } from "@/src/types/schemas/dbSchema";
import { User } from "@prisma/client";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";
import { iOrganization } from "@/src/types/db/iOrganization";
import { removeUserFromOrganization } from "./organization.action";

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
    try {
      // We get user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          organization: true,
        },
      });
      if (!user) throw new ActionError("User not found");
      // We get organization if user is owner, we throw error (forbidden)
      if (user.organizationId && user.organization?.ownerId === user.id) {
        throw new ActionError(
          "You cannot delete your account because you are the owner of an organization. Please transfer ownership to another user or delete the organization."
        );
      }
      // We get organization if user is member, we remove user from organization
      if (user.organizationId && user.organization?.ownerId !== user.id) {
        const deleteUserFromOrganization = await removeUserFromOrganization({
          email,
          organizationId: user.organizationId,
        });
        if (deleteUserFromOrganization.serverError)
          throw new ActionError(deleteUserFromOrganization.serverError);
      }
      // We delete the user, definitely
      const deleteDefinitely = await prisma.user.delete({
        where: { email },
      });
      if (!deleteDefinitely)
        throw new ActionError("Problem while deleting user");
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
