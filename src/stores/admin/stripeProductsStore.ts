import { MRRSPlan, StripeProduct } from "@prisma/client";
import { create } from "zustand";
export interface ExtendedStripeProduct extends StripeProduct {
  MRRSPlanRelation?: Partial<MRRSPlan>;
}
type Store = {
  saasStripeProducts: ExtendedStripeProduct[];
  setSaasStripeProducts: (saasStripeProducts: ExtendedStripeProduct[]) => void;
};

export const useSaasStripeProductsStore = create<Store>()((set) => ({
  saasStripeProducts: [],
  setSaasStripeProducts: (saasStripeProducts) => set({ saasStripeProducts }),
}));
