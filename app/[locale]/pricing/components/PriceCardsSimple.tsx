"use client";

import { Loader } from "@/src/components/ui/loader";
import { cn } from "@/src/lib/utils";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { PriceCard } from "./PriceCard";

export const PriceCardsSimple = () => {
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlans, isPlanStoreLoading } = useSaasPlansStore();
  const plansFiltered = saasPlans.filter(
    (plan) =>
      plan.active && !plan.deleted && plan.saasType === saasSettings.saasType
  );
  if (saasSettings.displayFeaturesByCategory) return;
  if (isPlanStoreLoading) {
    return <Loader noHFull />;
  }
  return (
    <div
      className={cn(
        { "lg:w-1/3": plansFiltered.length === 1 },
        { "md:grid-cols-2 lg:w-2/3": plansFiltered.length === 2 },
        { "md:grid-cols-3 lg:w-3/3": plansFiltered.length === 3 },
        {
          "xl:grid-cols-4 md:grid-cols-2 lg:w-4/4": plansFiltered.length === 4,
        },
        " justify-evenly grid grid-cols-1 w-full px-5 mx-auto gap-10"
      )}>
      {plansFiltered.map((plan) => (
        <div key={plan.id} className="w-full">
          <PriceCard plan={plan} />
        </div>
      ))}
    </div>
  );
};
