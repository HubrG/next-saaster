import { appSettings } from "@prisma/client";
import { create } from "zustand";
import { getAppSettings } from "../helpers/db/appSettings.action";

type Store = {
  appSettings: appSettings;
  setAppSettings: (partialSettings: Partial<appSettings>) => void;
  fetchAppSettings: () => Promise<void>;
  isStoreLoading: boolean;
};

export const useAppSettingsStore = create<Store>()((set) => ({
  appSettings: {} as appSettings,
  isStoreLoading: true,
  setAppSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      appSettings: { ...state.appSettings, ...partialSettings },
      isStoreLoading: false,
    })),
  fetchAppSettings: async () => {
    set({ isStoreLoading: true });
    try {
      const appSettings = await getAppSettings();
      if (!appSettings.data) throw new Error(appSettings.error);
      set({ appSettings: appSettings.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isStoreLoading: false });
    }
  },
}));
