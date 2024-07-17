"use client";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { PopoverDelete } from "@/src/components/ui/@fairysaas/popover-delete";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useBlogStore } from "@/src/stores/blogStore";
import { BlogCategory } from "@prisma/client";
import { random } from "lodash";
import { Check, LayoutList } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export const ManageBlogCategories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { blogCategories, setBlogCategories, addBlogCategoryToStore } =
    useBlogStore();

  const handleAddCategory = async () => {
    setLoading(true);
    const categoriesLength = blogCategories.length;
    const newCategory = {
      id: `category-${categoriesLength + 1}-${random(0, 9)}`,
      name: `Category-${categoriesLength + 1}`,
      slug: `category-${categoriesLength + 1}`,
      posts: [],
    };
    addBlogCategoryToStore(newCategory);

    setLoading(false);
    return toaster({
      type: "success",
      description: `Catégorie « ${newCategory.name} » créée avec succès`,
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className=" w-full !h-full"
            data-tooltip-id="manage-categories-tt">
            <LayoutList className="cursor-pointer icon !mr-2" /> Manage blog
            categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[50vh] overflow-auto">
          <div className="grid">
            {blogCategories.slice().map((category) => (
              <div className="mb-2 py-1" key={category.id}>
                <CategoryCard category={category} />
              </div>
            ))}

            <Button onClick={handleAddCategory}>
              {loading && <SimpleLoader />} Add a new category
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip
        opacity={1}
        id="manage-categories-tt"
        className="tooltip"
        place="top">
        Manage categories
      </Tooltip>
    </>
  );
};

type Props = {
  category: BlogCategory;
};

export const CategoryCard = ({ category }: Props) => {
  const [data, setData] = useState<string>(category.name ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    blogCategories,
    setBlogCategories,
    updateBlogCategoryFromStore,
    deleteBlogCategoryFromStore,
  } = useBlogStore();
  const initialCategoryState = { ...category };

  const handleDelete = async () => {
    setLoading(true);
    deleteBlogCategoryFromStore(category.id);
    setLoading(false);
    setBlogCategories(blogCategories.filter((cat) => cat.id !== category.id));
    return toaster({
      description: `« ${category.name} » successfully deleted.`,
      type: "success",
      duration: 8000,
    });
  };

  const handleSave = async () => {
    if (data === "") {
      return toaster({
        type: "error",
        description: `Please enter a category name`,
      });
    }
    setLoading(true);
    await updateBlogCategoryFromStore(category.id, { name: data });
    setLoading(false);
    setBlogCategories(
      blogCategories.map((cat) =>
        cat.id === category.id ? { ...cat, name: data } : cat
      )
    );
    return toaster({
      type: "success",
      description: `Category « ${initialCategoryState.name} » successfully updated`,
    });
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-2 gap-y-0 !mb-0">
        <div className="col-span-8">
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
              <Check className="" />
            )}
            <Tooltip
              className="tooltip"
              opacity={100}
              id={`${category.id}tt-save-button`}
              place="top">
              Save update
            </Tooltip>
          </Button>
        </div>
        <div className="col-span-2">
          <PopoverDelete
            what="cette catégorie"
            size="icon"
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};
