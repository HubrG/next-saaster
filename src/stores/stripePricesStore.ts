import { StripePrice } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasStripePrices: StripePrice[];
  setSaasStripePrices: (saasStripePrices: StripePrice[]) => void;
};

export const useSaasStripePricesStore = create<Store>()((set) => ({
  saasStripePrices: [],
  setSaasStripePrices: (saasStripePrices) => set({ saasStripePrices }),
}));
