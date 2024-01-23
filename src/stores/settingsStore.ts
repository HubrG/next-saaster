import { appSettings } from "@prisma/client";
import { create } from "zustand";

type Store = {
  appSet: appSettings;
  setAppSettings: (partialSettings: Partial<appSettings>) => void;
};

export const useAppSettingsStore = create<Store>()((set) => ({
  appSet: {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setAppSettings: (partialSettings) =>
    set((state) => ({
      ...state,
      appSet: { ...state.appSet, ...partialSettings },
    })),
}));
