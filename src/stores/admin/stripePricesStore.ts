import { getStripePrices } from "@/src/helpers/db/stripePrices.action";
import { iStripePrice } from "@/src/types/db/iStripePrices";
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
    const saasStripePrices = await getStripePrices({
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    if (saasStripePrices.serverError || saasStripePrices.validationErrors)
      throw new Error(
        saasStripePrices.serverError ?? "Error while fetching stripe prices"
      );
    set({ saasStripePrices: saasStripePrices.data?.success });
  },
}));
