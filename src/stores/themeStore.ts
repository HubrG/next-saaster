import { create } from 'zustand';
type UseThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<UseThemeStore>((set) => ({
  theme: 'pink2', // Valeur par défaut
  setTheme: (theme: string) => set({ theme }),
}));
