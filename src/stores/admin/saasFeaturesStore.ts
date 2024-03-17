import { getFeatures } from "@/src/helpers/db/features.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { iFeature } from "@/src/types/db/iFeatures";
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
      const saasFeatures = await getFeatures({ secret: chosenSecret() });
      if (saasFeatures.data?.success) {
        set({
          saasFeatures: saasFeatures.data?.success,
          isStoreLoading: false,
        });
      }
  },
}));
