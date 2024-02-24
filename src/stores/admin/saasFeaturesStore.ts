import { getFeatures } from "@/src/helpers/db/features";
import { iFeature } from "@/src/types/iFeatures";
import { create } from "zustand";

type Store = {
  saasFeatures: iFeature[];
  setSaasFeatures: (saasFeatures: iFeature[]) => void;
  fetchSaasFeatures: () => Promise<void>;
  isStoreLoading: boolean;
};

export const useSaasFeaturesStore = create<Store>()((set) => ({
  saasFeatures: [],
  isStoreLoading: true,
  setSaasFeatures: (saasFeatures) =>
    set({ saasFeatures, isStoreLoading: false }),
  fetchSaasFeatures: async () => {
    const saasFeatures = await getFeatures();
    if (saasFeatures.error) {
      set({ isStoreLoading: false });
      throw new Error(saasFeatures.error);
    }
    set({ saasFeatures: saasFeatures.data, isStoreLoading: false });
  },
}));
