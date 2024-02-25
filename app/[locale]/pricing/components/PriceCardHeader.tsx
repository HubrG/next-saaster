import { DotBlurredAndGradient } from "@/src/components/ui/layout-elements/dot-blured-and-gradient";
import currenciesData from "@/src/jsons/currencies.json";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { Currencies } from "@/src/types/Currencies";
import { iPlan } from "@/src/types/iPlans";
import { SaasSettings } from "@prisma/client";
import { toLower } from "lodash";
import { payOncePricesAndFeatures } from "./PAY_ONCE/prices";
import { PriceCardBadge } from "./PriceCardBadge";
import { MRRPricesAndFeatures } from "./RECURRENCE/prices";

type PriceCardHeaderProps = {
  plan: iPlan;
  saasSettings: SaasSettings;
};
type GenerateProps = {
  plan: iPlan;
  isYearly: boolean;
  saasSettings: SaasSettings;
};
const generateRecurrenceText = ({
  plan,
  isYearly,
  saasSettings,
}: GenerateProps) => {
  if (plan.saasType === "MRR_SIMPLE" && !plan.isFree) {
    return ` / ${isYearly ? "year" : "month"}`;
  }
  if (plan.saasType === "METERED_USAGE" && !plan.isFree) {
    return (
      <span className="block">
        / per {plan.meteredUnit} {toLower(saasSettings.creditName ?? "credit")}
        {plan.meteredMode === "PACKAGE" ? "s" : ""}
      </span>
    );
  }
  return null;
};

export const PriceCardHeader = ({
  plan,
  saasSettings,
}: PriceCardHeaderProps) => {
  const type = saasSettings.saasType;
  const { isYearly, setIsYearly } = usePublicSaasPricingStore();
  let price;
  if (type === "PAY_ONCE") {
    price = payOncePricesAndFeatures({ plan });
  } else if (type === "MRR_SIMPLE" || type === "METERED_USAGE") {
    price = MRRPricesAndFeatures({ plan, isYearly });
  } else {
    return null;
  }
  if (!price) return null;

  const currencies = currenciesData as Currencies;
  const currencySymbol = saasSettings.currency
    ? currencies[saasSettings.currency]?.sigle
    : "";

  return (
    <>
      <PriceCardBadge
        text={
          plan.isPopular
            ? "Most popular"
            : plan.isRecommended
            ? "Recommended"
            : null
        }
      />
      <div className="min-h-48 flex flex-col justify-between">
        <div className="h-1/2">
        <h1 className="text-xl">{plan.name}</h1>
        <p className={cn({ hidden: plan.description?.length === 0 },"description")}>
          {plan.description}
        </p>
        </div>
        <DotBlurredAndGradient
          className="!opacity-20 mt-20 h-96 w-full"
          gradient="gradient-to-b-second"
        />
        <h3 className={cn({ "!-mt-24 pt-0": plan.isTrial },"h-1/2")}>
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
                {generateRecurrenceText({ plan, isYearly, saasSettings })}
              </span>
            </>
          ) : (
            <>
              {price.price}
              {currencySymbol}
              <span className="recurrence">
                {generateRecurrenceText({ plan, isYearly, saasSettings })}
              </span>
            </>
          )}
        </h3>
      </div>
    </>
  );
};
