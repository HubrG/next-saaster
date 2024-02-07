import { MRRSStripeCouponsWithPlans } from "@/src/types/MRRSStripeCouponsWithPlans";
import { StripeCoupon } from "@prisma/client";
import { create } from "zustand";

type Store = {
  saasStripeCoupons: MRRSStripeCouponsWithPlans[];
  setSaasStripeCoupons: (
    saasStripeCoupons: MRRSStripeCouponsWithPlans[]
  ) => void;
};

export const useSaasStripeCoupons = create<Store>()((set) => ({
  saasStripeCoupons: [],
  setSaasStripeCoupons: (saasStripeCoupons) => set({ saasStripeCoupons }),
}));
