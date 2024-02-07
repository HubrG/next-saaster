import { StripePrice } from "@prisma/client";
import { create } from "zustand";
export interface ExtendedStripePrices extends StripePrice {
  productRelation?: StripePrice;
}
type Store = {
  saasStripePrices: ExtendedStripePrices[];
  setSaasStripePrices: (saasStripePrices: ExtendedStripePrices[]) => void;
};

export const useSaasStripePricesStore = create<Store>()((set) => ({
  saasStripePrices: [],
  setSaasStripePrices: (saasStripePrices) => set({ saasStripePrices }),
}));
