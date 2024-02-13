import { getFeaturesCategories } from "@/src/helpers/utils/featuresCategories";
import { MRRSFeatureCategory } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  setSaasMRRSFeaturesCategories: (
    saasMRRSFeaturesCategories: MRRSFeatureCategory[]
  ) => void;
  fetchSaasMRRSFeaturesCategories: () => Promise<void>;
};

export const useSaasMRRSFeaturesCategoriesStore = create<Store>()((set) => ({
  saasMRRSFeaturesCategories: [],
  setSaasMRRSFeaturesCategories: (saasMRRSFeaturesCategories) =>
    set({ saasMRRSFeaturesCategories }),
  fetchSaasMRRSFeaturesCategories: async () => {
    const saasMRRSFeaturesCategories = await getFeaturesCategories();
    if (saasMRRSFeaturesCategories.error)
      throw new Error(saasMRRSFeaturesCategories.error);
    set({ saasMRRSFeaturesCategories: saasMRRSFeaturesCategories.data });
  },
}));
