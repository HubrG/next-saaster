"use client";
import PercentageCalculator from "@/src/helpers/functions/maths/calcPercentage";
import { iPlan } from "@/src/types/iPlans";
type PriceCardPayOnceProps = {
  plan: iPlan;
};

export const payOncePricesAndFeatures = ({
  plan,
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
  const price = plan.oncePrice ?? 0;
  const coupon = plan.coupons;
  const percentOff =
    coupon.length > 0 ? coupon[0].coupon.percentOff : undefined;
  const priceWithDiscount = percentOff
    ? percentage.decreaseValueByPercentage(price, percentOff)
    : undefined;
  const data = {
    price: price,
    percentOff: percentOff ? percentOff : undefined,
    priceWithDiscount,
  };

  return data;
};
