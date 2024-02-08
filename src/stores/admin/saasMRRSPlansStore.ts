import { MRRSPlan, StripeCoupon, StripePlanCoupon, StripePrice, StripeProduct } from "@prisma/client";
import { create } from "zustand";
type CouponDetail = {
  coupon: StripeCoupon; // Assurez-vous que cette définition correspond à vos données
  // Vous pouvez ajouter ici d'autres propriétés présentes dans StripePlanCoupon si nécessaire
};
interface StripeProductf {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created: number;
  prices: StripePrice[]; // Chaque produit a un tableau de prix
}
export interface MRRSPlanStore extends MRRSPlan {
  coupons?: StripePlanCoupon[];
  coupon?: CouponDetail;
  StripeProduct?: StripeProductf[];
  id: string;
}

type Store = {
  saasMRRSPlans: MRRSPlanStore[];
  setSaasMRRSPlans: (
    updater:
      | ((currentPlans: MRRSPlanStore[]) => MRRSPlanStore[])
      | MRRSPlanStore[]
  ) => void;
};

export const useSaasMRRSPlansStore = create<Store>()((set) => ({
  saasMRRSPlans: {} as MRRSPlanStore[],
  setSaasMRRSPlans: (updater) => {
    if (typeof updater === "function") {
      // Si updater est une fonction, l'appeler avec l'état actuel
      set((state) => ({ saasMRRSPlans: updater(state.saasMRRSPlans) }));
    } else {
      // Si updater est directement un tableau, le passer à set
      set({ saasMRRSPlans: updater });
    }
  },
}));
