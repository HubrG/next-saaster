"use client";
import { Loader } from "@/src/components/ui/loader";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { iPlan } from "@/src/types/iPlans";
import { CheckCircle2, X } from "lucide-react";
import { Fragment } from "react";
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
              <Fragment key={index}>
                <p
                  className="flex items-center opacity-50  !text-sm cursor-default"
                  data-tooltip-id={feature.feature.id}
                  data-tooltip-position-strategy="fixed"
                  data-tooltip-float={true}>
                  <X className="w-4 h-4 mr-2" />
                  {creditAlloued}
                  {feature.feature.name}
                </p>
                {feature.feature.description && (
                  <Tooltip
                    place="left"
                    noArrow
                    className="tooltip"
                    id={feature.feature.id}
                    opacity={100}>
                    {feature.feature.description}
                  </Tooltip>
                )}
              </Fragment>
            ) : null;
          } else {
            null;
          }
        } else {
          return (
            <Fragment key={index}>
              <p
                className="flex items-center  !text-sm cursor-default"
                data-tooltip-float={true}
                data-tooltip-position-strategy="fixed"
                data-tooltip-id={feature.feature.id}>
                <CheckCircle2 className="w-4 h-4 mr-2 text-theming-text-500-second" />
                {creditAlloued}
                {feature.feature.name}
              </p>
              {feature.feature.description && (
                <Tooltip
                  // data-tooltip-position-strategy="fixed"
                  data-tooltip-float={true}
                  place="left"
                  noArrow
                  className="tooltip"
                  id={feature.feature.id}
                  opacity={100}>
                  {feature.feature.description}
                </Tooltip>
              )}
            </Fragment>
          );
        }
      })}
      {isStoreLoading && <Loader noHFull />}
    </div>
  );
};
