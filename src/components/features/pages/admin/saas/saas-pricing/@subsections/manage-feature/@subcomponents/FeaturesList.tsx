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
    <ScrollArea className="whitespace-nowrap relative overflow-x-auto -mt-5 overflow-y-auto py-5 max-lg:shadow-right">
      <SortableList
        lockAxis="y"
        onSortEnd={onSortEnd}
        className="gap-x-[4rem] gap-y-14 grid grid-cols-12"
        draggedItemClassName="dragged">
        <table className="w-full">
          <thead>
            <th className="hidden"></th>
            <th>Category</th>
            <th>Name</th>
            <th>Description</th>
            <th>Alias</th>
            <th>Link to plan</th>
            <th>ID</th>
            <th className="hidden"></th>
          </thead>
          <tbody>
            {saasSettings.saasType === "MRR_SIMPLE" &&
              saasMRRSFeatures
                .filter((feature) => !feature.deleted)
                .map((feature) => (
                  <tr
                    key={feature.id}
                    onClick={() => handleRowClick(feature.id)}
                    className={cn(
                      {
                        "bg-primary/20": selectedRowId === feature.id,
                      },
                      "hover:bg-primary/10 dark:hover:bg-primary/10 grid col-span-12 grid-cols-12 py-1 -mt-10 text-sm items-center w-full select-none"
                    )}>
                    <SortableItem>
                      <FeatureCard feature={feature} />
                    </SortableItem>
                  </tr>
                ))}
          </tbody>
        </table>
      </SortableList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
