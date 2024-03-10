"use server";

import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import { iPlan } from "@/src/types/db/iPlans";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type CreateCheckoutSessionProps = {
  planPrice: string;
  plan: iPlan;
  isYearly?: boolean | undefined;
  seatQuantity?: number | undefined;
};
export const createCheckoutSession = async ({
  planPrice,
  plan,
  isYearly,
  seatQuantity,
}: CreateCheckoutSessionProps) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }
  const metadata =
    plan.saasType === "PAY_ONCE" ? { priceId: planPrice } : undefined;
  let subscriptionData = {};
  if (plan.trialDays && plan.trialDays > 0) {
    subscriptionData = {
      trial_period_days: plan.trialDays,
      metadata: {
        creditByMonth:
          plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0
            ? plan.creditAllouedByMonth
            : undefined,
      },
    };
  } else {
    subscriptionData = {
      metadata: {
        creditByMonth:
          plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0
            ? plan.creditAllouedByMonth
            : undefined,
      },
    };
  }
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
    plan.saasType === "METERED_USAGE" && !plan.isFree
      ? undefined
      : plan.saasType === "PER_SEAT"
      ? seatQuantity
      : 1;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "link"],
    line_items: [
      {
        price: planPrice,
        quantity: quantity,
      },
    ],
    payment_intent_data: { metadata },
    mode: mode,
    allow_promotion_codes: coupon ? undefined : true,
    customer: customerId,
    subscription_data: subscriptionData,
    discounts: [{ coupon }],
    success_url: `${process.env.NEXT_URI}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_URI}/pricing`,
  });
  return session.url;
};
