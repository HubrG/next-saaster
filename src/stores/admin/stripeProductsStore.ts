import { getStripeProducts } from "@/src/helpers/db/stripeProducts.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { Plan } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasStripeProducts: iStripeProduct[];
  setSaasStripeProducts: (saasStripeProducts: iStripeProduct[]) => void;
  fetchSaasStripeProducts: () => Promise<void>;
  updateProductByPlan: (planState: Plan, data: []) => void; // Ajout de la méthode updateProductByPlan
};

export const useSaasStripeProductsStore = create<Store>()((set) => ({
  saasStripeProducts: [] as iStripeProduct[],
  setSaasStripeProducts: (saasStripeProducts) => set({ saasStripeProducts }),
  fetchSaasStripeProducts: async () => {
    const saasStripeProducts = await getStripeProducts({
      secret: chosenSecret(),
    });
    if (handleError(saasStripeProducts).error)
      throw new Error(handleError(saasStripeProducts).message);
    set({ saasStripeProducts: saasStripeProducts.data?.success });
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
