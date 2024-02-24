import { getFeaturesCategories } from "@/src/helpers/db/featuresCategories";
import { FeatureCategory } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasFeaturesCategories: FeatureCategory[];
  setSaasFeaturesCategories: (
    saasFeaturesCategories: FeatureCategory[]
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
