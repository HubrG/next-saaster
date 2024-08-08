"use client";
import {
  usePercentageCalculator,
} from "@/src/hooks/utils/usePercentageCalc";
import { iPlan } from "@/src/types/db/iPlans";

type PriceCardPayOnceProps = {
  plan: iPlan;
  isYearly: boolean;
};

export const MRRPricesAndFeatures = ({
  plan,
  isYearly,
}: PriceCardPayOnceProps): {
  percent_off: number | undefined;
  amount_off: number | undefined;
  priceWithDiscount: number | undefined;
  price: number | undefined;
  monthlypercent_off?: number | undefined;
  yearlypercent_off?: number | undefined;
  monthlyPriceWithDiscount?: number | undefined;
  yearlyPriceWithDiscount?: number | undefined;
} => {
  const { decreaseValueByPercentage } = usePercentageCalculator();
  let price;
  if (plan.isFree) {
    price = 0;
  } else if (plan.saasType === "METERED_USAGE") {
    price = plan.monthlyPrice ?? 0;
  } else if (isYearly) {
    price = plan.yearlyPrice ?? 0;
  } else {
    price = plan.monthlyPrice ?? 0;
  }

  const coupon = plan.coupons;
  let percent_off;
  let amount_off;
  if (coupon.length > 0) {
    if (isYearly) {
      const yearlyCoupon = coupon.find((c) => c.recurrence === "yearly");
      percent_off = yearlyCoupon?.coupon.percent_off;
      amount_off = yearlyCoupon?.coupon.amount_off;
    } else {
      const monthlyCoupon = coupon.find((c) => c.recurrence === "monthly");
      percent_off = monthlyCoupon?.coupon.percent_off;
      amount_off = monthlyCoupon?.coupon.amount_off;
    }
  } else {
    percent_off = undefined;
    amount_off = undefined;
  }

  let priceWithDiscount;

  if (amount_off) {
    priceWithDiscount = price - (amount_off ?? 0) / 100;
  } else if (percent_off) {
    priceWithDiscount = decreaseValueByPercentage(price, percent_off ?? 0);
  } else {
    priceWithDiscount = price;
  }
  //
  const data = {
    price,
    percent_off: percent_off ? percent_off : undefined,
    amount_off: amount_off ? amount_off : undefined,
    priceWithDiscount,
  };

  return data;
};
