"use client";
import { DotBlurredAndGradient } from "@/src/components/ui/@fairysaas/layout-elements/dot-blured-and-gradient";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { Input } from "@/src/components/ui/input";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { defaultLocale } from "@/src/lib/intl/navigation";
import { translateTextWithDeepL } from "@/src/lib/translate-api";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useTranslationStore } from "@/src/stores/translationStore";
import { iPlan } from "@/src/types/db/iPlans";
import { SaasSettings } from "@prisma/client";
import { toLower } from "lodash";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
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
  price: number | undefined;
  t: (key: string) => string;
};

const GenerateRecurrenceText = ({
  plan,
  isYearly,
  saasSettings,
  price,
  t,
}: GenerateProps) => {
  const { seatQuantity } = usePublicSaasPricingStore();

  const renderMRRSimple = () => {
    if (plan.saasType === "MRR_SIMPLE" && !plan.isFree) {
      return ` / ${isYearly ? t("yearly") : t("monthly")}`;
    }
    return null;
  };

  const renderMeteredUsage = () => {
    if (plan.saasType === "METERED_USAGE" && !plan.isFree) {
      return (
        <span className="block">
          / {t("metered-unit")}{" "}
          {plan.meteredMode === "UNIT" ? "" : plan.meteredUnit}{" "}
          {toLower(saasSettings.creditName ?? "credit")}
          {plan.meteredMode === "PACKAGE" ? "s" : ""}
        </span>
      );
    }
    return null;
  };

  const renderPerSeat = () => {
    if (plan.saasType === "PER_SEAT" && !plan.isFree) {
      return (
        <>
          <span className="block">
            / {t("metered-unit")} {isYearly ? t("yearly") : t("monthly")} /{" "}
            {t("per-seat")}
          </span>
          <div className="grid grid-cols-12 items-center justify-between mt-3 gap-5">
            <NumberOfSeat className="col-span-5" />
            <div className="col-span-7 font-normal">
              seat{seatQuantity > 1 && "s"} -{" "}
              {price ? (price * seatQuantity).toString() : "0"}
              {saasSettings.currency
                ? convertCurrencyName(saasSettings.currency, "sigle")
                : ""}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <>
      {renderMRRSimple()}
      {renderMeteredUsage()}
      {renderPerSeat()}
    </>
  );
};
type NumberOfSeatProps = {
  className: string;
};
const NumberOfSeat = ({ className }: NumberOfSeatProps) => {
  const { seatQuantity, setSeatQuantity } = usePublicSaasPricingStore();
  const handleUpdateSeat = (e: string) => {
    const seatQuantity = parseInt(e);
    setSeatQuantity(seatQuantity);
  };
  return (
    <>
      <Input
        type="number"
        className={className}
        value={seatQuantity}
        onChange={(e) => handleUpdateSeat(e.target.value)}
      />
    </>
  );
};
export const PriceCardHeader = ({
  plan,
  saasSettings,
}: PriceCardHeaderProps) => {
  const t = useTranslations("Pricing.Components.CardHeader");
  const format = useFormatter();
  const locale = useLocale();
  // Dynamical translation
  const [hasTranslated, setHasTranslated] = useState(false);
  const key = `${plan.name}-${locale}`;
  const { priceTitleTranslations, setPriceTitleTranslations } =
    useTranslationStore();
  useEffect(() => {
    const translateNameAndDescription = async () => {
      if (
        !hasTranslated &&
        !priceTitleTranslations[key] &&
        locale !== defaultLocale
      ) {
        setHasTranslated(true);
        if (hasTranslated) return;
        const name = await translateTextWithDeepL(
          plan.name ?? "",
          locale,
          defaultLocale
        );
        const description = await translateTextWithDeepL(
          plan.description ?? "",
          locale,
          defaultLocale
        );
        setPriceTitleTranslations(key, { name, description });
      }
    };
    translateNameAndDescription();
  }, [
    key,
    locale,
    plan.name,
    plan.description,
    priceTitleTranslations,
    setPriceTitleTranslations,
    hasTranslated,
  ]);
  const { name, description } = priceTitleTranslations[key] || {
    name: plan.name ?? "",
    description: plan.description ?? "",
  };

  const type = saasSettings.saasType;
  const { isYearly } = usePublicSaasPricingStore();
  let price;
  if (type === "PAY_ONCE") {
    price = payOncePricesAndFeatures({ plan });
  } else if (
    type === "MRR_SIMPLE" ||
    type === "METERED_USAGE" ||
    type === "PER_SEAT"
  ) {
    price = MRRPricesAndFeatures({ plan, isYearly });
  } else {
    return null;
  }
  if (!price) return null;

  return (
    <>
      <PriceCardBadge
        text={
          plan.isPopular
            ? t("popular")
            : plan.isRecommended
            ? t("recommended")
            : null
        }
      />
      <div className="min-h-48 flex flex-col justify-between">
        <div className="h-1/2">
          <Suspense fallback={<SkeletonLoader type="simple-line" />}>
            <h1 className="text-xl">{name || plan.name}</h1>
          </Suspense>
          <p
            className={cn(
              { hidden: plan.description?.length === 0 },
              "description"
            )}>
            <Suspense fallback={<SkeletonLoader type="simple-line" />}>
              {description || plan.description}
            </Suspense>
          </p>
        </div>
        <DotBlurredAndGradient
          className="!opacity-20 mt-20 h-96 w-full"
          gradient="gradient-to-b-second"
        />
        <h3 className={cn({ "!-mt-24 pt-0": plan.isTrial }, "h-1/2")}>
          <div className="grid grid-rows-4">
            {plan.isTrial ? (
              <>
                <span className="trial row-span-1 block pt-2">
                  {plan.trialDays} {t("trial")}
                </span>
              </>
            ) : (
              <span className="row-span-1">&nbsp;</span>
            )}
            {!plan.isCustom ? (
              <>
                {price.percent_off || price.amount_off ? (
                  <>
                    <span className="price-stroke">
                      {format.number(price.price ?? 0, {
                        style: "currency",
                        currency: saasSettings.currency ?? "usd",
                      })}
                    </span>
                    <div>
                      <span className="text-3xl">
                        {format.number(price.priceWithDiscount ?? 0, {
                          style: "currency",
                          currency: saasSettings.currency ?? "usd",
                        })}
                      </span>
                      <span className="recurrence">
                        {GenerateRecurrenceText({
                          plan,
                          isYearly,
                          saasSettings,
                          price: price.priceWithDiscount,
                          t,
                        })}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="row-span-1">&nbsp;</span>
                    <div>
                      <span className="text-3xl">
                        {format.number(price.priceWithDiscount ?? 0, {
                          style: "currency",
                          currency: saasSettings.currency ?? "usd",
                        })}
                      </span>
                      <span className="recurrence">
                        {GenerateRecurrenceText({
                          plan,
                          isYearly,
                          saasSettings,
                          price: price.price,
                          t,
                        })}
                      </span>
                    </div>
                  </>
                )}
                {plan.creditAllouedByMonth && plan.creditAllouedByMonth > 0 ? (
                  <span className="block text-xs">
                    {plan.creditAllouedByMonth}{" "}
                    {toLower(saasSettings.creditName ?? "")}
                    {saasSettings.creditName &&
                      plan.creditAllouedByMonth > 1 &&
                      "s"}{" "}
                    / {t("by-month")}
                  </span>
                ) : null}
              </>
            ) : (
              <>
                <p>{t("contact-us")}</p>
              </>
            )}
          </div>
        </h3>
      </div>
    </>
  );
};
