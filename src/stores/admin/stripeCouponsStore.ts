import { getStripeCoupons } from "@/src/helpers/db/stripeCoupons.action";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
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
    const saasStripeCoupons = await getStripeCoupons({ secret: process.env.NEXTAUTH_SECRET ?? ""});
    if (!saasStripeCoupons.data?.success) throw new Error(saasStripeCoupons.serverError);
    set({ saasStripeCoupons: saasStripeCoupons.data.success });
  },
}));
