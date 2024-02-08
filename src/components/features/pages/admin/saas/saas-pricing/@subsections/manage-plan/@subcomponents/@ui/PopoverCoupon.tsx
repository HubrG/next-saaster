import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { BadgePercent } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { SaasTypes } from "@prisma/client";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { applyCoupon } from "@/src/components/features/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { MRRSPlanStore, useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { PopoverClose } from "@radix-ui/react-popover";
type Props = {
  type: SaasTypes;
  recurrence?: "monthly" | "yearly";
  planId: string;
};
export const PopoverCoupon = ({ planId, recurrence, type }: Props) => {
  const { setSaasStripeCoupons, saasStripeCoupons } = useSaasStripeCoupons();
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  console.log("saasStripeCoupons", saasStripeCoupons);
  const handleApplyCoupon = async (couponId: string) => {
    const apply = await applyCoupon(couponId, planId, recurrence ?? "monthly");
    if (apply) {

      setSaasMRRSPlans((currentPlans:MRRSPlanStore[]) => {
        const updatedPlans = currentPlans.map((planItem) => {
          if (planItem.id === planId) {
            return {
              ...planItem,
              coupons: apply, 
            };
          }
          return planItem;
        });
        return updatedPlans.filter(
          (plan): plan is MRRSPlanStore => plan !== undefined
        );
      });
        
      toaster({
        type: "success",
        description: `Coupon has been applied to the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    } else {
      toaster({
        type: "error",
        description: `Coupon could not be applied to the plan ${
          recurrence && `for ${recurrence} price`
        }`,
      });
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-tooltip-id="tt-apply-coupon"
            className="w-full ml-0.5">
            <BadgePercent className=" mx-auto w-10 icon" />{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[25rem]">
          <div className="grid gap-2">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Coupons list</h4>
              <p className="text-sm text-muted-foreground">
                Select a coupon to apply to this plan{" "}
                <strong className="text-sm">
                  {recurrence && `for ${recurrence} price`}
                </strong>
              </p>
            </div>
            <Goodline className="my-0" />
            {saasStripeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="grid grid-cols-12 mb-2 justify-center center  items-center">
                <Label className="col-span-4 pt-1">{coupon.name}</Label>
                <div className="col-span-5 p-0 flex flex-col gap-0">
                  <small className=" text-center">
                    {coupon.percentOff}% / {coupon.duration}{" "}
                    {coupon.duration === "repeating" &&
                      `${coupon.durationInMonths} month${
                        coupon.durationInMonths &&
                        coupon.durationInMonths > 1 &&
                        "s"
                      }`}
                  </small>
                  <small className="-mt-2 opacity-50 text-center">
                    {coupon.id}
                  </small>
                </div>
                <PopoverClose asChild>
                  <Button
                    className="col-span-3 !text-sm"
                    variant="link"
                    onClick={() => {
                      handleApplyCoupon(coupon.id);
                    }}>
                    Apply
                  </Button>
                </PopoverClose>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip
        className="tooltip"
        opacity={100}
        id="tt-apply-coupon"
        place="top">
        Apply coupon
      </Tooltip>
    </>
  );
};
