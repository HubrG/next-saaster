import { getPlansToFeatures } from "@/src/helpers/utils/plansToFeatures";
import { create } from "zustand";
import { MRRSPlanToFeatureWithPlanAndFeature } from "../../types/MRRSPlanToFeatureWithPlanAndFeature";

type Store = {
  saasMRRSPlanToFeature: MRRSPlanToFeatureWithPlanAndFeature[];
  setSaasMRRSPlanToFeature: (
    saasMRRSPlanToFeature: MRRSPlanToFeatureWithPlanAndFeature[]
  ) => void;
  fetchSaasMRRSPlanToFeature: () => Promise<void>;
};

export const useSaasMRRSPlanToFeatureStore = create<Store>()((set) => ({
  saasMRRSPlanToFeature: [],
  setSaasMRRSPlanToFeature: (saasMRRSPlanToFeature) =>
    set({ saasMRRSPlanToFeature }),
  fetchSaasMRRSPlanToFeature: async () => {
    const saasMRRSPlanToFeature = await getPlansToFeatures();
    if (saasMRRSPlanToFeature.error)
      throw new Error(saasMRRSPlanToFeature.error);
    set({ saasMRRSPlanToFeature: saasMRRSPlanToFeature.data });
  },
}));
