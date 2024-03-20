"use server"

import { isMe } from "@/src/helpers/functions/isUserRole";
import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const billingPortail = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: "https://votreSiteWeb.com/profile", // URL où les clients seront redirigés après avoir quitté le portail client
  });
  return session;
};


export const cancelSubscription = async (
  subscriptionId: string,
  email: string,
  action: "cancel" | "restart"
): Promise<{
  success?: boolean;
  error?: string;
}> => {
  if (!isMe(email)) {
    return handleResponse<undefined>(
      undefined,
      "You are not authorized to perform this action"
    );
  }
  try {
    const deletedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: action === "cancel" ? true : false,
      }
    );
    if (deletedSubscription) {
      revalidatePath("/dashboard");
      return { success: true };
    } else {
      throw new Error("An error occurred while canceling the subscription");
    }
  } catch (error) {
    return handleResponse<undefined>(undefined, error);
  }
};


export async function reportUsage(subscriptionItemId:string, quantity:number) {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity: quantity,
        timestamp: Math.floor(Date.now() / 1000), // Timestamp actuel en secondes
        action: 'increment', // 'increment' pour ajouter à l'utilisation actuelle, 'set' pour définir une valeur spécifique
      }
    );
    console.log('Usage reported:', usageRecord);
    return usageRecord;
  } catch (error) {
    console.error('Error reporting usage:', error);
    throw error;
  }
}


export async function changePaymentMethod(
  customerId: string,
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card", "link", "paypal"],
      success_url: `${process.env.NEXT_URI}/dashboard`,
      cancel_url: `${process.env.NEXT_URI}/dashboard`,
    });
  return session.url;
  } catch (error) {
    console.error('Error changing payment method:', error);
    throw error;
  }
}