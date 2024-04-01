"use client";
import { dbGetFeatures } from "@/app/[locale]/admin/queries/saas/saas-pricing/features.action";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { updateFeature } from "@/src/helpers/db/features.action";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { Feature } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { sortAdminFeatures } from "./@functions/sortAdminFeatures";
import { FeatureCard } from "./@ui/FeatureCard";
import { FeaturesCategoriesList } from "./FeaturesCategoriesList";

export const FeaturesList = () => {
  const router = useRouter();

  const {
    saasFeatures,
    setSaasFeatures,
    fetchSaasFeatures,
    isStoreLoading,
    setStoreLoading,
  } = useSaasFeaturesStore();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // // Fetch the features from the store when the component is mounted
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSaasFeatures();
      setStoreLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [
    isStoreLoading,
    fetchSaasFeatures,
    router,
    saasFeatures,
    setStoreLoading,
  ]);

  // this function is used to handle the click on a row
  const handleRowClick = (id: string) => {
    setSelectedRowId(id);
  };

  // This function is used to update the position of the features
  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    // Sort the features and update the position of each feature
    const newSaasFeatures = (await sortAdminFeatures({
      list: saasFeatures,
      oldIndex,
      newIndex,
    })) as unknown as Feature[];
    // Update the position of each feature in the store first for a better UX
    setSaasFeatures(
      newSaasFeatures.sort(
        (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
      )
    );
    // Then update the position of each feature in the database
    const updatePromises = newSaasFeatures.map((feature: any) =>
      updateFeature({
        data: {
          id: feature.id,
          position: feature.position ?? 9999,
        },
      })
    );
    const results = await Promise.all(updatePromises);
    if (
      results.some((result) => result.serverError || result.validationErrors)
    ) {
      // if there is an error, we fetch the features again to get the correct old positions
      const updatedFeaturesResult = await dbGetFeatures();
      if (updatedFeaturesResult.data?.success) {
        setSaasFeatures(updatedFeaturesResult.data?.success);
      }
      const error = results.find(
        (result) => result.serverError || result.validationErrors
      );
      return toaster({
        description:
          (error?.validationErrors?.data &&
            "Type error : " + error?.validationErrors?.data) ||
          error?.serverError ||
          "Error while updating features positions",
        type: "error",
      });
    }
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
              <th>
                <span className="flex flex-row items-center justify-center">
                  Category <FeaturesCategoriesList />
                </span>
              </th>
              <th>Active</th>
              <th>Name</th>
              <th>Description</th>
              <th>Alias</th>
              <th>Link to plan</th>
              <th className="!text-center">ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isStoreLoading && (
              <tr>
                <td colSpan={9}>
                  <Loader noHFull />
                </td>
              </tr>
            )}
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
