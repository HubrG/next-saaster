"use client";
import { updateMRRSFeaturePosition } from "@/src/components/features/pages/admin/actions.server";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { sortByPosition } from "@/src/functions/sortPlans";
import { useSaasMRRSFeatures } from "@/src/stores/saasMRRSFeature";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSFeature } from "@prisma/client";
import SortableList, { SortableItem } from "react-easy-sort";
import { FeatureCard } from "./@ui/Feature";
export const FeaturesList = () => {
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeatures();
  const { saasSettings } = useSaasSettingsStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasMRRSFeatures = (await sortADminFeatureAndPlan(
      saasMRRSFeatures,
      oldIndex,
      newIndex
    )) as MRRSFeature[];

    setSaasMRRSFeatures(newSaasMRRSFeatures);

    const update = await updateMRRSFeaturePosition(newSaasMRRSFeatures);
    
  };
  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="w-full gap-x-20 gap-y-14 grid grid-cols-1"
      draggedItemClassName="dragged">
      {saasSettings.saasType === "MRR_SIMPLE" &&
        saasMRRSFeatures
          .slice()
          .filter((feature) => !feature.deleted)
          .map((feature, index) => (
            <SortableItem key={feature.id}>
              <div className="grid col-span-12 grid-cols-12 w-full select-none">
                <FeatureCard feature={feature} />
              </div>
            </SortableItem>
          ))}
    </SortableList>
  );
};
