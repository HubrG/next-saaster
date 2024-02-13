import { getFeatures } from "@/src/helpers/utils/features";
import { MRRSFeature } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasMRRSFeatures: MRRSFeature[];
  setSaasMRRSFeatures: (saasMRRSFeatures: MRRSFeature[]) => void;
  fetchSaasMRRSFeatures: () => Promise<void>;
};

export const useSaasMRRSFeaturesStore = create<Store>()((set) => ({
  saasMRRSFeatures: [],
  setSaasMRRSFeatures: (saasMRRSFeatures) => set({ saasMRRSFeatures }),
  fetchSaasMRRSFeatures: async () => {
    const saasMRRSFeatures = await getFeatures();
    if (saasMRRSFeatures.error) throw new Error(saasMRRSFeatures.error);
    set({ saasMRRSFeatures: saasMRRSFeatures.data });
  },
}));
