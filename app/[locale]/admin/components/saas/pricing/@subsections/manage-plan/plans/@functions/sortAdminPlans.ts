import { arrayMoveImmutable } from "array-move";
import { iPlan } from "../../../../../../../../../../src/types/iPlans";

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
  const relevantItems = list.filter(
    (plan) => !plan.deleted && plan.saasType === saasType
  );
  const relevantItemsIndices = list
    .map((plan, index) =>
      !plan.deleted && plan.saasType === saasType ? index : -1
    )
    .filter((index) => index !== -1);

  if (
    oldIndex < 0 ||
    oldIndex >= relevantItems.length ||
    newIndex < 0 ||
    newIndex >= relevantItems.length
  ) {
    console.error("Indices out of bounds");
    return list;
  }

  const reorderedRelevantItems = arrayMoveImmutable(
    relevantItems,
    oldIndex,
    newIndex
  );

  const newList = [...list];
  reorderedRelevantItems.forEach((item, index) => {
    newList[relevantItemsIndices[index]] = item;
  });

  return newList;
};
