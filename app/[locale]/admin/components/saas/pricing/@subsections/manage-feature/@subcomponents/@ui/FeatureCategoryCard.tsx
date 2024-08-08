"use client";
import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { PopoverDelete } from "@/src/components/ui/@blitzinit/popover-delete";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import { Input } from "@/src/components/ui/@shadcn/input";
import {
  deleteFeaturesCategory,
  updateFeaturesCategory,
} from "@/src/helpers/db/featuresCategories.action";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { FeatureCategory } from "@prisma/client";
import { Check, Grip } from "lucide-react";
import { useState } from "react";
import { SortableKnob } from "react-easy-sort";
import { Tooltip } from "react-tooltip";
type Props = {
  category: FeatureCategory;
};
export const FeatureCategoryCard = ({ category }: Props) => {
  const [data, setData] = useState<string>(category.name ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const { saasFeaturesCategories, setSaasFeaturesCategories } =
    useSaasFeaturesCategoriesStore();
  const initialFeatureState = { ...category };

  const handleDelete = async () => {
    // Delete the category from the database
    const dataToSet = await deleteFeaturesCategory({
      id: category.id,
    });
    if (
      dataToSet.serverError ||
      dataToSet.validationErrors ||
      !dataToSet.data?.success
    ) {
      return toaster({
        description:
          dataToSet.serverError ||
          dataToSet.validationErrors?.id ||
          "An error occurred",
        type: "error",
      });
    }
    // Remove the category from the store
    setSaasFeaturesCategories(
      saasFeaturesCategories.filter((cat) => cat.id !== category.id)
    );
    return toaster({
      description: `« ${category.name} » deleted successfully.`,
      type: "success",
      duration: 8000,
    });
  };

  const handleSave = async () => {
    if (data === "") {
      return toaster({
        type: "error",
        description: `Please enter a name`,
      });
    }
    setLoading(true);
    const updateCategory = await updateFeaturesCategory({
      data: {
        id: category.id,
        name: data,
      },
    });

    if (updateCategory.serverError || updateCategory.validationErrors) {
      setLoading(false);
      setSaasFeaturesCategories(
        saasFeaturesCategories.map((feat) =>
          feat.id === category.id ? { ...feat, initialFeatureState } : feat
        )
      );
      return toaster({
        description:
          updateCategory.serverError ||
          updateCategory.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    }
    if (updateCategory.data?.success) {
      setLoading(false);
      setSaasFeaturesCategories(
        saasFeaturesCategories.map((feat) =>
          feat.id === category.id ? updateCategory.data?.success ?? feat : feat
        )
      );
      return toaster({type:"success", description:`Category name « ${initialFeatureState.name} » updated successfully`})
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 items-center gap-2">
        <div className="col-span-2">
          <SortableKnob>
            <Grip
              data-tooltip-id={"tt-knob-" + category.id}
              className="dd-icon top-0 ml-2 w-5"
            />
          </SortableKnob>
        </div>
        <div className="col-span-6">
          <Input
            onChange={(e) => {
              setData(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            value={data}
          />
        </div>
        <div className="col-span-2">
          <Button
           
            onClick={handleSave}
            data-tooltip-id={`${category.id}tt-save-button`}>
            {loading ? (
              <SimpleLoader className="icon" />
            ) : (
              <Check className="icon" />
            )}
            <Tooltip
              className="tooltip"
              
              id={`${category.id}tt-save-button`}
              place="top">
              Save
            </Tooltip>
          </Button>
        </div>
        <div className="col-span-2">
          <PopoverDelete
            what="this category"
            size="icon"
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};
