import { getAppSettings } from "@/app/[locale]/server.actions";
import { create } from "zustand";
import { appSettings } from "@prisma/client";

type UseAppSettingsStore = {
    settings: appSettings | null;
    loadSettings: () => Promise<void>;
};

export const useAppSettingsStore = create<UseAppSettingsStore>((set) => ({
    settings: null, // Valeur initiale
    loadSettings: async () => {
      try {
        const settings = await getAppSettings();
        set({ settings });
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de l'application:", error);
        // Gérer l'erreur comme nécessaire
      }
    },
}));
