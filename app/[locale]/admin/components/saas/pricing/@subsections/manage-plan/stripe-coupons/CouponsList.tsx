"use client";
import { deleteCoupon } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-coupon.action";
import { PopoverDelete } from "@/src/components/ui/@fairysaas/popover-delete";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
import capitalize from "lodash/capitalize";

export const CouponsList = () => {
  const { saasStripeCoupons, setSaasStripeCoupons } = useSaasStripeCoupons();

  const handleDelete = async (couponId: string) => {
    const deleteResponse = await deleteCoupon(couponId);
    if (deleteResponse) {
      setSaasStripeCoupons(deleteResponse as iStripeCoupon[]);
      toaster({ type: "success", description: "Coupon deleted successfully!" });
    } else {
      toaster({ type: "error", description: "Coupon could not be deleted!" });
    }
  };

  if (saasStripeCoupons.length === 0)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-2xl font-bold text-gray-500">
          No coupon created yet
        </p>
      </div>
    );
  return (
    <div className="border-t pt-5">
      {saasStripeCoupons.map((coupon, index) => {
        return (
          <div key={index} className="grid grid-cols-7 items-center">
            <div className="font-bold text-left">{capitalize(coupon.name ?? "")}</div>
            <div className="italic opacity-50">apply</div>
            {coupon.percent_off ? (
              <div className="font-bold">{coupon.percent_off}%</div>
            ) : (
              <div className="font-bold">
                {(coupon.amount_off ?? 0)/100}
                {convertCurrencyName(coupon.currency ?? "usd","sigle")}
              </div>
            )}
            <div className="italic opacity-50">
              {coupon.duration === "once" && "for"}
              {coupon.duration === "forever" && "for"}
              {coupon.duration === "repeating" && "during"}
            </div>
            <div className="font-bold">
              {coupon.duration === "repeating" &&
                coupon.duration_in_months + " months"}
              {coupon.duration === "once" && "one time"}
              {coupon.duration === "forever" && "ever"}
            </div>
            <div className="text-xs opacity-50">id : {coupon.id}</div>
            <div className="text-xs">
              <PopoverDelete
                what="this coupon"
                handleDelete={() => {
                  handleDelete(coupon.id);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
