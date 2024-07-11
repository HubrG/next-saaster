// store.ts
import { create } from "zustand";

type Store = {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  togglePricingPlan: () => void;
  seatQuantity: number;
  setSeatQuantity: (value: number) => void;
  customIs1: boolean;
  setCustomIs1: (value: boolean) => void;
  customIs2: boolean;
  setCustomIs2: (value: boolean) => void;
  customIs3: boolean;
  setCustomIs3: (value: boolean) => void;
  customIs4: boolean;
  setCustomIs4: (value: boolean) => void;
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
  customIs1: false,
  setCustomIs1: (value: boolean) =>
    set(() => ({
      customIs1: value,
    })),
  customIs2: false,
  setCustomIs2: (value: boolean) =>
    set(() => ({
      customIs2: value,
    })),
  customIs3: false,
  setCustomIs3: (value: boolean) =>
    set(() => ({
      customIs3: value,
    })),
  customIs4: false,
  setCustomIs4: (value: boolean) =>
    set(() => ({
      customIs4: value,
    })),
}));
