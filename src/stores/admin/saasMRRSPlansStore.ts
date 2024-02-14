import { getPlans } from "@/src/helpers/utils/plans";
import {
  MRRSPlan,
  StripeCoupon,
  StripePlanCoupon,
  StripePrice,
} from "@prisma/client";
import { create } from "zustand";
type CouponDetail = {
  coupon: StripeCoupon;
};
interface StripeProductf {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created: number;
  prices: StripePrice[];
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
  updatePlanFromStore: (
    planId: string,
    newPlanData: Partial<MRRSPlanStore>
  ) => void;
  deletePlanFromStore: (planId: string) => void;
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
  updatePlanFromStore: (planId, newPlanData) => {
    set((state) => ({
      saasMRRSPlans: state.saasMRRSPlans.map((plan) =>
        plan.id === planId ? { ...plan, ...newPlanData } : plan
      ),
    }));
  },
  fetchSaasMRRSPlan: async () => {
    const saasPlans = await getPlans();
    if (!saasPlans.success || saasPlans.error) {
      console.error(saasPlans.error || "Failed to fetch plans");
      return;
    }
    set({ saasMRRSPlans: saasPlans.data });
  },
  deletePlanFromStore: (planId) => {
    set((state) => ({
      saasMRRSPlans: state.saasMRRSPlans.map((plan) =>
        plan.id === planId
          ? { ...plan, deleted: true, position: 999, deletedAt: new Date() }
          : plan
      ),
    }));
  },
}));
export default useSaasMRRSPlansStore;
