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
    activeYearlyPlans: false,
    activeMonthlyPlans: false,
    activeRefillCredit: false,
    activeCreditSystem: false,
    tax: 0,
    currency: "usd",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setSaasSettings: (partialSettings) =>
    set((state) => ({
      saasSettings: { ...state.saasSettings, ...partialSettings },
    })),
}));
