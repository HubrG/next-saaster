import { MRRSFeatureCategory } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasMRRSFeaturesCategories: MRRSFeatureCategory[];
  setSaasMRRSFeaturesCategories: (
    saasMRRSFeaturesCategories: MRRSFeatureCategory[]
  ) => void;
};

export const useSaasMRRSFeaturesCategoriesStore = create<Store>()((set) => ({
  saasMRRSFeaturesCategories: [],
  setSaasMRRSFeaturesCategories: (saasMRRSFeaturesCategories) =>
    set({ saasMRRSFeaturesCategories }),
}));
