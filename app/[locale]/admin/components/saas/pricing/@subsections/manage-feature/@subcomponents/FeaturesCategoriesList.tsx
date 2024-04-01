"use client";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  createFeaturesCategory,
  getFeaturesCategories,
  updateFeaturesCategory,
} from "@/src/helpers/db/featuresCategories.action";
import { sortAdminFeatureCategory } from "@/src/helpers/functions/sortAdminFeatureCategory";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { iFeaturesCategories } from "@/src/types/db/iFeaturesCategories";
import { random } from "lodash";
import { Edit } from "lucide-react";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { Tooltip } from "react-tooltip";
import { FeatureCategoryCard } from "./@ui/FeatureCategoryCard";

export const FeaturesCategoriesList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { saasFeaturesCategories, setSaasFeaturesCategories } =
    useSaasFeaturesCategoriesStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    // Sort the featuresCategories and update the position of each feature
    const newSaasFeaturesCategories = (await sortAdminFeatureCategory(
      saasFeaturesCategories,
      oldIndex,
      newIndex
    )) as unknown as iFeaturesCategories[];
    // Update the position of each featuresCategories in the store first for a better UX
    setSaasFeaturesCategories(
      newSaasFeaturesCategories.sort(
        (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
      )
    );
    // Then update the position of each featuresCategories in the database
    const updatePromises = newSaasFeaturesCategories.map((feature) =>
      updateFeaturesCategory({
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
      const updatedFeaturesResult = await getFeaturesCategories();
      if (updatedFeaturesResult.success) {
        setSaasFeaturesCategories(updatedFeaturesResult.success);
      }
      return toaster({
        description: handleError(updatedFeaturesResult).message,
        type: "error",
      });
    }
  };

  const handleAddCategory = async () => {
    setLoading(true);
    const categoriesLength = saasFeaturesCategories.length;
    const createCategory = await createFeaturesCategory({
      data: {
        name: "Category-" + categoriesLength + 1 + `${random(0, 9)}`,
      },
    });
    // If there is an error, we display a toaster
     
    if (handleError(createCategory).error) {
      setLoading(false);
      return toaster({
        description: handleError(createCategory).message,
        type: "error",
      });
    }
    const newCategory = createCategory.data?.success as iFeaturesCategories;
    setSaasFeaturesCategories([...saasFeaturesCategories, newCategory]);
    setLoading(false);
    return toaster({
      type: "success",
      description: `Category « ${newCategory.name} » created successfully`,
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="!my-0 !py-0" data-tooltip-id="manage-category-tt">
            <Edit className="icon cursor-pointer" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[50vh] overflow-auto">
          <div className="grid gap-4">
            <SortableList
              lockAxis="y"
              onSortEnd={onSortEnd}
              className={cn(`w-full`)}
              draggedItemClassName="dragged">
              {saasFeaturesCategories.slice().map((category) => (
                <SortableItem key={"cat" + category.id}>
                  <div className="mb-2 py-1">
                    <FeatureCategoryCard category={category} />
                  </div>
                </SortableItem>
              ))}
            </SortableList>
            <Button onClick={handleAddCategory}>
              {loading && <SimpleLoader />} Add a new category
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip
        opacity={1}
        id="manage-category-tt"
        className="tooltip"
        place="top">
        Manage categories
      </Tooltip>
    </>
  );
};
