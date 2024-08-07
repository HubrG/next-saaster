"use client";
import { usePercentageCalculator } from "@/src/hooks/utils/usePercentageCalc";
import { iPlan } from "@/src/types/db/iPlans";

type PriceCardPayOnceProps = {
  plan: iPlan;
};

export const payOncePricesAndFeatures = ({
  plan,
}: PriceCardPayOnceProps): {
  percent_off: number | undefined;
  amount_off: number | undefined;
  priceWithDiscount: number | undefined;
  price: number | undefined;
} => {
  const { decreaseValueByPercentage } = usePercentageCalculator();
  const percentage = {};
  const price = plan.oncePrice ?? 0;
  const coupon = plan.coupons;
  let percent_off, amount_off;

  if (coupon.length > 0) {
    percent_off = coupon[0].coupon.percent_off;
    amount_off = coupon[0].coupon.amount_off;
  }

  let priceWithDiscount;
  if (amount_off !== undefined && amount_off !== null) {
    priceWithDiscount = price - (amount_off ?? 0) / 100;
  } else if (percent_off !== undefined && percent_off !== null) {
    priceWithDiscount = decreaseValueByPercentage(price, percent_off ?? 0);
  } else {
    priceWithDiscount = price;
  }

  const data = {
    price: price,
    percent_off: percent_off ? percent_off : undefined,
    amount_off: amount_off ? amount_off : undefined,
    priceWithDiscount,
  };

  return data;
};
