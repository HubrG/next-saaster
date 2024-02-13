import { appSettings } from "@prisma/client";
import { create } from "zustand";
import { getAppSettings } from "../helpers/utils/appSettings";

type Store = {
  appSettings: appSettings;
  setAppSettings: (partialSettings: Partial<appSettings>) => void;
  fetchAppSettings: () => Promise<void>;
};

export const useAppSettingsStore = create<Store>()((set) => ({
  appSettings: {} as appSettings,
  setAppSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      appSettings: { ...state.appSettings, ...partialSettings },
    })),
  fetchAppSettings: async () => {
    const appSettings = await getAppSettings();
    if (appSettings.error) throw new Error(appSettings.error);
    set({ appSettings: appSettings.data });
  },
}));
