"use client";
import { updateMRRSFeaturePosition } from "@/src/components/features/pages/admin/actions.server";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSFeature } from "@prisma/client";
import SortableList, { SortableItem } from "react-easy-sort";
import { FeatureCard } from "./@ui/FeatureCard";
export const FeaturesList = () => {
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
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
  console.log("saasMRRSFeatures", saasMRRSFeatures);
  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="w-full gap-x-20 gap-y-14 grid grid-cols-1 overflow-x-auto max-w-full"
      draggedItemClassName="dragged">
      <div className="grid col-span-12 grid-cols-12 w-full select-none border-b pb-2 font-bold ">
        <div className="grid-cols-1"></div>
        <div className="col-span-2">Name</div>
        <div className="col-span-2">Description</div>
        <div className="col-span-1">ID</div>
        <div className="col-span-1">Alias</div>
        <div className="col-span-1">Active</div>
        <div className="col-span-2">Link to...</div>
        <div className="col-span-1"></div>
      </div>
      {saasSettings.saasType === "MRR_SIMPLE" &&
        saasMRRSFeatures
          .slice()
          .filter((feature) => !feature.deleted)
          .map((feature, index) => (
            <SortableItem key={feature.id}>
              <div className="grid col-span-12 grid-cols-12 -mt-10 items-center w-full select-none ">
                <FeatureCard feature={feature} />
              </div>
            </SortableItem>
          ))}
    </SortableList>
  );
};
