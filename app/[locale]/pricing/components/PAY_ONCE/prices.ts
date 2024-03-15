"use client";
import PercentageCalculator from "@/src/helpers/functions/maths/calcPercentage";
import { iPlan } from "@/src/types/db/iPlans";
type PriceCardPayOnceProps = {
  plan: iPlan;
};

export const payOncePricesAndFeatures = ({
  plan,
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
  const price = plan.oncePrice ?? 0;
  const coupon = plan.coupons;
  const percent_off =
    coupon.length > 0 ? coupon[0].coupon.percent_off : undefined;
  const priceWithDiscount = percent_off
    ? percentage.decreaseValueByPercentage(price, percent_off)
    : undefined;
  const data = {
    price: price,
    percent_off: percent_off ? percent_off : undefined,
    priceWithDiscount,
  };

  return data;
};
