import { SaasSettings } from "@prisma/client";
import { create } from "zustand";
import { getSaasSettings } from "../helpers/utils/saasSettings";

type Store = {
  saasSettings: SaasSettings;
  setSaasSettings: (partialSettings: Partial<SaasSettings>) => void;
  fetchSaasSettings: () => Promise<void>;
};

export const useSaasSettingsStore = create<Store>()((set) => ({
  saasSettings: {} as SaasSettings,
  setSaasSettings: (partialSettings) =>
    set((state) => ({
      saasSettings: { ...state.saasSettings, ...partialSettings },
    })),
  fetchSaasSettings: async () => {
    const saasSettings = await getSaasSettings();
    if (saasSettings.error) throw new Error(saasSettings.error);
    set({ saasSettings: saasSettings.data });
  },
}));
