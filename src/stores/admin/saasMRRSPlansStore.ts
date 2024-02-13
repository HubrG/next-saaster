import { getPlans } from "@/src/helpers/utils/plans";
import {
  MRRSPlan,
  StripeCoupon,
  StripePlanCoupon,
  StripePrice,
} from "@prisma/client";
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
  fetchSaasMRRSPlan: () => Promise<void>;
};

export const useSaasMRRSPlansStore = create<Store>()((set) => ({
  saasMRRSPlans: [],
  setSaasMRRSPlans: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({ saasMRRSPlans: updater(state.saasMRRSPlans) }));
    } else {
      set({ saasMRRSPlans: updater });
    }
  },
  fetchSaasMRRSPlan: async () => {
    const saasPlans = await getPlans();
    if (!saasPlans.success || saasPlans.error) {
      console.error(saasPlans.error || "Failed to fetch plans");
      return;
    }
    set({ saasMRRSPlans: saasPlans.data });
  },
}));
