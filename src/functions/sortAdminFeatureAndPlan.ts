import { MRRSFeature, MRRSPlan } from "@prisma/client";
import { arrayMoveImmutable } from "array-move";

export const sortADminFeatureAndPlan = async (
  list: MRRSFeature[] | MRRSPlan[],
  oldIndex: number,
  newIndex: number
) => {
  const nonDeletedItems = list.filter((plan) => !plan.deleted);
  const deletedItems = list.filter((plan) => plan.deleted);

  const reorderedNonDeletedItems = arrayMoveImmutable(
    nonDeletedItems,
    oldIndex,
    newIndex
  );

  reorderedNonDeletedItems.forEach((plan, index) => {
    plan.position = index;
  });

  const newList = [...reorderedNonDeletedItems, ...deletedItems];
  if (list === newList) return false;
  return newList as MRRSFeature[] | MRRSPlan[];
};
