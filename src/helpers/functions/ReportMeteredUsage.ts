"use server";
import { authAction } from "@/src/lib/safe-actions";
import { env } from "@/src/lib/zodEnv";
import Stripe from "stripe";
import { z } from "zod";
const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "");

export const reportUsage = authAction(
  z.object({
    subscriptionItemId: z.string(),
    quantity: z.number(),
  }),
  async (
    { subscriptionItemId, quantity },
    { userSession }
  ): Promise<Stripe.UsageRecord | {
    error: any;
    success: boolean;
  }> => {
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
      return { error, success: false };
    }
  }
);
