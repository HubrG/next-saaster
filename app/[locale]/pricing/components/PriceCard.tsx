"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import { DotBlurredAndGradient } from "@/src/components/ui/layout-elements/dot-blured-and-gradient";
import currenciesData from "@/src/jsons/currencies.json";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { Currencies } from "@/src/types/Currencies";
import { iPlan } from "@/src/types/iPlans";
import { SaasSettings, SaasTypes } from "@prisma/client";
import { Suspense } from "react";
import { payOncePricesAndFeatures } from "./PAY_ONCE/prices";
import { PriceCardBadge } from "./PriceCardBadge";
import { PriceCardBottomSentence } from "./PriceCardBottomSentence";
import { PriceCardBuyButton } from "./PriceCardBuyButton";
import { PriceCardFeatures } from "./PriceCardFeatures";
import { MRRPricesAndFeatures } from "./RECURRENCE/prices";

type PriceCardProps = {
  plan: iPlan;
  type: SaasTypes;
  saasSettings: SaasSettings;
};

export const PriceCard = ({ plan, type, saasSettings }: PriceCardProps) => {
  const { isYearly } = usePublicSaasPricingStore();
  let price;
  if (type === "PAY_ONCE") {
    price = payOncePricesAndFeatures({ plan });
  } else if (type === "MRR_SIMPLE") {
    price = MRRPricesAndFeatures({ plan, isYearly });
  } else {
    return;
  }

  const currencies = currenciesData as Currencies;
  const currencySymbol = saasSettings.currency
    ? currencies[saasSettings.currency]?.sigle
    : "";

  return (
    <>
      <Card
        className={cn(
          {
            "card-popular": plan.isPopular || plan.isRecommended,
          },
          `price-card-wrapper`
        )}>
        <PriceCardBadge
          text={
            plan.isPopular
              ? "Most popular"
              : plan.isRecommended
              ? "Recommended"
              : null
          }
        />
        <h1 className="text-xl">{plan.name}</h1>
        <p className={cn({ hidden: plan.description?.length === 0 })}>
          {plan.description}
        </p>
          <DotBlurredAndGradient
            className="!opacity-20 mt-20 h-96 w-full"
            gradient="gradient-to-b-second"
          />
        <h3 className={cn({"!-mt-24 pt-0":plan.isTrial})}>
          {plan.isTrial && (
            <>
              <span className="trial">{plan.trialDays} days trial, then</span>
              <br />
            </>
          )}
          {price.percentOff ? (
            <>
              <span className="price-stroke">
                {price.price}
                {currencySymbol}
              </span>
              &nbsp;
              {price.priceWithDiscount}
              {currencySymbol}
              <span className="recurrence">
                {plan.saasType !== "PAY_ONCE" &&
                  !plan.isFree &&
                  ` / ${isYearly ? "year" : "month"}`}
              </span>
            </>
          ) : (
            <>
              {price.price}
              {currencySymbol}
              <span className="recurrence">
                {plan.saasType !== "PAY_ONCE" &&
                  !plan.isFree &&
                  ` / ${isYearly ? "year" : "month"}`}
              </span>
            </>
          )}
        </h3>
        <Goodline />
        <div className="features">
            <PriceCardFeatures plan={plan} />
        </div>
        <PriceCardBuyButton className="mt-7" plan={plan} />
      </Card>
      <PriceCardBottomSentence
        className="text-center my-2  !font-normal text-theming-text-50"
        sentence="Single payment. Limitless projects"
      />
    </>
  );
};
