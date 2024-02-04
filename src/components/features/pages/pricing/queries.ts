"use server";

import { prisma } from "@/src/lib/prisma";
import { MRRSPlan } from "@prisma/client";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");


export const changeCssTheme = async (theme: string) => {
    // On recherche l'ID de l'application
    const appSettings = await prisma.appSettings.findFirst();
    if (!appSettings) {
        throw new Error("App settings not found");
    }
    return prisma.appSettings.update({
        where: { id: appSettings.id },
        data: { theme: theme },
    });

}


export const createCheckoutSession = async (planPrice: string, plan: MRRSPlan) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: planPrice,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: {
      trial_period_days: plan.trialDays?? 0,
    },
    success_url:
      "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://yourdomain.com/cancel",
  });

  return session.url;
}