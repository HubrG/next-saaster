"use client";
import PercentageCalculator from "@/src/helpers/functions/maths/calcPercentage";
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
  priceWithDiscount: number | undefined;
  price: number | undefined;
  monthlypercent_off?: number | undefined;
  yearlypercent_off?: number | undefined;
  monthlyPriceWithDiscount?: number | undefined;
  yearlyPriceWithDiscount?: number | undefined;
} => {
  const percentage = new PercentageCalculator();
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
  if (coupon.length > 0) {
    if (isYearly) {
      const yearlyCoupon = coupon.find((c) => c.recurrence === "yearly");
      percent_off = yearlyCoupon?.coupon.percent_off;
    } else {
      const monthlyCoupon = coupon.find((c) => c.recurrence === "monthly");
      percent_off = monthlyCoupon?.coupon.percent_off;
    }
  } else {
    percent_off = undefined;
  }

  const priceWithDiscount = percent_off
    ? percentage.decreaseValueByPercentage(price, percent_off)
    : undefined;

  const data = {
    price,
    percent_off: percent_off ? percent_off : undefined,
    priceWithDiscount,
  };

  return data;
};
