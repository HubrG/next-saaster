import { MRRSPlan, StripeCoupon, StripePlanCoupon } from "@prisma/client";
import { create } from "zustand";

export interface MRRSPlanStore extends MRRSPlan {
  coupons?: StripePlanCoupon[];
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
