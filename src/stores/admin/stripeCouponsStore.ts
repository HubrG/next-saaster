import { getStripeCoupons } from "@/src/helpers/utils/stripeCoupons";
import { MRRSStripeCouponsWithPlans } from "@/src/types/MRRSStripeCouponsWithPlans";
import { create } from "zustand";

type Store = {
  saasStripeCoupons: MRRSStripeCouponsWithPlans[];
  setSaasStripeCoupons: (
    saasStripeCoupons: MRRSStripeCouponsWithPlans[]
  ) => void;
  fetchSaasStripeCoupons: () => Promise<void>;
};

export const useSaasStripeCoupons = create<Store>()((set) => ({
  saasStripeCoupons: [],
  setSaasStripeCoupons: (saasStripeCoupons) => set({ saasStripeCoupons }),
  fetchSaasStripeCoupons: async () => {
    const saasStripeCoupons = await getStripeCoupons();
    if (saasStripeCoupons.error) throw new Error(saasStripeCoupons.error);
    set({ saasStripeCoupons: saasStripeCoupons.data });
  },
}));
