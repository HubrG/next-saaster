import { getStripeCoupons } from "@/src/helpers/db/stripeCoupons.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
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
    const saasStripeCoupons = await getStripeCoupons({ secret: chosenSecret()});
    if (!saasStripeCoupons.data?.success) throw new Error(saasStripeCoupons.serverError);
    set({ saasStripeCoupons: saasStripeCoupons.data.success });
  },
}));
