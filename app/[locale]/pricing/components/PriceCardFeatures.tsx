"use client";
import { Loader } from "@/src/components/ui/loader";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import { CheckCircle2, X } from "lucide-react";
type PriceCardFeaturesProps = {
  plan: iPlan;
};

export const PriceCardFeatures = ({ plan }: PriceCardFeaturesProps) => {
  const { saasSettings, isStoreLoading } = useSaasSettingsStore();
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
    <div className="flex flex-col gap-y-2">
      {features.map((feature, index) => {
        if (feature.active === false) {
          if (saasSettings.activeFeatureComparison) {
            return !feature.feature.onlyOnSelectedPlans ? (
              <p key={index} className="flex items-center opacity-50">
                <X className="w-4 h-4 mr-2" />
                {feature.feature.name}
              </p>
            ) : null;
          } else {
            null;
          }
        } else {
          return (
            <p key={index} className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-theming-text-500-second" />
              {feature.feature.name}
            </p>
          );
        }
      })}
      {isStoreLoading && <Loader noHFull />}
    </div>
  );
};
