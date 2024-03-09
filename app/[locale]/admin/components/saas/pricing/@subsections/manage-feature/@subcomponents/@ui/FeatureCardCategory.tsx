"use client";

import { dbUpdateFeature } from "@/app/[locale]/admin/queries/saas/saas-pricing/features.action";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { createFeaturesCategory } from "@/src/helpers/db/featuresCategories.action";
import { sliced } from "@/src/helpers/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import { useSaasFeaturesStore } from "@/src/stores/admin/saasFeaturesStore";
import { iFeaturesCategories } from "@/src/types/iFeaturesCategories";
import { Feature } from "@prisma/client";
import _ from "lodash";
import capitalize from "lodash/capitalize";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  feature: Feature;
};

export const FeatureCardCategory = ({ feature }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { saasFeatures, setSaasFeatures } = useSaasFeaturesStore();
  const { saasFeaturesCategories, setSaasFeaturesCategories } =
    useSaasFeaturesCategoriesStore();

  useEffect(() => {
    if (feature.categoryId) {
      setValue(
        saasFeaturesCategories.find(
          (category) => category.id === feature.categoryId
        )?.name ?? ""
      );
    }
  }, [feature, saasFeaturesCategories]);

  const handleCreateCategory = async () => {
    // We create the category in the database
    const category = await createFeaturesCategory({
      data: {
        name: searchInput,
      },
    });
    // If there is an error, we display a toaster
    if (category.serverError || category.validationErrors) {
      return toaster({
        description:
          category.serverError ||
          category.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    }
    const newCategory = category.data?.success as iFeaturesCategories;
    // We update the categoryId of the feature
    const upFeature = await dbUpdateFeature({
      data: {
        id: feature.id,
        categoryId: newCategory.id,
      },
    });
    // If there is an error, we display a toaster
    if (upFeature.serverError || upFeature.validationErrors) {
      return toaster({
        description:
          upFeature.serverError ||
          upFeature.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    }
    // We update the category in the store
    setSaasFeaturesCategories([...saasFeaturesCategories, newCategory]);
    // We update the feature store to assign the new category
    setSaasFeatures(
      saasFeatures.map((feat) =>
        feat.id === feature.id
          ? {
              ...feat,
              categoryId: newCategory.id,
            }
          : feat
      )
    );
    setValue("");
    setSearchInput("");
    setOpen(false);
    return toaster({
      type: "success",
      description: `« ${newCategory.name} » created and successfully assigned to « ${feature.name} »`,
      duration: 2000,
    });
  };

  const handleSelectCategory = async (e: string) => {
    // We update the feature in the database
    const dataToSet = await dbUpdateFeature({
      data: {
        id: feature.id,
        categoryId: e ? e : null,
      },
    });
    // If there is an error, we display a toaster
    if (dataToSet.serverError || dataToSet.validationErrors) {
      return toaster({
        description:
          dataToSet.serverError ||
          dataToSet.validationErrors?.data ||
          "An error occurred",
        type: "error",
      });
    }
    setSearchInput("");
    return toaster({
      type: "success",
      description: `« ${feature.name} » assigned successfully`,
      duration: 1000,
    });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={"sm"}
            role="combobox"
            aria-expanded={open}
            className={cn(
              {
                "font-semibold": feature.categoryId,
                "!opacity-50": !feature.categoryId,
              },
              "text-sm justify-between w-full"
            )}>
            {feature.categoryId
              ? sliced(
                  capitalize(
                    saasFeaturesCategories.find(
                      (category) => category.name === value
                    )?.name ?? ""
                  ),
                  7
                )
              : "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            defaultValue={
              feature && feature.categoryId ? feature.categoryId : ""
            }>
            <CommandInput
              id="search-input"
              onValueChange={(e) => {
                setSearchInput(e);
              }}
              placeholder="Search category..."
            />
            <CommandList>
              <CommandEmpty
                className="flex flex-col justify-center p-2 w-full items-center"
                onClick={handleCreateCategory}>
                <small>Create category</small>
                <strong>{searchInput}</strong>
              </CommandEmpty>
              <CommandGroup defaultValue={feature.categoryId ?? undefined}>
                <CommandItem
                  className="font-bold  hover:bg-primary"
                  key="no-category"
                  value=""
                  onSelect={(e) => {
                    setValue("");
                    setOpen(false);
                    handleSelectCategory(e);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  No category
                </CommandItem>
                {saasFeaturesCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name ?? ""}
                    id={category.id}
                    onSelect={(e) => {
                      setValue(category.name ?? "");
                      setOpen(false);
                      handleSelectCategory(category.id);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
                {searchInput &&
                  (() => {
                    const normalizedSearchInput = searchInput.toUpperCase();
                    const categoryExists = _.some(
                      saasFeaturesCategories,
                      (category) =>
                        _.toUpper(category.name ?? "") === normalizedSearchInput
                    );
                    if (!categoryExists) {
                      return (
                        <CommandItem
                          key={searchInput}
                          className="border-t flex flex-col justify-center p-2 w-full items-center"
                          value={searchInput}
                          id={searchInput}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCreateCategory();
                            }
                          }}
                          onSelect={(e) => {
                            setValue(searchInput);
                            setOpen(false);
                            handleCreateCategory();
                          }}>
                          <small>Create category</small>
                          <strong>{searchInput}</strong>
                        </CommandItem>
                      );
                    }
                  })()}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
