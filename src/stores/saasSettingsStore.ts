import { SaasSettings } from "@prisma/client";
import { create } from "zustand";
import { getSaasSettings } from "../helpers/db/saasSettings.action";

type Store = {
  saasSettings: SaasSettings;
  setSaasSettings: (partialSettings: Partial<SaasSettings>) => void;
  fetchSaasSettings: () => Promise<void>;
  isStoreLoading: boolean;
};

export const useSaasSettingsStore = create<Store>()((set) => ({
  saasSettings: {} as SaasSettings,
  isStoreLoading: true,
  setSaasSettings: (partialSettings) =>
    set((state) => ({
      saasSettings: { ...state.saasSettings, ...partialSettings },
      isStoreLoading: false
    })),
  fetchSaasSettings: async () => {
    set({ isStoreLoading: true });
    const saasSettings = await getSaasSettings();
    if (!saasSettings.data) { set({isStoreLoading: false }); throw new Error(saasSettings.error);}
    set({ saasSettings: saasSettings.data, isStoreLoading: false });
  },
}));
