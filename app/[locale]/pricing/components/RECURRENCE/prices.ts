"use client";
import PercentageCalculator from "@/src/helpers/functions/maths/calcPercentage";
import { iPlan } from "@/src/types/iPlans";
type PriceCardPayOnceProps = {
  plan: iPlan;
  isYearly: boolean;
};

export const MRRPricesAndFeatures = ({
  plan,
  isYearly,
}: PriceCardPayOnceProps): {
  percentOff: number | undefined;
  priceWithDiscount: number | undefined;
  price: number | undefined;
  monthlyPercentOff?: number | undefined;
  yearlyPercentOff?: number | undefined;
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
  let percentOff;
  if (coupon.length > 0) {
    if (isYearly) {
      const yearlyCoupon = coupon.find((c) => c.recurrence === "yearly");
      percentOff = yearlyCoupon?.coupon.percentOff;
    } else {
      const monthlyCoupon = coupon.find((c) => c.recurrence === "monthly");
      percentOff = monthlyCoupon?.coupon.percentOff;
    }
  } else {
    percentOff = undefined;
  }

  const priceWithDiscount = percentOff
    ? percentage.decreaseValueByPercentage(price, percentOff)
    : undefined;

  const data = {
    price,
    percentOff: percentOff ? percentOff : undefined,
    priceWithDiscount,
  };

  return data;
};
