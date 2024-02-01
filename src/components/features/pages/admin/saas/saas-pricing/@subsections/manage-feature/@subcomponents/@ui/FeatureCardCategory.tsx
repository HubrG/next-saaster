import {
  createNewCategoryFromFeature,
  updateMRRSFeature,
} from "@/src/components/features/pages/admin/actions.server";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { capitalizeFirstLetter } from "@/src/functions/capitalizeFirstLetter";
import { sliced } from "@/src/functions/slice";
import { cn } from "@/src/lib/utils";
import { useSaasMRRSFeaturesCategoriesStore } from "@/src/stores/saasMRRSFeatureCategoriesStore";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { MRRSFeature } from "@prisma/client";
import _ from "lodash";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  feature: MRRSFeature;
};

export const FeatureCardCategory = ({ feature }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { saasMRRSFeatures, setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  const { saasMRRSFeaturesCategories, setSaasMRRSFeaturesCategories } =
    useSaasMRRSFeaturesCategoriesStore();

  useEffect(() => {
    if (feature.categoryId) {
      setValue(
        saasMRRSFeaturesCategories.find(
          (category) => category.id === feature.categoryId
        )?.name ?? ""
      );
    }
  }, [feature.categoryId, saasMRRSFeaturesCategories]);

  const handleCreateCategory = async () => {
    const dataToSet = {
      name: searchInput,
      featureId: feature.id,
    };
    if (searchInput === "") {
      return toaster({
        type: "error",
        description: `Please enter a name`,
      });
    }
    const createCategory = await createNewCategoryFromFeature(dataToSet);
    if (!createCategory) {
      return toaster({
        type: "error",
        description: `Error while creating category « ${searchInput} », please try again later`,
      });
    }
    toaster({
      type: "success",
      description: `Category « ${searchInput} » created successfully and linked to feature « ${feature.name} »`,
    });
    setSaasMRRSFeaturesCategories([
      ...saasMRRSFeaturesCategories,
      createCategory,
    ]);
    if (createCategory.id) {
      setSaasMRRSFeatures(
        saasMRRSFeatures.map((f) =>
          f.id === feature.id ? { ...f, categoryId: createCategory.id } : f
        )
      );
      setValue("");
      setSearchInput("");
      setOpen(false);
    }
  };

  const handleSelectCategory = async (e: string) => {
    const dataToSet = {
      categoryId: e ? e : null,
    };
    const updateFeature = await updateMRRSFeature(feature.id, dataToSet);
    setSearchInput("");

    if (!updateFeature) {
      return toaster({
        type: "error",
        description: `Error while updating feature « ${feature.name} », please try again later`,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          className={cn({ "font-semibold": value, "!opacity-50" : !value }, "text-sm justify-between w-full")}>
          {value
            ? sliced(
                capitalizeFirstLetter(
                  saasMRRSFeaturesCategories.find(
                    (category) => category.name === value
                  )?.name??""
                ),
                7
              )
            : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command defaultValue={feature.categoryId ?? ""}>
          <CommandInput
            id="search-input"
            onValueChange={(e) => {
              setSearchInput(e);
            }}
            placeholder="Search category..."
          />
          <CommandEmpty
            className="flex flex-col justify-center p-2 w-full items-center"
            onClick={handleCreateCategory}>
            <small>Create category</small>
            <strong>{searchInput}</strong>
          </CommandEmpty>
          <CommandGroup defaultValue={feature.categoryId ?? ""}>
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
            {saasMRRSFeaturesCategories.map((category) => (
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
                  saasMRRSFeaturesCategories,
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
        </Command>
      </PopoverContent>
    </Popover>
  );
};
