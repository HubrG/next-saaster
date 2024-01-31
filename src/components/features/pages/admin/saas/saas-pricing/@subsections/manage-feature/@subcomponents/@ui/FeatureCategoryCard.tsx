import { deleteMRRSFeatureCategory, updateMRRSFeatureCategory } from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/saasMRRSFeatureCategoriesStore";
import { MRRSFeatureCategory } from "@prisma/client";
import { Grip, Save } from "lucide-react";
import { useState } from "react";
import { SortableKnob } from "react-easy-sort";
type Props = {
  category: MRRSFeatureCategory;
};
export const FeatureCategoryCard = ({ category }: Props) => {
  const [data, setData] = useState<string>(category.name ?? "");
  const { saasMRRSFeaturesCategories, setSaasMRRSFeaturesCategories } =
    useSaasMRRSFeaturesCategoriesStore();

  const handleDelete = async () => {
    const dataToSet = await deleteMRRSFeatureCategory(category.id);
    if (dataToSet) {
      setSaasMRRSFeaturesCategories(
        saasMRRSFeaturesCategories.filter((cat) => cat.id !== category.id)
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
    const dataToSet = {
      name: data,
    };
    if (data === "") {
      return toaster({
        type: "error",
        description: `Please enter a name`,
      });
    }
    const updateCategory = await updateMRRSFeatureCategory(
      category.id,
      dataToSet
    );
    if (!updateCategory) {
      return toaster({
        type: "error",
        description: `Error while updating category, please try again later`,
      });
    }
    setSaasMRRSFeaturesCategories(
      saasMRRSFeaturesCategories.map((cat) =>
        cat.id === category.id ? updateCategory : cat
      )
    );
    return toaster({
      type: "success",
      description: `Category « ${updateCategory.name} » updated successfully`,
    });
  }

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
          <Button size={"icon"} onClick={handleSave}>
            <Save className="icon" />
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
