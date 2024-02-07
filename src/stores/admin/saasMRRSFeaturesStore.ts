import { MRRSFeature } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasMRRSFeatures: MRRSFeature[];
  setSaasMRRSFeatures: (saasMRRSFeatures: MRRSFeature[]) => void;
};

export const useSaasMRRSFeaturesStore = create<Store>()((set) => ({
  saasMRRSFeatures: [],
  setSaasMRRSFeatures: (saasMRRSFeatures) => set({ saasMRRSFeatures }),
}));
