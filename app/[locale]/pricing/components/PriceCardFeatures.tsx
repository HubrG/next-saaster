"use client";
import { Loader } from "@/src/components/ui/loader";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import { CheckCircle2, X } from "lucide-react";
import { Tooltip } from "react-tooltip";
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
    <div className="flex flex-col gap-y-2">
      {features.map((feature, index) => {
        const creditAlloued =
          feature.creditAllouedByMonth && feature.creditAllouedByMonth > 0
            ? feature.creditAllouedByMonth + " "
            : undefined;
        if (feature.active === false) {
          if (saasSettings.activeFeatureComparison) {
            return !feature.feature.onlyOnSelectedPlans ? (
              <p
                key={index}
                className="flex items-center opacity-50 cursor-default"
                data-tooltip-id={feature.feature.id}>
                <X className="w-4 h-4 mr-2" />
                {creditAlloued}
                {feature.feature.name}
                {feature.feature.description && (
                  <Tooltip place="left" className="tooltip" id={feature.feature.id} opacity={100}>
                    {feature.feature.description}
                  </Tooltip>
                )}
              </p>
            ) : null;
          } else {
            null;
          }
        } else {
          return (
            <p
              key={index}
              className="flex items-center  cursor-default"
              data-tooltip-id={feature.feature.id}>
              <CheckCircle2 className="w-4 h-4 mr-2 text-theming-text-500-second" />
              {creditAlloued}
              {feature.feature.name}
              {feature.feature.description && (
                <Tooltip
                  place="left"
                  className="tooltip"
                  id={feature.feature.id}
                  opacity={100}>
                  {feature.feature.description}
                </Tooltip>
              )}
            </p>
          );
        }
      })}
      {isStoreLoading && <Loader noHFull />}
    </div>
  );
};
