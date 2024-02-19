import { arrayMoveImmutable } from "array-move";
import { iPlan } from "../types/iPlans";

export const sortADminFeatureAndPlan = async (
  list: iPlan[],
  oldIndex: number,
  newIndex: number,
  saasType: string
): Promise<iPlan[]> => {
  // Séparer les éléments pertinents du saasType spécifié et qui ne sont pas supprimés
  const relevantItems = list.filter(
    (plan) => !plan.deleted && plan.saasType === saasType
  );
  // Conserver les indices des éléments pertinents dans la liste originale
  const relevantItemsIndices = list
    .map((plan, index) =>
      !plan.deleted && plan.saasType === saasType ? index : -1
    )
    .filter((index) => index !== -1);

  // Vérifier si les indices sont dans la plage valide
  if (
    oldIndex < 0 ||
    oldIndex >= relevantItems.length ||
    newIndex < 0 ||
    newIndex >= relevantItems.length
  ) {
    console.error("Indices out of bounds");
    return list; // Retourner la liste inchangée si hors limites
  }

  // Réordonner les éléments pertinents
  const reorderedRelevantItems = arrayMoveImmutable(
    relevantItems,
    oldIndex,
    newIndex
  );

  // Réintégrer les éléments réordonnés dans la liste originale
  const newList = [...list];
  reorderedRelevantItems.forEach((item, index) => {
    newList[relevantItemsIndices[index]] = item;
  });

  return newList;
};
