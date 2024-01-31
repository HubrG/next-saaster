import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { sortAdminFeatureCategory } from "@/src/functions/sortAdminFeatureCategory";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/saasMRRSFeatureCategoriesStore";
import { MRRSFeature } from "@prisma/client";
import { random } from "lodash";
import { Edit } from "lucide-react";
import SortableList, { SortableItem } from "react-easy-sort";
import { Tooltip } from "react-tooltip";
import {
  createNewCategory,
  updateMRRSFeatureCategoryPosition,
} from "../../../../../actions.server";
import { FeatureCategoryCard } from "./@ui/FeatureCategoryCard";
export const FeaturesCategoriesList = () => {
  const { saasMRRSFeaturesCategories, setSaasMRRSFeaturesCategories } =
    useSaasMRRSFeaturesCategoriesStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasMRRSFeaturesCategories = (await sortAdminFeatureCategory(
      saasMRRSFeaturesCategories,
      oldIndex,
      newIndex
    )) as MRRSFeature[];
    setSaasMRRSFeaturesCategories(newSaasMRRSFeaturesCategories);
    await updateMRRSFeatureCategoryPosition(newSaasMRRSFeaturesCategories);
  };

  const handleAddCategory = async () => {
    const createCategory = await createNewCategory(
      "New category-" + random(1, 9999)
    );
    if (!createCategory) {
      return toaster({
        type: "error",
        description: `Error while creating category, please try again later`,
      });
    }
    setSaasMRRSFeaturesCategories([
      ...saasMRRSFeaturesCategories,
      createCategory,
    ]);
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
            <Tooltip
              className="tooltip"
              opacity={100}
              id="manage-category-tt"
              place="top">
              Manage categories
            </Tooltip>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[50vh] overflow-auto">
          <div className="grid gap-4">
            <SortableList
              lockAxis="y"
              onSortEnd={onSortEnd}
              className={cn(`w-full`)}
              draggedItemClassName="dragged">
              {saasMRRSFeaturesCategories.slice().map((category) => (
                <SortableItem key={"cat" + category.id}>
                  <div className="mb-2 py-1">
                    <FeatureCategoryCard category={category} />
                  </div>
                </SortableItem>
              ))}
            </SortableList>
            <Button onClick={handleAddCategory}>Add a new category</Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
