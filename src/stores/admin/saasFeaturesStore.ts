import { getFeatures } from "@/src/helpers/utils/features";
import { Feature } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasFeatures: Feature[];
  setSaasFeatures: (saasFeatures: Feature[]) => void;
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
