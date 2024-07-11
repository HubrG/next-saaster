import { iPlan } from "@/src/types/db/iPlans";
import { iStripePrice } from "@/src/types/db/iStripePrices";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { Coupon, iUsers } from "@/src/types/db/iUsers";
import { StripeProduct, Subscription, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

export type ReturnUserDependencyProps = {
  isLoading: boolean;
  oneTimePayments: iUsers["oneTimePayments"];
  setProperty: (prop: keyof ReturnUserDependencyProps, value: any) => void;
  //
  activeSubscription: {
    subscription: (Subscription & { allDatas?: Stripe.Subscription }) | null;
    usageType: "metered" | "licensed" | null;
    recurring: "day" | "week" | "month" | "year" | null;
    creditRemaining: number;
    meteredUnit: number | null;
    creditAllouedByMonth: number;
    priceObject: iStripePrice;
    productObject: iStripeProduct | null;
    planObject: iPlan;
    quantity: number;
    currency: string;
    coupon: Coupon | null;
    priceWithDiscount: number;
    priceWithoutDiscount: number;
    priceWithDiscountAndQuantity: number | null;
    creditPercentage: number;
    isTrial: boolean;
    trialDateEnd: number | null;
    trialDaysRemaining: number | null;
    isCanceling: boolean;
    canceledActiveUntil: number | null;
    subscriptionItemId: string | null;
    status: SubscriptionStatus;
  };
  info: iUsers;
  payments: {
    total_amount_ontime_payments: number | null;
    total_amount_subscriptions: number | null;
  };
};
/**
 *  Get user dependency
 *
 * @remarks
 * This method is part of the {@link dependencies | dependencies utilities}.
 *
 * @param user - The user object
 * @returns The user dependency
 */
export const getUserInfos = ({ user, email }: { user: iUsers, email?:string }) => {
  // We get the user's subscription
  const subscription = user.subscriptions?.find(
    (sub) => sub.isActive
  )?.subscription;

  const activeSubscription = user.subscriptions?.find((sub) => sub.isActive);

  const activeSubscriptionData = activeSubscription?.subscription
    ?.allDatas as Stripe.Subscription | null;

  const subscriptionDiscount = activeSubscriptionData?.discount;

  const priceWithDiscount = () => {
    if (
      subscriptionDiscount?.coupon &&
      subscriptionDiscount?.coupon.amount_off !== undefined &&
      subscriptionDiscount?.coupon.amount_off !== null
    ) {
      return (
        (subscription?.price?.unit_amount &&
          subscription?.price?.unit_amount / 100 -
            subscriptionDiscount.coupon.amount_off / 100) ??
        null
      );
    } else if (
      subscriptionDiscount?.coupon &&
      subscriptionDiscount?.coupon.percent_off !== undefined &&
      subscriptionDiscount?.coupon.percent_off !== null
    ) {
      return (
        (subscription?.price?.unit_amount &&
          subscription?.price?.unit_amount / 100 -
            (subscription?.price?.unit_amount / 100) *
              (subscriptionDiscount.coupon.percent_off / 100)) ??
        null
      );
    } else {
      return null;
    }
  };

  const trialDaysRemaining = () => {
    if (subscription?.status === "trialing") {
      const createdAt = new Date(subscription?.createdAt as Date);
      const trialEnd = new Date(
        createdAt.setDate(
          createdAt.getDate() +
            (subscription?.price?.productRelation?.PlanRelation?.trialDays ?? 0)
        )
      ).getTime();
      const today = new Date().getTime();
      const remaining = trialEnd - today;
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      return days;
    }
  };

  const userInfo = {
    setProperty: (prop: keyof ReturnUserDependencyProps, value: any) => {
      userInfo[prop] = value;
    },
    isLoading: user.role ? false : true,
    // Active subscription
    activeSubscription: activeSubscription?.subscription
      ? {
          subscriptionItemId: activeSubscriptionData?.items?.data[0].id ?? null,
          status: activeSubscription?.subscription?.status ?? "active",
          subscription:
            (activeSubscription.subscription as Subscription) ?? null, // Active subscription
          usageType:
            activeSubscriptionData?.items?.data[0].plan.usage_type ?? null, // Usage type
          recurring:
            activeSubscriptionData?.items?.data[0].price.recurring?.interval ??
            null, // Recurring interval
          quantity: activeSubscriptionData?.items?.data[0].quantity ?? 0, // Quantity
          coupon: activeSubscriptionData?.discount?.coupon ?? null, // Coupon
          meteredUnit: activeSubscriptionData?.items?.data[0].price
            .transform_quantity
            ? activeSubscription?.subscription?.price?.productRelation
                ?.PlanRelation?.meteredUnit
            : null, // Metered unit
          currency: activeSubscription?.subscription?.price?.currency ?? "USD", // Currency
          creditAllouedByMonth:
            activeSubscription?.subscription?.price?.productRelation
              ?.PlanRelation?.creditAllouedByMonth ?? 0, // Credit alloued by month
          creditRemaining: activeSubscription?.creditRemaining ?? 0, // Credit remaining for the current month
          priceObject: activeSubscription?.subscription?.price ?? null,
          productObject:
            (activeSubscription?.subscription?.price
              ?.productRelation as StripeProduct) ?? null,
          planObject:
            activeSubscription?.subscription?.price?.productRelation
              ?.PlanRelation ?? null,
          priceWithDiscount:
            priceWithDiscount() ??
            (activeSubscription?.subscription?.price?.unit_amount &&
              activeSubscription?.subscription?.price?.unit_amount / 100) ??
            0,
          priceWithoutDiscount: activeSubscription?.subscription?.price ?? 0,
          // Multiplication by quantity
          priceWithDiscountAndQuantity:
            (activeSubscriptionData?.items?.data[0]?.quantity ?? 0) *
              (priceWithDiscount() ??
                (activeSubscription?.subscription?.price?.unit_amount &&
                  activeSubscription?.subscription?.price?.unit_amount / 100) ??
                0) ?? null,
          creditPercentage:
            Math.round(
              ((activeSubscription?.creditRemaining ?? 0) /
                (activeSubscription?.subscription?.price?.productRelation
                  ?.PlanRelation?.creditAllouedByMonth ?? 0)) *
                100 *
                100
            ) / 100, // Credit remaining in percentage
          isTrial: activeSubscription?.subscription?.status === "trialing",
          trialDateEnd: activeSubscriptionData?.trial_end ?? null,
          trialDaysRemaining:
            activeSubscription?.subscription?.status === "trialing"
              ? trialDaysRemaining()
              : null,
          isCanceling: activeSubscriptionData?.cancel_at_period_end ?? false,
          canceledActiveUntil:
            activeSubscriptionData?.current_period_end ?? null,
        }
      : null,
    // User info
    info: user,
    payments: {
      total_amount_ontime_payments: user.oneTimePayments?.reduce(
        (acc, payment) => acc + payment.amount / 100,
        0
      ),
      total_amount_subscriptions:
        user.subscriptions?.reduce((acc, sub) => {
          if (sub.subscription && sub.subscription.SubscriptionPayments) {
            const totalPaidForSub =
              sub.subscription.SubscriptionPayments.reduce(
                (accPayment, payment) => {
                  if (payment.status === "paid") {
                    return accPayment + (payment.amount ?? 0);
                  }
                  return accPayment;
                },
                0
              );
            return acc + totalPaidForSub / 100;
          }
          return acc;
        }, 0) ?? 0,
    },
    // One time payments
    oneTimePayments: user.oneTimePayments,
  };
  return userInfo as ReturnUserDependencyProps;
};
