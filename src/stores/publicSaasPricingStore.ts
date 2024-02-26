// store.ts
import { create } from "zustand";

type Store = {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  togglePricingPlan: () => void;
  seatQuantity: number;
  setSeatQuantity: (value: number) => void;
};

export const usePublicSaasPricingStore = create<Store>((set) => ({
  isYearly: false,
  seatQuantity: 1,
  setSeatQuantity: (value: number) =>
    set(() => ({
      seatQuantity: value < 1 ? 1 : value,
    })),
  togglePricingPlan: () =>
    set((state) => ({
      isYearly: !state.isYearly,
    })),
  setIsYearly: (value: boolean) =>
    set(() => ({
      isYearly: value,
    })),
}));
