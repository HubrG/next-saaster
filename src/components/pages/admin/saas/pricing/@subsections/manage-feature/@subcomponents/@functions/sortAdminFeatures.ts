import { iFeature } from "@/src/types/iFeatures";
import { arrayMoveImmutable } from "array-move";

type SortAdminFeaturesType = {
  list: iFeature[];
  oldIndex: number;
  newIndex: number;
}
export const sortAdminFeatures = async ({
  list,
  oldIndex,
  newIndex,
}: SortAdminFeaturesType): Promise<iFeature[]> => {
  const relevantItems = list.filter((feature) => !feature.deleted);
  const relevantItemsIndices = list
    .map((feature, index) => (!feature.deleted ? index : -1))
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
