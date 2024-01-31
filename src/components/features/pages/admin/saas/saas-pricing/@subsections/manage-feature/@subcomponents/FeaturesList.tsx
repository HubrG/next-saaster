"use client";
import { updateMRRSFeaturePosition } from "@/src/components/features/pages/admin/actions.server";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSFeature } from "@prisma/client";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { FeatureCard } from "./@ui/FeatureCard";
import { FeaturesCategoriesList } from "./FeaturesCategoriesList";

export const FeaturesList = () => {
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  const { saasSettings } = useSaasSettingsStore();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    // Mettre à jour l'ID sélectionné lors du clic sur une ligne
    setSelectedRowId(id);
  };

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
    <ScrollArea className="whitespace-nowrap relative !pt-0 overflow-y-auto !rounded-none overflow-x-auto overflow-visible max-lg:shadow-right py-5">
      <SortableList
        lockAxis="y"
        onSortEnd={onSortEnd}
        className={cn(
          `gap-x-[4rem] relative gap-y-14 grid grid-cols-12 !rounded-t-none `
        )}
        draggedItemClassName="dragged">
        <div
          className={cn(
            `grid  border-t-2  grid-cols-12 bg-primary dark:bg-accent/50 col-span-12 w-full   -z-0 !rounded-t-none select-none  py-5 font-bold border-b border-dashed  `
          )}>
          <div className="grid-cols-1"></div>
          <div className="col-span-2 flex flex-row gap-x-0.5 justify-center items-center">
            Category
            <FeaturesCategoriesList />
          </div>
          <div className="col-span-2 text-left pl-4">Name</div>
          <div className="col-span-2 text-left  pl-4">Description</div>
          <div className="col-span-1 text-left  pl-4">Alias</div>
          <div className="col-span-2">Link to plan</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-1"></div>
        </div>
        {saasSettings.saasType === "MRR_SIMPLE" &&
          saasMRRSFeatures
            .slice()
            .filter((feature) => !feature.deleted)
            .map((feature) => (
              <SortableItem key={feature.id}>
                <div
                  onClick={() => handleRowClick(feature.id)}
                  className={cn(
                    {
                      "bg-primary/50 dark:bg-primary/20":
                        selectedRowId === feature.id,
                    },
                    "hover:bg-primary/50  dark:hover:bg-primary/20 grid col-span-12 grid-cols-12 py-1 -mt-14 !text-sm items-center w-full select-none "
                  )}>
                  <FeatureCard feature={feature} />
                </div>
              </SortableItem>
            ))}
      </SortableList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
