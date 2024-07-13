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
  displayOnRecurrence: "custom1" | "custom2" | "custom3" | "custom4";
  setDisplayOnRecurrence: (
    value: "custom1" | "custom2" | "custom3" | "custom4"
  ) => void;
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
  customIs1: true,
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
  displayOnRecurrence: "custom1",
  setDisplayOnRecurrence: (
    value: "custom1" | "custom2" | "custom3" | "custom4"
  ) =>
    set((state) => {
      if (state.displayOnRecurrence !== value) {
        const newState = {
          displayOnRecurrence: value,
          customIs1: value === "custom1",
          customIs2: value === "custom2",
          customIs3: value === "custom3",
          customIs4: value === "custom4",
        };
        return newState;
      }
      return { displayOnRecurrence: value };
    }),
}));
