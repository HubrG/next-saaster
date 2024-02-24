// store.ts
import { create } from "zustand";

type Store = {
  isYearly: boolean;
  togglePricingPlan: () => void;
  setIsYearly: (value: boolean) => void; // Mise à jour du type pour accepter un boolean
};

export const usePublicSaasPricingStore = create<Store>((set) => ({
  isYearly: false,
  togglePricingPlan: () =>
    set((state) => ({
      isYearly: !state.isYearly,
    })),
  setIsYearly: (value: boolean) =>
    set(() => ({
      isYearly: value,
    })),
}));
