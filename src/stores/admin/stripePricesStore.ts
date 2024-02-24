import { getStripePrices } from "@/src/helpers/db/stripePrices";
import { iStripePrice } from "@/src/types/iStripePrices";
import { create } from "zustand";

type Store = {
  saasStripePrices: iStripePrice[];
  setSaasStripePrices: (saasStripePrices: iStripePrice[]) => void;
  fetchSaasStripePrices: () => Promise<void>;
};

export const useSaasStripePricesStore = create<Store>()((set) => ({
  saasStripePrices: [] as iStripePrice[],
  setSaasStripePrices: (saasStripePrices) => set({ saasStripePrices }),
  fetchSaasStripePrices: async () => {
    const saasStripePrices = await getStripePrices();
    if (saasStripePrices.error) throw new Error(saasStripePrices.error);
    set({ saasStripePrices: saasStripePrices.data });
  },
}));
