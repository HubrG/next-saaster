"use client";
import {
  createNewCategory,
  updateFeatureCategoryPosition,
} from "@/app/[locale]/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { SimpleLoader } from "@/src/components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sortAdminFeatureCategory } from "@/src/helpers/functions/sortAdminFeatureCategory";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { iFeaturesCategories } from "@/src/types/iFeaturesCategories";
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
    const newSaasFeaturesCategories = (await sortAdminFeatureCategory(
      saasFeaturesCategories,
      oldIndex,
      newIndex
    )) as iFeaturesCategories[];
    setSaasFeaturesCategories(newSaasFeaturesCategories);
    await updateFeatureCategoryPosition(
      newSaasFeaturesCategories as iFeaturesCategories[]
    );
  };

  const handleAddCategory = async () => {
    setLoading(true);
    const createCategory = await createNewCategory(
      "New category-" + random(1, 9999)
    ) as iFeaturesCategories;
    if (!createCategory) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Error while creating category, please try again later`,
      });
    }
    setSaasFeaturesCategories([
      ...saasFeaturesCategories,
      createCategory,
    ]);
    setLoading(false);
    return toaster({
      type: "success",
      description: `Category « ${createCategory.name} » created successfully`,
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
