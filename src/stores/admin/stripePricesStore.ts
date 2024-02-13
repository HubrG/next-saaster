import { getStripePrices } from "@/src/helpers/utils/stripePrices";
import { StripePrice } from "@prisma/client";
import { create } from "zustand";
export interface ExtendedStripePrices extends StripePrice {
  productRelation?: StripePrice;
}
type Store = {
  saasStripePrices: ExtendedStripePrices[];
  setSaasStripePrices: (saasStripePrices: ExtendedStripePrices[]) => void;
  fetchSaasStripePrices: () => Promise<void>;
};

export const useSaasStripePricesStore = create<Store>()((set) => ({
  saasStripePrices: [] as StripePrice[],
  setSaasStripePrices: (saasStripePrices) => set({ saasStripePrices }),
  fetchSaasStripePrices: async () => {
    const saasStripePrices = await getStripePrices();
    if (saasStripePrices.error) throw new Error(saasStripePrices.error);
    set({ saasStripePrices: saasStripePrices.data });
  },
}));
