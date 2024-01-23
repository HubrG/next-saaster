import { PricingFeatureCategory } from "@prisma/client";
import { create } from "zustand";

type Store = {
  pricingFeatCat: PricingFeatureCategory[];
  setPricingFeatCat: (pricingFeatCat: PricingFeatureCategory[]) => void;
};

export const useFeatureCategoryStore = create<Store>()((set) => ({
  pricingFeatCat: [],
  setPricingFeatCat: (partialSettings) =>
    set((state) => ({
      ...state,
      appSet: { ...state.pricingFeatCat, ...partialSettings },
    })),
}));
