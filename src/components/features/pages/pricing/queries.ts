"use server";

import { prisma } from "@/src/lib/prisma";
import { MRRSPlanStore } from "@/src/stores/admin/saasMRRSPlansStore";
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
};
export const getCoupon = async (couponId: string) => {
  return await prisma.stripeCoupon.findUnique({
    where: { id: couponId },
  });
}
export const createCheckoutSession = async (
  planPrice: string,
  plan: MRRSPlanStore,
  recurrence: string
) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }

  const subscription_data = plan.trialDays
    ? plan.trialDays > 0
      ? { trial_period_days: plan.trialDays }
      : {}
    : {};

  const linkedCoupon = plan.coupons?.find((c) => c.MRRSPlanId === plan.id && c.recurrence === recurrence);
  const coupon = linkedCoupon
    ? { coupon: linkedCoupon.couponId }
    : {};
  console.log(coupon);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: planPrice,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: subscription_data,
    discounts: [coupon],
    success_url:
      "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://yourdomain.com/cancel",
  });

  return session.url;
};
