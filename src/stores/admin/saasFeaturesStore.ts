import { getFeatures } from "@/src/helpers/db/features.action";
import { iFeature } from "@/src/types/iFeatures";
import { create } from "zustand";

type Store = {
  saasFeatures: iFeature[];
  setSaasFeatures: (saasFeatures: iFeature[]) => void;
  fetchSaasFeatures: () => Promise<void>;
  isStoreLoading: boolean;
  setStoreLoading: (isStoreLoading: boolean) => void;
};

export const useSaasFeaturesStore = create<Store>()((set) => ({
  saasFeatures: [],
  isStoreLoading: true,
  setStoreLoading: (isStoreLoading) => set({ isStoreLoading }),
  setSaasFeatures: (saasFeatures) =>
    set({ saasFeatures, isStoreLoading: false }),
  fetchSaasFeatures: async () => {
    const timeout = setTimeout(() => {
      set({ isStoreLoading: false });
    }, 30000); 

      const saasFeatures = await getFeatures();
      clearTimeout(timeout); 
      if (saasFeatures.success) {
        set({ saasFeatures: saasFeatures.success, isStoreLoading: false });
      }
  },
}));
