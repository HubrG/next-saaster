import { getAppSettings } from "@/app/[locale]/server.actions";
import { appSettings } from "@prisma/client";
import { create } from "zustand";

type Store = {
  appSettings: appSettings;
  setAppSettings: (partialSettings: Partial<appSettings>) => void;
  getAppSettings: () => void;
};

export const useAppSettingsStore = create<Store>()((set) => ({
  appSettings: {
    id: "",
    name: "",
    baseline: "",
    description: "",
    theme: "",
    roundedCorner: 5,
    defaultDarkMode: false,
    activeTopLoader: false,
    activeDarkMode: false,
    activeCtaOnNavbar: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  getAppSettings: async () => {
    const res = await getAppSettings();
    set({ appSettings: res });
  },
  setAppSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      appSettings: { ...state.appSettings, ...partialSettings }, 
    })),
}));
