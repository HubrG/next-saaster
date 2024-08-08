import { prisma } from "@/src/lib/prisma";
import { iUsers } from "@/src/types/db/iUsers";
import Stripe from "stripe";
import { getUser, getUserByCustomerId } from "../db/users.action";
import { getUserInfos } from "../dependencies/user-info";
import { chosenSecret } from "./verifySecretRequest";

export async function todoWhenPaymentSuceeded(event: Stripe.Checkout.Session) {
  // We wait 5sc before executing the function to make sure the payment is completed
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Payment suceeded", event);
  try {
    const userId = await getUserByCustomerId({
      customerId: event.customer as string,
      secret: chosenSecret(),
    });
    if (!userId.data?.success?.email) {
      throw new Error("User not found");
    }
    const user = await getUser({
      email: userId.data.success.email,
      secret: chosenSecret(),
    });

    const getOnTimePayment = await prisma.oneTimePayment.findMany({
      where: {
        userId: user.data?.success?.id,
        stripePaymentIntentId: event.payment_intent as string,
      },
    });

    if (!getOnTimePayment.length) {
      throw new Error("No one time payment found");
    }

    const updateOnTimePayment = await prisma.oneTimePayment.update({
      where: {
        id: getOnTimePayment[0].id,
      },
      data: {
        metadata: event.metadata ?? {
          name: "Refill",
          refill: 0,
        },
      },
    });

    if (!updateOnTimePayment) {
      throw new Error("Failed to update one time payment");
    }

    const userInfo = getUserInfos({ user: user.data?.success as iUsers });

    if (!userInfo) {
      throw new Error("User not found");
    }
    if (userInfo.activeSubscription) {
      const creditRemaining = (userInfo.activeSubscription.creditRemaining +=
        parseInt(event.metadata?.refill ?? "0"));

      const updateCreditRemaining = await prisma.userSubscription.updateMany({
        where: {
          subscriptionId: userInfo.activeSubscription.subscription?.id,
          userId: userInfo.info.id,
        },
        data: {
          creditRemaining,
        },
      });
      if (!updateCreditRemaining) {
        throw new Error("Failed to update user remaining credit");
      }
    } else {
      const creditRemaining = ((user.data?.success?.creditRemaining ?? 0) +
        parseInt(event.metadata?.refill ?? "0")) as number;

      if (creditRemaining < 0) {
        throw new Error("Not enough credit");
      }

      const updateCreditRemaining = await prisma.user.update({
        where: {
          id: user.data?.success?.id,
        },
        data: {
          creditRemaining,
        },
      });

      if (!updateCreditRemaining) {
        throw new Error("Failed to update user remaining credit");
      }
    }
  } catch (error) {
    console.error(error);
  }
}
