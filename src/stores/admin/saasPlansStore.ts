import { getPlans } from "@/src/helpers/utils/plans";
import {
  Plan,
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
export interface PlanStore extends Plan {
  coupons?: StripePlanCoupon[];
  coupon?: CouponDetail;
  StripeProduct?: StripeProductf[];
  id: string;
}

type Store = {
  saasPlans: PlanStore[];
  setSaasPlans: (
    updater: ((currentPlans: PlanStore[]) => PlanStore[]) | PlanStore[]
  ) => void;
  fetchSaasPlan: () => Promise<void>;
  updatePlanFromStore: (
    planId: string,
    newPlanData: Partial<PlanStore>
  ) => void;
  deletePlanFromStore: (planId: string) => void;
};

export const useSaasPlansStore = create<Store>()((set) => ({
  saasPlans: [],
  setSaasPlans: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({ saasPlans: updater(state.saasPlans) }));
    } else {
      set({ saasPlans: updater });
    }
  },
  updatePlanFromStore: (planId, newPlanData) => {
    set((state) => ({
      saasPlans: state.saasPlans.map((plan) =>
        plan.id === planId ? { ...plan, ...newPlanData } : plan
      ),
    }));
  },
  fetchSaasPlan: async () => {
    const saasPlans = await getPlans();
    if (!saasPlans.success || saasPlans.error) {
      console.error(saasPlans.error || "Failed to fetch plans");
      return;
    }
    set({ saasPlans: saasPlans.data });
  },
  deletePlanFromStore: (planId) => {
    set((state) => ({
      saasPlans: state.saasPlans.map((plan) =>
        plan.id === planId
          ? { ...plan, deleted: true, position: 999, deletedAt: new Date() }
          : plan
      ),
    }));
  },
}));
export default useSaasPlansStore;
