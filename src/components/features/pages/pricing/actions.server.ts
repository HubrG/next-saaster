"use server";

import { prisma } from "@/src/lib/prisma";
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


export const createCheckoutSession = async (planId: string) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: planId, 
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url:
      "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://yourdomain.com/cancel",
  });

  return session.url;
}