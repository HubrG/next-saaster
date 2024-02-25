"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { PriceCardBottomSentence } from "./PriceCardBottomSentence";
import { PriceCardBuyButton } from "./PriceCardBuyButton";
import { PriceCardFeatures } from "./PriceCardFeatures";
import { PriceCardHeader } from "./PriceCardHeader";

type PriceCardProps = {
  plan: iPlan;
};

export const PriceCard = ({ plan }: PriceCardProps) => {
  const { saasSettings } = useSaasSettingsStore();
  return (
    <>
      <Card
        className={cn(
          {
            "card-popular": plan.isPopular || plan.isRecommended,
          },
          `price-card-wrapper flex flex-col justify-between`
        )}>
        <PriceCardHeader plan={plan} saasSettings={saasSettings} />
        <Goodline />
        <div className="features">
          <PriceCardFeatures plan={plan} />
        </div>
        <PriceCardBuyButton className="mt-7 w-full z-[99999999]" plan={plan} />
      </Card>
      <PriceCardBottomSentence
        className="text-center my-2  !font-normal text-theming-text-50"
        sentence="Single payment. Limitless projects"
      />
    </>
  );
};
