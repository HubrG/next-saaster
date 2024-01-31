"use client";
import { updateMRRSFeaturePosition } from "@/src/components/features/pages/admin/actions.server";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
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
    await updateMRRSFeaturePosition(newSaasMRRSFeatures);
  };

  return (
    <ScrollArea className="whitespace-nowrap rounded-md overflow-x-auto overflow-visible shadow-right py-5">
      <SortableList
        onSortEnd={onSortEnd}
        className="gap-x-[4rem] relative gap-y-14 grid grid-cols-12 w-[100vh]"
        draggedItemClassName="dragged">
        <div className="grid col-span-12 grid-cols-12 w-full select-none  pb-5 font-bold border-b border-dashed ">
          <div className="grid-cols-1"></div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-left pl-4">Name</div>
          <div className="col-span-2 text-left  pl-4">Description</div>
          <div className="col-span-1 text-left  pl-4">Alias</div>
          <div className="col-span-2">Link to...</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-1"></div>
        </div>
        {saasSettings.saasType === "MRR_SIMPLE" &&
          saasMRRSFeatures
            .slice()
            .filter((feature) => !feature.deleted)
            .map((feature) => (
              <SortableItem key={feature.id}>
                <div className="hover:bg-primary/50 grid col-span-12 grid-cols-12 py-1 -mt-10 !text-sm items-center w-full select-none ">
                  <FeatureCard feature={feature} />
                </div>
              </SortableItem>
            ))}
      </SortableList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
