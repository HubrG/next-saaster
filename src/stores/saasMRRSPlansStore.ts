import { MRRSPlan } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasMRRSPlans: MRRSPlan[];
  setSaasMRRSPlans: (saasMRRSPlans: MRRSPlan[]) => void;
};

export const useSaasMRRSPlansStore = create<Store>()((set) => ({
  saasMRRSPlans: [],
  setSaasMRRSPlans: (saasMRRSPlans) => set({ saasMRRSPlans }),
}));
