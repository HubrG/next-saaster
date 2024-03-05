import { getStripeProducts } from "@/src/helpers/db/stripeProducts.action";
import { Plan, StripeProduct } from "@prisma/client";
import { create } from "zustand";
export interface ExtendedStripeProduct extends StripeProduct {
  PlanRelation?: Partial<Plan>;
}
type Store = {
  saasStripeProducts: ExtendedStripeProduct[];
  setSaasStripeProducts: (saasStripeProducts: ExtendedStripeProduct[]) => void;
  fetchSaasStripeProducts: () => Promise<void>;
  updateProductByPlan: (planState: Plan, data: []) => void; // Ajout de la méthode updateProductByPlan
};

export const useSaasStripeProductsStore = create<Store>()((set) => ({
  saasStripeProducts: [] as ExtendedStripeProduct[],
  setSaasStripeProducts: (saasStripeProducts) => set({ saasStripeProducts }),
  fetchSaasStripeProducts: async () => {
    const saasStripeProducts = await getStripeProducts();
    if (saasStripeProducts.error) throw new Error(saasStripeProducts.error);
    set({ saasStripeProducts: saasStripeProducts.data });
  },
  updateProductByPlan: (planState, data) => {
    set((state) => ({
      saasStripeProducts: state.saasStripeProducts.map((product) =>
        product.PlanId === planState.id
          ? {
              ...product,
              data,
            }
          : product
      ),
    }));
  },
}));
