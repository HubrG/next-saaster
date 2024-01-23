import { appSettings } from "@prisma/client";
import { create } from "zustand";

type Store = {
  appSettings: appSettings;
  setAppSettings: (partialSettings: Partial<appSettings>) => void;
};

export const useAppSettingsStore = create<Store>()((set) => ({
  appSettings: {
    id: "",
    theme: "",
    name: "",
    baseline: "",
    description: "",
    roundedCorner: 0,
    defaultDarkMode: false,
    activeCtaOnNavbar: false,
    activeTopLoader: false,
    activeDarkMode: false,
    uniqueCreditType: false,
    activeRefill: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setAppSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      appSettings: { ...state.appSettings, ...partialSettings }, // Correction ici
    })),
}));
