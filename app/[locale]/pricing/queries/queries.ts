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



// Once payment (checkout) ponctual
type CreateCheckoutSessionPonctualProps = {
  planPrice: string;
  plan: iPlan;
  isYearly?: boolean | undefined;
  seatQuantity?: number | undefined;
};
export const createCheckoutSessionPonctual = async ({
  planPrice,
  plan,
  isYearly,
  seatQuantity,
}: CreateCheckoutSessionPonctualProps) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }
  const subscription_data = plan.trialDays
    ? plan.trialDays > 0
      ? { trial_period_days: plan.trialDays }
      : {}
    : {};
  const mode = plan.saasType === "PAY_ONCE" ? "payment" : "subscription";
  let coupon;
  if (isYearly === undefined && plan.coupons.length > 0) {
    coupon = plan.coupons[0].couponId;
  } else if (isYearly && plan.coupons.length > 0) {
    coupon = plan.coupons.find((c) => c.recurrence === "yearly")?.couponId;
  } else if (!isYearly && plan.coupons.length > 0) {
    coupon = plan.coupons.find((c) => c.recurrence === "monthly")?.couponId;
  } else {
    coupon = undefined;
  }
  const customerId = await stripeCustomerIdManager({});
  const quantity =
    plan.saasType === "METERED_USAGE" && !plan.isFree ? undefined : plan.saasType === "PER_SEAT" ? seatQuantity :1;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: planPrice,
        quantity: quantity,
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
