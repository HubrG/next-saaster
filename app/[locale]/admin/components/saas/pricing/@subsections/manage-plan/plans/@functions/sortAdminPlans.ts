import { arrayMoveImmutable } from "array-move";
import { iPlan } from "../../../../../../../../../../src/types/db/iPlans";

type SortAdminPlanProps = {
  list: iPlan[];
  oldIndex: number;
  newIndex: number;
  saasType: string;
};
export const sortAdminPlans = async ({
  list,
  oldIndex,
  newIndex,
  saasType,
}: SortAdminPlanProps): Promise<iPlan[]> => {
  let filteredList = list.filter(
    (plan) => !plan.deleted && plan.saasType === saasType
  );
  // Reorder the filtered items
  filteredList = arrayMoveImmutable(filteredList, oldIndex, newIndex);

  // Update the 'position' property for each reordered item
  filteredList.forEach((plan, index) => {
    plan.position = index;
  });

  // Optional: If you want to reintegrate the reordered items into the original list
  // and update the positions in the original list, you need to adjust the positions
  // in the complete list. This depends on the specific logic of your application.
  // For example, you might want to iterate over `list` and update `position`
  // for the non-deleted items using the new positions defined in `filteredList`.

  return list.map((item) => {
    if (!item.deleted) {
      const updatedItem = filteredList.find((plan) => plan.id === item.id);
      if (updatedItem) {
        return {
          ...item,
          position: updatedItem.position && updatedItem.position,
        };
      }
    }
    return item;
  });
};
