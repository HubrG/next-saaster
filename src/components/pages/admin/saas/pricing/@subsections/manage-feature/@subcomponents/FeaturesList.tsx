"use client";
import { updateFeaturePosition } from "@/src/components/pages/admin/queries/queries";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iFeature } from "@/src/types/iFeatures";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { sortAdminFeatures } from "./@functions/sortAdminFeatures";
import { FeatureCard } from "./@ui/FeatureCard";
import { FeaturesCategoriesList } from "./FeaturesCategoriesList";

export const FeaturesList = () => {
  const { saasFeatures, setSaasFeatures } = useSaasFeaturesStore();
  const { saasSettings } = useSaasSettingsStore();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    // Mettre à jour l'ID sélectionné lors du clic sur une ligne
    setSelectedRowId(id);
  };

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasFeatures = (await sortAdminFeatures({
      list: saasFeatures,
      oldIndex,
      newIndex,
    })) as iFeature[];
    setSaasFeatures(newSaasFeatures);
    await updateFeaturePosition(newSaasFeatures);
  };

  return (
    <ScrollArea className="whitespace-nowrap relative overflow-x-auto pb-5 overflow-y-auto shadow-right">
      <SortableList
        lockAxis="y"
        onSortEnd={onSortEnd}
        className="gap-x-[4rem] gap-y-14 "
        draggedItemClassName="dragged">
        <table className="admin-features-table w-full">
          <thead>
            <tr>
              <th></th>
              <th className="flex flex-row gap-x-2 items-center justify-center">
                Category <FeaturesCategoriesList />
              </th>
              <th>Name</th>
              <th>Description</th>
              <th>Key</th>
              <th>Link to plan</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {saasFeatures
                .filter((feature) => !feature.deleted)
                .map((feature) => (
                  <SortableItem key={feature.id}>
                    <motion.tr
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleRowClick(feature.id)}
                      className={cn(
                        {
                          "bg-theming-background-100/20 dark:bg-primary/10":
                            selectedRowId === feature.id,
                        },
                        "hover:bg-theming-background-100/20 dark:hover:bg-primary/10  w-full select-none"
                      )}>
                      <FeatureCard feature={feature} />
                    </motion.tr>
                  </SortableItem>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </SortableList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
