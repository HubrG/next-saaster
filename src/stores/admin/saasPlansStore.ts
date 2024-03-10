import { getPlans } from "@/src/helpers/db/plans.action";
import { iPlan } from "@/src/types/iPlans";
import { create } from "zustand";

type Store = {
  saasPlans: iPlan[];
  setSaasPlans: (
    updater: ((currentPlans: iPlan[]) => iPlan[]) | iPlan[]
  ) => void;
  fetchSaasPlan: () => Promise<void>;
  isPlanStoreLoading: boolean;
  setPlanStoreLoading: (loading: boolean) => void;
  updatePlanFromStore: (planId: string, newPlanData: Partial<iPlan>) => void;
  deletePlanFromStore: (planId: string) => void;
  restorePlanOnStore: (planId: string) => void;
};

export const useSaasPlansStore = create<Store>()((set) => ({
  saasPlans: [],
  isPlanStoreLoading: false,
  setPlanStoreLoading: (loading) => {
    set({ isPlanStoreLoading: loading });
  },
  setSaasPlans: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        saasPlans: updater(state.saasPlans),
        isPlanStoreLoading: false,
      }));
    } else {
      set({ saasPlans: updater, isPlanStoreLoading: false });
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
    set({ isPlanStoreLoading: true });
    const saasPlans = await getPlans({ secret: process.env.NEXTAUTH_SECRET ?? "" });
    if (!saasPlans.data?.success) {
      set({ isPlanStoreLoading: false });
      console.error(saasPlans.serverError || "Failed to fetch plans");
    }
    set({ saasPlans: saasPlans.data?.success, isPlanStoreLoading: false });
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
  restorePlanOnStore: (planId) => {
    set((state) => ({
      saasPlans: state.saasPlans.map((plan) =>
        plan.id === planId
          ? { ...plan, deleted: false, position: 0, deletedAt: null }
          : plan
      ),
    }));
  },
}));
export default useSaasPlansStore;
