"use server";
import { env } from "@/src/lib/zodEnv";
import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "");

export async function reportUsage(
  subscriptionItemId: string,
  quantity: number
) {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity: quantity,
        timestamp: Math.floor(Date.now() / 1000),
        action: "increment",
      }
    );
    console.log("Usage reported:", usageRecord);
    return usageRecord;
  } catch (error) {
    console.error("Error reporting usage:", error);
    throw error;
  }
}
