import { SaasSettings, SaasTypes } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasSettings: SaasSettings;
  setSaasSettings: (partialSettings: Partial<SaasSettings>) => void;
};

export const useSaasSettingsStore = create<Store>()((set) => ({
  saasSettings: {
    id: "",
    saasType: SaasTypes.MRR_SIMPLE,
    activeYearlyPlans: null,
    activeMonthlyPlans: null,
    tax: null,
    createdAt: null,
    updatedAt: null,
  },
  setSaasSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      saasSettings: { ...state.saasSettings, ...partialSettings }, // Correction ici
    })),
}));
