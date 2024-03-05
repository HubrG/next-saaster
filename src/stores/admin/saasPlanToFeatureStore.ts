import { getPlansToFeatures } from "@/src/helpers/db/plansToFeatures.action";
import { iPlanToFeature } from "@/src/types/iPlanToFeature";
import { create } from "zustand";

type Store = {
  saasPlanToFeature: iPlanToFeature[];
  setSaasPlanToFeature: (saasPlanToFeature: iPlanToFeature[]) => void;
  fetchSaasPlanToFeature: () => Promise<void>;
};

export const useSaasPlanToFeatureStore = create<Store>()((set) => ({
  saasPlanToFeature: [],
  setSaasPlanToFeature: (saasPlanToFeature) => set({ saasPlanToFeature }),
  fetchSaasPlanToFeature: async () => {
    const saasPlanToFeature = await getPlansToFeatures();
    if (saasPlanToFeature.error) throw new Error(saasPlanToFeature.error);
    set({ saasPlanToFeature: saasPlanToFeature.data });
  },
}));
