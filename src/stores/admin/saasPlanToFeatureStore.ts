import { getPlansToFeatures } from "@/src/helpers/utils/plansToFeatures";
import { create } from "zustand";
import { PlanToFeatureWithPlanAndFeature } from "../../types/PlanToFeatureWithPlanAndFeature";

type Store = {
  saasPlanToFeature: PlanToFeatureWithPlanAndFeature[];
  setSaasPlanToFeature: (
    saasPlanToFeature: PlanToFeatureWithPlanAndFeature[]
  ) => void;
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
