"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/@shadcn/card";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/db/iPlans";
import { useTranslations } from "next-intl";
import { PriceCardBottomSentence } from "./PriceCardBottomSentence";
import { PriceCardBuyButton } from "./PriceCardBuyButton";
import { PriceCardContactUsButton } from "./PriceCardContactUsButton";
import { PriceCardFeatures } from "./PriceCardFeatures";
import { PriceCardHeader } from "./PriceCardHeader";

type PriceCardProps = {
  plan: iPlan;
};

export const PriceCard = ({ plan }: PriceCardProps) => {
  const { saasSettings } = useSaasSettingsStore();
  //
  const t = useTranslations("Pricing.Components.PriceCard");
  return (
    <>
      <Card
        className={cn(
          {
            "card-popular": plan.isPopular || plan.isRecommended,
          },
          `price-card-wrapper flex flex-col justify-between z-0`
        )}>
        <PriceCardHeader plan={plan} saasSettings={saasSettings} />
        {plan.isCustom ? (
          <PriceCardContactUsButton className="!z-[99]" />
        ) : (
          <PriceCardBuyButton className="w-full !z-[99]" plan={plan} />
        )}
        <Goodline className={cn({ hidden: plan.isCustom })} />
        <div className="features">
          <PriceCardFeatures plan={plan} />
        </div>
      </Card>

      <PriceCardBottomSentence
        className="text-center my-2  !font-normal !text-theming-text-800"
        sentence={t("bottom-sentence")}
      />
    </>
  );
};
