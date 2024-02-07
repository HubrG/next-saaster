import { create } from "zustand";
import { MRRSPlanToFeatureWithPlanAndFeature } from "../../types/MRRSPlanToFeatureWithPlanAndFeature";


type Store = {
  saasMRRSPlanToFeature: MRRSPlanToFeatureWithPlanAndFeature[];
  setSaasMRRSPlanToFeature: (
    saasMRRSPlanToFeature: MRRSPlanToFeatureWithPlanAndFeature[]
  ) => void;
};

export const useSaasMRRSPlanToFeatureStore = create<Store>()((set) => ({
  saasMRRSPlanToFeature: [],
  setSaasMRRSPlanToFeature: (saasMRRSPlanToFeature) => set({ saasMRRSPlanToFeature }),
}));
