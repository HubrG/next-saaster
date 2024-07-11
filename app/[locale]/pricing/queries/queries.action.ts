"use server";

import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import { env } from "@/src/lib/zodEnv";
import { iPlan } from "@/src/types/db/iPlans";
import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "");

type CreateCheckoutSessionProps = {
  planPrice: string;
  plan: iPlan;
  customQte?: number | undefined;
  isMeteredUsage?: boolean;
  si?: string | undefined;
  isYearly?: boolean | undefined;
  seatQuantity?: number | undefined;
  creditByMonth?: number | undefined;
  customDiscountId?: string | undefined;
  customMode?: "subscription" | "payment" | undefined;
};
export const createCheckoutSession = async ({
  planPrice,
  plan,
  isYearly,
  seatQuantity,
  creditByMonth,
  customMode,
}: CreateCheckoutSessionProps) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }
  const metadata =
    plan.saasType === "PAY_ONCE" || customMode === "payment"
      ? {
          priceId: planPrice,
          refill:
            plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0
              ? plan.creditAllouedByMonth
              : 0,
        }
      : undefined;
  let subscriptionData = {};
  if (plan.trialDays && plan.trialDays > 0) {
    subscriptionData = {
      trial_period_days: plan.trialDays,
      metadata: {
        creditByMonth: creditByMonth
          ? creditByMonth
          : plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0
          ? plan.creditAllouedByMonth
          : undefined,
      },
    };
  } else {
    subscriptionData = {
      metadata: {
        creditByMonth: creditByMonth
          ? creditByMonth
          : (plan.saasType !== "PAY_ONCE" || customMode === "payment") &&
            plan.creditAllouedByMonth &&
            plan.creditAllouedByMonth > 0
          ? plan.creditAllouedByMonth
          : undefined,
      },
    };
  }
  const mode = customMode
    ? customMode
    : plan.saasType === "PAY_ONCE"
    ? "payment"
    : "subscription";
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
    metadata: metadata,
    subscription_data:
      customMode !== "payment" && plan.saasType !== "PAY_ONCE"
        ? subscriptionData
        : undefined,
    discounts: [{ coupon }],
    success_url:
      `${env.NEXT_URI}/pricing/success?session_id={CHECKOUT_SESSION_ID}` as any,
    cancel_url: `${env.NEXT_URI}/pricing` as any,
  });
  return (session.url as any) ?? undefined;
};

export const createCheckoutUpdateSession = async ({
  planPrice,
  plan,
  customQte,
  isMeteredUsage,
  si,
  isYearly,
  customMode,
  creditByMonth,
  customDiscountId,
  seatQuantity,
  subscriptionId,
}: CreateCheckoutSessionProps & { subscriptionId: string }) => {
  if (!planPrice || !plan) {
    throw new Error("Plan ID is required");
  }

  let subscriptionData = {};
  if (plan.trialDays && plan.trialDays > 0) {
    subscriptionData = {
      trial_period_days: plan.trialDays,
      creditByMonth: creditByMonth
        ? creditByMonth
        : plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0
        ? plan.creditAllouedByMonth
        : undefined,
    };
  } else {
    subscriptionData = {
      creditByMonth: creditByMonth
        ? creditByMonth
        : plan.saasType !== "PAY_ONCE" &&
          plan.creditAllouedByMonth &&
          plan.creditAllouedByMonth > 0
        ? plan.creditAllouedByMonth
        : undefined,
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

  // const customerId = await stripeCustomerIdManager({});
  const quantity =
    plan.saasType === "METERED_USAGE" && !plan.isFree
      ? undefined
      : plan.saasType === "PER_SEAT"
      ? seatQuantity
      : 1;

  try {
    await stripe.subscriptions.deleteDiscount(subscriptionId);
  } catch (error) {
    //  On continue
    console.error(error);
  }
  const updatedSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      discounts: [{ coupon: customDiscountId ?? coupon }],
      items: [
        {
          id: si,
          price: planPrice,
          quantity: isMeteredUsage ? undefined : customQte ?? quantity,
        },
      ],
      metadata: subscriptionData,
    }
  );
  if (!updatedSubscription) return false;

  if (!updatedSubscription) return false;
  return true;
};

export const createCheckoutCustomSession = async ({
  priceId,
  customMode,
  creditByMonth,
  isMeteredUsage,
  customDiscountId,
  customTrialDays,
  customQte
}: {
  priceId: string;
  customDiscountId?: string | undefined;
  customMode?: "subscription" | "payment" | undefined;
  creditByMonth?: number | undefined;
  customTrialDays?: number | undefined;
  isMeteredUsage?: boolean | undefined;
  customQte?: number | undefined;
}) => {
  const customerId = await stripeCustomerIdManager({});
  const metadata =
    customMode === "subscription"
      ? {
          priceId,
          creditByMonth: creditByMonth ?? 0,
        }
      : undefined;

  const quantity = isMeteredUsage ? undefined : customQte ?? 1;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    metadata,
    subscription_data: {
      trial_period_days:
        customMode === "subscription" && customTrialDays
          ? customTrialDays
          : undefined,
    },
    discounts: [{ coupon: customDiscountId }],
    allow_promotion_codes: customDiscountId ? undefined : true,
    mode: customMode,
    success_url: `${env.NEXT_URI}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_URI}/pricing`,
  });
  return (session.url as any) ?? undefined;
};
