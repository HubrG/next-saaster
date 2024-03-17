import {
  HandleResponseProps,
  handleRes
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
    stripeSignature,
    data,
  }): Promise<HandleResponseProps<iUserSubscription[]>> => {
    // 🔐 Security
    if (!verifyStripeRequest(stripeSignature))
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
  }): Promise<HandleResponseProps<iUserSubscription>> => {
    // 🔐 Security
    if (!verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      // Ensure that the items property is of the correct type

      const subscription = await prisma.userSubscription.create({
        data: data,
        include,
      });
      if (!subscription)
        throw new ActionError("Problem while updating users subscription");
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

const include = {
  user: true,
  subscription: true,
};

