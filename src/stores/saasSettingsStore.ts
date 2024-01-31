import { SaasSettings } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasSettings: SaasSettings;
  setSaasSettings: (partialSettings: Partial<SaasSettings>) => void;
};

export const useSaasSettingsStore = create<Store>()((set) => ({
  saasSettings: {} as SaasSettings,
  setSaasSettings: (partialSettings) =>
    set((state) => ({
      saasSettings: { ...state.saasSettings, ...partialSettings },
    })),
}));
