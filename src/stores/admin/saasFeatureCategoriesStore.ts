import { getFeaturesCategories } from "@/src/helpers/db/featuresCategories";
import { iFeaturesCategories } from "@/src/types/iFeaturesCategories";
import { create } from "zustand";

type Store = {
  saasFeaturesCategories: iFeaturesCategories[];
  setSaasFeaturesCategories: (
    saasFeaturesCategories: iFeaturesCategories[]
  ) => void;
  fetchSaasFeaturesCategories: () => Promise<void>;
};

export const useSaasFeaturesCategoriesStore = create<Store>()((set) => ({
  saasFeaturesCategories: [],
  setSaasFeaturesCategories: (saasFeaturesCategories) =>
    set({ saasFeaturesCategories }),
  fetchSaasFeaturesCategories: async () => {
    const saasFeaturesCategories = await getFeaturesCategories();
    if (saasFeaturesCategories.error)
      throw new Error(saasFeaturesCategories.error);
    set({ saasFeaturesCategories: saasFeaturesCategories.data });
  },
}));