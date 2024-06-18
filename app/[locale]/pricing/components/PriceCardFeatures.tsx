"use client";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { iPlan } from "@/src/types/db/iPlans";
import { CheckCircle2, X } from "lucide-react";
import { Fragment } from "react";
import { PriceCardFeatureNameAndDesc } from "./PriceCardFeatureNameAndDesc";
type PriceCardFeaturesProps = {
  plan: Partial<iPlan>;
};

export const PriceCardFeatures = ({ plan }: PriceCardFeaturesProps) => {
  const { saasSettings, isStoreLoading } = useSaasSettingsStore();
  if (plan.isCustom) return;
  let features = plan.Features as iPlanToFeature[];
  if (features.length === 0) {
    return;
  }

  // Sort the features by position
  features = features.sort((a, b) => {
    const posA = a.feature.position != null ? a.feature.position : Infinity;
    const posB = b.feature.position != null ? b.feature.position : Infinity;
    return posA - posB;
  });

  // If the feature name is empty or deleted or inactive, we don't want to display it
  features = features.filter(
    (feature) =>
      feature.feature.name !== "" &&
      !feature.feature.deleted &&
      feature.feature.active
  );

  // reutrn the features
  return (
    <div className="flex flex-col gap-y-2 !bg-transparent">
      {features.map((feature, index) => {
        const creditAlloued =
          feature.creditAllouedByMonth && feature.creditAllouedByMonth > 0
            ? feature.creditAllouedByMonth + " "
            : undefined;
        if (feature.active === false) {
          if (saasSettings.activeFeatureComparison) {
            return !feature.feature.onlyOnSelectedPlans ? (
              <Fragment key={index}>
                <PriceCardFeatureNameAndDesc
                  icon={
                    <X className="w-4 h-4 mr-2 text-theming-text-500-second" />
                  }
                  featName={feature.feature.name}
                  enabledFeature={false}
                  featDesc={feature.feature.description}
                  id={feature.feature.id}
                  creditAlloued={creditAlloued}
                />
              </Fragment>
            ) : null;
          } else {
            null;
          }
        } else {
          return (
            <Fragment key={index}>
              <PriceCardFeatureNameAndDesc
                icon={<CheckCircle2 className="w-4 h-4 mr-2 text-theming-text-500-second" />}
                featName={feature.feature.name}
                enabledFeature={true}
                featDesc={feature.feature.description}
                id={feature.feature.id}
                creditAlloued={creditAlloued}
              />
            </Fragment>
          );
        }
      })}
      {isStoreLoading && <Loader noHFull />}
    </div>
  );
};
