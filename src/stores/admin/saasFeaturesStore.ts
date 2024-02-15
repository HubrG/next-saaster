import { getFeatures } from "@/src/helpers/utils/features";
import { iFeature } from "@/src/types/iFeatures";
import { create } from "zustand";

type Store = {
  saasFeatures: iFeature[];
  setSaasFeatures: (saasFeatures: iFeature[]) => void;
  fetchSaasFeatures: () => Promise<void>;
};

export const useSaasFeaturesStore = create<Store>()((set) => ({
  saasFeatures: [],
  setSaasFeatures: (saasFeatures) => set({ saasFeatures }),
  fetchSaasFeatures: async () => {
    const saasFeatures = await getFeatures();
    if (saasFeatures.error) throw new Error(saasFeatures.error);
    set({ saasFeatures: saasFeatures.data });
  },
}));
