import { MRRSFeatureCategory } from "@prisma/client";
import { arrayMoveImmutable } from "array-move";

export const sortAdminFeatureCategory = async (
  categories: MRRSFeatureCategory[],
  oldIndex: number,
  newIndex: number
) => {
 

  const reorderedItems = arrayMoveImmutable(categories, oldIndex, newIndex);

  reorderedItems.forEach((category, index) => {
    category.position = index;
  });

  const newList = [...reorderedItems];
  if (reorderedItems === newList) return false;
  return newList as MRRSFeatureCategory[];
};
