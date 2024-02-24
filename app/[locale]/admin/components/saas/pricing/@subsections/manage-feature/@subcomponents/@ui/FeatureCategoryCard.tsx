"use client";
import {
    deleteFeatureCategory,
    updateFeatureCategory,
} from "@/app/[locale]/admin/queries/queries";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SimpleLoader } from "@/src/components/ui/loader";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
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

  const handleDelete = async () => {
    const dataToSet = await deleteFeatureCategory(category.id);
    if (dataToSet) {
      setSaasFeaturesCategories(
        saasFeaturesCategories.filter((cat) => cat.id !== category.id)
      );

      return toaster({
        description: `« ${category.name} » deleted successfully.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while deleting feature « ${category.name} », please try again later`,
        type: "error",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSet = {
      name: data,
    };
    if (data === "") {
      return toaster({
        type: "error",
        description: `Please enter a name`,
      });
    }
    const updateCategory = await updateFeatureCategory(
      category.id,
      dataToSet
    );
    if (!updateCategory) {
      setLoading(false);
      return toaster({
        type: "error",
        description: `Error while updating category, please try again later`,
      });
    }
    setSaasFeaturesCategories(
      saasFeaturesCategories.map((cat) =>
        cat.id === category.id ? updateCategory : cat
      )
    );
    setLoading(false);
    return toaster({
      type: "success",
      description: `Category « ${updateCategory.name} » updated successfully`,
    });
  };

  return (
    <>
      <div className="grid grid-cols-12 place-items-center gap-2">
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
            size={"icon"}
            onClick={handleSave}
            data-tooltip-id={`${category.id}tt-save-button`}>
            {loading ? (
              <SimpleLoader className="icon" />
            ) : (
              <Check className="icon" />
            )}
            <Tooltip
              className="tooltip"
              opacity={100}
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
