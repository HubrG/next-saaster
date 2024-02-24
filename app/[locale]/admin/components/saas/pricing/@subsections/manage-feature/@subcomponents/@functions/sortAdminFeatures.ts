import { iFeature } from "@/src/types/iFeatures";
import { arrayMoveImmutable } from "array-move";

type SortAdminFeaturesType = {
  list: iFeature[];
  oldIndex: number;
  newIndex: number;
};
export const sortAdminFeatures = async ({
  list,
  oldIndex,
  newIndex,
}: SortAdminFeaturesType): Promise<iFeature[]> => {
  let filteredList = list.filter((feature) => !feature.deleted);

  // Reorder the filtered items
  filteredList = arrayMoveImmutable(filteredList, oldIndex, newIndex);

  // Update the 'position' property for each reordered item
  filteredList.forEach((feature, index) => {
    feature.position = index; 
  });

  // Optional: If you want to reintegrate the reordered items into the original list
  // and update the positions in the original list, you need to adjust the positions
  // in the complete list. This depends on the specific logic of your application.
  // For example, you might want to iterate over `list` and update `position`
  // for the non-deleted items using the new positions defined in `filteredList`.

  return list.map((item) => {
    if (!item.deleted) {
      const updatedItem = filteredList.find(
        (feature) => feature.id === item.id
      );
      if (updatedItem) {
        return { ...item, position: updatedItem.position &&  updatedItem.position};
      }
    }
    return item; 
  });
};
