"use client";
import React from "react";
import { BackgroundGrad } from "./Background";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { usePublicSaasPricingStore } from "@/src/stores/admin/publicSaasPricingStore";
import currenciesData from "@/src/jsons/currencies.json";
import { Currencies } from "@/src/types/Currencies";
import { Separator } from "@/src/components/ui/separator";
import { CheckoutButton } from "./CheckoutButton";
import { MRRSPlanStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { StripeCoupon } from "@prisma/client";

type Props = {
  plan: MRRSPlanStore;
  coupons: StripeCoupon[];
};

const calculateDiscountPrice = (price: number, discount?: number) => {
  if (!discount) return price.toFixed(2);
  const discountedPrice = price * (1 - discount / 100);
  return discountedPrice.toFixed(2);
};

export const PriceCard = ({ plan, coupons }: Props) => {
  const { saasSettings } = useSaasSettingsStore();
  const { isYearly } = usePublicSaasPricingStore();
  const currencies = currenciesData as Currencies;
  const currencySymbol = saasSettings.currency
    ? currencies[saasSettings.currency]?.sigle
    : "";

  const findDiscountPercent = (recurrence: string) => {
    const couponDetail = plan.coupons?.find((couponId) => {
      const coupon = coupons.find((c) => c.id === couponId.couponId);
      return couponId.recurrence === recurrence;
    });
    return (
      coupons.find((c) => c.id === couponDetail?.couponId)?.percentOff ?? 0
    );
  };

  const monthlyDiscount = findDiscountPercent("monthly");
  const yearlyDiscount = findDiscountPercent("yearly");

  const displayPrice = isYearly
    ? calculateDiscountPrice(plan.yearlyPrice ?? 0, yearlyDiscount)
    : calculateDiscountPrice(plan.monthlyPrice ?? 0, monthlyDiscount);
  const originalPrice = isYearly
    ? plan.yearlyPrice?.toFixed(2)
    : plan.monthlyPrice?.toFixed(2);
  const isDiscounted = isYearly ? yearlyDiscount > 0 : monthlyDiscount > 0;

  return (
    <BackgroundGrad>
      <div className="flex flex-col items-center gap-5 justify-center">
        <h2 className="font-bold text-center">{plan.name}</h2>
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-center">
            {isDiscounted && (
              <span className="line-through">{originalPrice}</span>
            )}
            <span>{displayPrice}</span>
            <small>{currencySymbol}</small>
          </span>
          <sup className="text-lg text-center">
            /{isYearly ? "year" : "month"}
          </sup>
        </div>
        <CheckoutButton plan={plan} />
        <Separator />
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-center">
            {plan.description}
          </span>
        </div>
      </div>
    </BackgroundGrad>
  );
};
