// store.ts
import { create } from "zustand";

type Store = {
  isYearly: boolean;
  togglePricingPlan: () => void;
};

export const usePublicSaasPricingStore = create<Store>((set) => ({
  isYearly: false, 
  togglePricingPlan: () =>
    set((state) => ({
      isYearly: !state.isYearly,
    })),
}));
