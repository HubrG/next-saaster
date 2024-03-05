import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import {
  SubItemsPlan,
  SubItemsPrice,
  SubscriptionDiscount,
  SubscriptionItem,
  iUsers,
} from "@/src/types/iUsers";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

export type ReturnProps = {
  userInfo: iUsers;
  planName: string | "No plan";
  planPrice: number;
  planStatus: SubscriptionStatus;
  currency: string;
  planDiscount: SubscriptionDiscount | null;
  planItemsPlan?: SubItemsPlan | null;
  planItemsPrice?: SubItemsPrice | null;
  planItems?: SubscriptionItem[0] | null;
  isLoading: boolean;
  planPriceWithDiscount?: number;
  planInterval: string;
  plan: Subscription | null;
  isActivePlan: boolean | null;
  planTrialRemaining?: number;
  planAllDatas: Stripe.Subscription | null;
  featuresList: iPlanToFeature[] | null;
  planPlan: iPlan | null;
  subItem: string;
  oneTimePayments: iUsers["oneTimePayments"];
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
export const getUserInfos = ({ user }: { user: iUsers }) => {

  // We get the user's subscription
  const subscription = user.subscriptions?.find(
    (sub) => sub.isActive
  )?.subscription;

  // We get the user's subscription datas
  const subAllDatas = subscription?.allDatas as Stripe.Subscription | null;

  // 

  const planDiscount = subAllDatas?.discount;

  const planItems = subAllDatas?.items;

  // const planItems: SubscriptionItem | null =
  //   subscription?.items as SubscriptionItem | null;

  const priceWithDiscount = () => {
    if (
      planDiscount?.coupon &&
      planDiscount?.coupon.amount_off &&
      planDiscount
    ) {
      return (
        (subscription?.price?.unit_amount &&
          subscription?.price?.unit_amount / 100 -
            planDiscount.coupon.amount_off / 100) ??
        null
      );
    } else if (
      planDiscount?.coupon &&
      planDiscount?.coupon.percent_off &&
      planDiscount
    ) {
      return (
        (subscription?.price?.unit_amount &&
          subscription?.price?.unit_amount / 100 -
            (subscription?.price?.unit_amount / 100) *
              (planDiscount.coupon.percent_off / 100)) ??
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
    isActivePlan:
      subscription?.status === "active" || subscription?.status === "trialing"
        ? true
        : false,
    isLoading: user.role ? false : true,
    planTrialRemaining:
      subscription?.status === "trialing" ? trialDaysRemaining() : undefined,
    plan: subscription,
    planName:
      subscription?.price?.productRelation?.PlanRelation?.name ?? "No plan",
    planPrice:
      (subscription?.price?.unit_amount &&
        subscription?.price?.unit_amount / 100) ??
      0,
    planPriceWithDiscount:
      priceWithDiscount() ??
      (subscription?.price?.unit_amount &&
        subscription?.price?.unit_amount / 100) ??
      0,
    currency: subscription?.price?.currency ?? "USD",
    planStatus: subscription?.status ?? "active",
    planDiscount: planDiscount,
    planItems: planItems ? planItems.data[0] : null,
    planInterval: planItems?.data[0]
      ? planItems.data[0].price.recurring?.interval
      : "",
    planAllDatas: subAllDatas,
    featuresList:
      subscription?.price?.productRelation?.PlanRelation?.Features ?? null,
    planPlan: subscription?.price?.productRelation?.PlanRelation,
    subItem: planItems?.data[0].id ?? "",
    oneTimePayments: user.oneTimePayments,
    userInfo: user,
  };
  return userInfo as ReturnProps;
};
