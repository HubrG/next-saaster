"use client";
import { updateFeaturePosition } from "@/app/[locale]/admin/queries/queries";
import { Loader } from "@/src/components/ui/loader";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { iFeature } from "@/src/types/iFeatures";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { sortAdminFeatures } from "./@functions/sortAdminFeatures";
import { FeatureCard } from "./@ui/FeatureCard";
import { FeaturesCategoriesList } from "./FeaturesCategoriesList";

export const FeaturesList = () => {
  const { saasFeatures, setSaasFeatures, isStoreLoading } =
    useSaasFeaturesStore();
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
    const featurePosition = await updateFeaturePosition(newSaasFeatures);
    if (!featurePosition) return;
    setSaasFeatures(featurePosition.data);
  };

  return (
    <ScrollArea className="whitespace-nowrap  overflow-x-auto pb-5 shadow-right">
      <SortableList
        lockAxis="y"
        onSortEnd={onSortEnd}
        className="gap-x-[4rem] gap-y-14  !max-h-[80vh] relative overflow-visible overflow-y-auto"
        draggedItemClassName="dragged">
        <table className="admin-features-table">
          <thead>
            <tr>
              <th></th>
              <th className="flex flex-row gap-x-2 items-center justify-center">
                Category <FeaturesCategoriesList />
              </th>
              <th>Active</th>
              <th>Name</th>
              <th>Description</th>
              <th>Key</th>
              <th>Link to plan</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isStoreLoading && <Loader noHFull />}
            <AnimatePresence>
              {saasFeatures
                .filter((feature) => !feature.deleted)
                .sort((a, b) => {
                  const positionA = a.position != null ? a.position : 0;
                  const positionB = b.position != null ? b.position : 0;
                  return positionA - positionB;
                })
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