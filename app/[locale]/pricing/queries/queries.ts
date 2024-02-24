"use server";

import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import { prisma } from "@/src/lib/prisma";
import { iPlan } from "@/src/types/iPlans";
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
};
export const createCheckoutSession = async (
  planPrice: string,
  plan: iPlan,
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
  const linkedCoupon = plan.coupons?.find(
    (c) => c.PlanId === plan.id && c.recurrence === recurrence
  );
  const coupon = linkedCoupon ? { coupon: linkedCoupon.couponId } : {};
  const customerId = await stripeCustomerIdManager({});

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: planPrice,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: subscription_data,
    customer: customerId,

    discounts: [coupon],
    success_url:
      "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `${process.env.NEXT_URI}/pricing`,
  });

  return session.url;
};

// Once payment (checkout) ponctual
export const createCheckoutSessionPonctual = async (
  planPrice: string,
  plan: iPlan
) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }
   const subscription_data = plan.trialDays
    ? plan.trialDays > 0
      ? { trial_period_days: plan.trialDays }
      : {}
    : {};
  const mode = plan.saasType === "PAY_ONCE" ? "payment" : "subscription";
  const coupon = plan.coupons.length > 0 ? plan.coupons[0].couponId : undefined;
  const customerId = await stripeCustomerIdManager({});
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: planPrice,
        quantity: 1,
      },
    ],
    mode: mode,
    customer: customerId,
        subscription_data: subscription_data,

    discounts: [{ coupon }],
    success_url:
      "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `${process.env.NEXT_URI}/pricing`,
  });

  return session.url;
};
