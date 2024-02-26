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
    const timeout = setTimeout(() => {
      set({ isStoreLoading: false });
    }, 30000); 

    try {
      const saasFeatures = await getFeatures();
      clearTimeout(timeout); 

      if (saasFeatures.error) {
        set({ isStoreLoading: false });
        throw new Error(saasFeatures.error);
      }
      set({ saasFeatures: saasFeatures.data, isStoreLoading: false });
    } catch (error) {
      clearTimeout(timeout); 
      set({ isStoreLoading: false }); 
      console.error(
        "Erreur lors de la récupération des fonctionnalités : ",
        error
      );
    }
  },
}));
