import { getPlans } from "@/src/helpers/utils/plans";
import { iPlan } from "@/src/types/iPlans";
import { create } from "zustand";

type Store = {
  saasPlans: iPlan[];
  setSaasPlans: (
    updater: ((currentPlans: iPlan[]) => iPlan[]) | iPlan[]
  ) => void;
  fetchSaasPlan: () => Promise<void>;
  isPlanStoreLoading: boolean;
  updatePlanFromStore: (planId: string, newPlanData: Partial<iPlan>) => void;
  deletePlanFromStore: (planId: string) => void;
};

export const useSaasPlansStore = create<Store>()((set) => ({
  saasPlans: [],
  isPlanStoreLoading: false,
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
    set({ isPlanStoreLoading: true });
    const saasPlans = await getPlans();
    if (!saasPlans.success || saasPlans.error) {
      console.error(saasPlans.error || "Failed to fetch plans");
      return;
    }
    set({ saasPlans: saasPlans.data, isPlanStoreLoading: false });
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
