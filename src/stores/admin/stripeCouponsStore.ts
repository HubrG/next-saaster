import { getStripeCoupons } from "@/src/helpers/db/stripeCoupons";
import { iStripeCoupon } from "@/src/types/iStripeCoupons";
import { create } from "zustand";

type Store = {
  saasStripeCoupons: iStripeCoupon[];
  setSaasStripeCoupons: (saasStripeCoupons: iStripeCoupon[]) => void;
  fetchSaasStripeCoupons: () => Promise<void>;
};

export const useSaasStripeCoupons = create<Store>()((set) => ({
  saasStripeCoupons: [] as iStripeCoupon[],
  setSaasStripeCoupons: (saasStripeCoupons) => set({ saasStripeCoupons }),
  fetchSaasStripeCoupons: async () => {
    const saasStripeCoupons = await getStripeCoupons();
    if (saasStripeCoupons.error) throw new Error(saasStripeCoupons.error);
    set({ saasStripeCoupons: saasStripeCoupons.data });
  },
}));
