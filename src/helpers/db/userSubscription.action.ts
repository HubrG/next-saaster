"use server"
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iUserSubscription } from "@/src/types/db/iUserSubscription";
import { userSubscriptionSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

export const getUserSubscription = action(
  z.object({
    data: z.object({
      userId: z.string(),
      subscriptionId: z.string(),
    }),
    secret: z.string(),
  }),
  async ({ data, secret }): Promise<HandleResponseProps<iUserSubscription>> => {
    // 🔐 Security
    if (!verifyStripeRequest(secret)) throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const subscription = await prisma.userSubscription.findUnique({
        where: {
          userId_subscriptionId: {
            userId: data.userId,
            subscriptionId: data.subscriptionId,
          },
        },
        include,
      });
      if (!subscription)
        throw new ActionError("Problem while creating subscription");
      return handleRes<iUserSubscription>({
        success: subscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUserSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateUserSubscription = action(
  userSubscriptionSchema,
  async ({
    addCredit,
    stripeSignature,
    data,
  }): Promise<HandleResponseProps<iUserSubscription[]>> => {
    // 🔐 Security
    if (stripeSignature && !verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const userSubscriptions = await prisma.userSubscription.findMany({
        where: {
          OR: [
            { subscriptionId: data.subscriptionId },
            { userId: data.userId },
          ],
        },
      });

      const updatePromises = userSubscriptions.map((userSub) => {
        return prisma.userSubscription.update({
          where: {
            userId_subscriptionId: {
              userId: userSub.userId,
              subscriptionId: userSub.subscriptionId,
            },
          },
          data: {
            creditRemaining:
              addCredit ? (data.creditRemaining ?? 0) +
              (userSub.creditRemaining ?? 0) : data.creditRemaining,
            isActive: data.isActive,
          },
          include,
        });
      });

      const updatedSubscriptions = await Promise.all(updatePromises);
      if (!updatedSubscriptions)
        throw new ActionError("Problem while updating users subscription");
      return handleRes<iUserSubscription[]>({
        success: updatedSubscriptions,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUserSubscription[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const createUserSubscription = action(
  userSubscriptionSchema,
  async ({
    stripeSignature,
    data,
  }): Promise<HandleResponseProps<iUserSubscription[] | iUserSubscription>> => {
    // 🔐 Security
    if (!verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      // Get the user
      const user = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });
      // We check if he has an organization. If yes, we add the subscription to all user of the organization
      if (user?.organizationId) {
        const users = await prisma.user.findMany({
          where: {
            organizationId: user.organizationId,
          },
        });
        const userSubscriptions = users.map((user) => {
          return prisma.userSubscription.create({
            data: {
              userId: user.id,
              subscriptionId: data.subscriptionId,
              isActive: data.isActive,
              creditRemaining: data.creditRemaining,
            },
            include,
          });
        });
        const subscriptions = await Promise.all(userSubscriptions);
        if (!subscriptions)
          throw new ActionError("Problem while updating users subscription");
        return handleRes<iUserSubscription[]>({
          success: subscriptions,
          statusCode: 200,
        });
      } else {
        // If the user is not part of an organization, we just create the subscription for him
        const subscription = await prisma.userSubscription.create({
          data: {
            userId: data.userId,
            subscriptionId: data.subscriptionId,
            isActive: data.isActive,
            creditRemaining: data.creditRemaining,
          },
          include,
        });
        if (!subscription)
          throw new ActionError("Problem while creating subscription");
        return handleRes<iUserSubscription>({
          success: subscription,
          statusCode: 200,
        });
      }
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUserSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateActiveSubscriptionCreditRemaining = action(
  z.object({
    data: z.object({
      subscriptionId: z.string(),
      userId: z.string(),
      creditRemaining: z.number(),
    }),
    secret: z.string(),
  }),
  async ({ data, secret }): Promise<HandleResponseProps<iUserSubscription>> => {
    // 🔐 Security
    if (!verifyStripeRequest(secret)) throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const userSubscription = await prisma.userSubscription.findFirst({
        where: {
          subscriptionId: data.subscriptionId,
          userId: data.userId,
          isActive: true,
        },
      });
      if (!userSubscription)
        throw new ActionError("Problem while updating subscription");
      const updatedSubscription = await prisma.userSubscription.update({
        where: {
          userId_subscriptionId: {
            userId: userSubscription.userId,
            subscriptionId: userSubscription.subscriptionId,
          },
        },
        data: {
          creditRemaining: data.creditRemaining,
        },
        include,
      });
      if (!updatedSubscription)
        throw new ActionError("Problem while updating subscription");
      return handleRes<iUserSubscription>({
        success: updatedSubscription,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUserSubscription>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);


const include = {
  user: true,
  subscription: true,
};
