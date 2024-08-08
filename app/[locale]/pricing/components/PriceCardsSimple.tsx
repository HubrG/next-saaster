"use client";

import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { cn } from "@/src/lib/utils";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Suspense, lazy, memo, useEffect, useState } from "react";

const PriceCard = lazy(() =>
  import("./PriceCard").then((module) => ({ default: module.PriceCard }))
);
const MemoizedPriceCard = memo(PriceCard);

type PriceCardsSimpleProps = {
  className?: string;
};
export const PriceCardsSimple = ({className} : PriceCardsSimpleProps) => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlans, isPlanStoreLoading } = useSaasPlansStore();
  const [isLoading, setIsLoading] = useState(true);
  const plansFiltered = saasPlans.filter(
    (plan) =>
      plan.active && !plan.deleted && plan.saasType === saasSettings.saasType
  );

  useEffect(() => {
    if (!isPlanStoreLoading) {
      setIsLoading(false);
    }
  }, [isPlanStoreLoading]);

  if (saasSettings.displayFeaturesByCategory) return;
  if (isLoading) {
    return (
      <div className="grid grid-cols-3  items-center gap-10">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    );
  }

  return (
    <Suspense fallback={<SkeletonLoader type="card" />}>
      <div
        className={cn(
          " justify-evenly grid mt-10  w-full max-sm:px-5  md:mx-auto max-sm:mx-2 gap-10",
          { "md:grid-cols-1 lg:w-2/6": plansFiltered.length === 1 },
          { "md:grid-cols-2 lg:w-4/6": plansFiltered.length === 2 },
          { "md:grid-cols-3 lg:w-5/6": plansFiltered.length === 3 },
          {
            "xl:grid-cols-4 md:grid-cols-2 lg:w-4/4":
              plansFiltered.length === 4,
          },
          className
        )}>
        {plansFiltered.map((plan) => (
          <div key={plan.id} className="w-full">
            <MemoizedPriceCard plan={plan} />
          </div>
        ))}
      </div>
    </Suspense>
  );
};
