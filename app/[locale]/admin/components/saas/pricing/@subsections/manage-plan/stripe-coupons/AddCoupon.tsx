"use client";
import { addStripeCoupon } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-coupon.action";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SimpleLoader } from "@/src/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { isStripeSetted } from "@/src/helpers/functions/isStripeSetted";
import { cn } from "@/src/lib/utils";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
import { StripeCoupon } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AddButtonWrapper } from "../@ui/AddButtonWrapper";
export const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const { saasStripeCoupons, setSaasStripeCoupons } = useSaasStripeCoupons();
  const [disabled, setDisabled] = useState(false);
  const [couponState, setcouponState] = useState<Partial<StripeCoupon>>({
    duration_in_months: 0,
    name: "",
    percent_off: 0,
    max_redemptions: null,
    duration: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (key === "percent_off" || key === "max_redemptions") {
      const value = parseInt(e.target.value, 10);
      if (value < 0) {
        setcouponState({ ...couponState, [key]: null });
      } else {
        setcouponState({ ...couponState, [key]: value });
      }
      return;
    }
    setcouponState({ ...couponState, [key]: e.target.value });
  };

  const handleSelectChange = (value: string, key: string) => {
    if (value !== "repeating") {
      setcouponState({ ...couponState, [key]: value, duration_in_months: 0 });
    } else {
      console.log("Setting duration without changing duration_in_months");
      setcouponState({ ...couponState, [key]: value });
    }
  };

  useEffect(() => {
    const newDisabledState =
      !isStripeSetted() ||
      couponState.name === "" ||
      Number(couponState.percent_off) === 0 ||
      couponState.duration === "" ||
      (couponState.duration === "repeating" &&
        Number(couponState.duration_in_months) === 0);

    setDisabled(newDisabledState);
  }, [couponState]);

  const handleAddCoupon = async () => {
    setLoading(true);
    const percent_off = parseInt(
      couponState.percent_off?.toString() ?? "0",
      10
    );
    const maxRedemption = parseInt(
      couponState.max_redemptions?.toString() ?? "0",
      10
    );
    let duration_in_months = parseInt(
      couponState.duration_in_months?.toString() ?? "0",
      10
    );

    duration_in_months =
      couponState.duration === "repeating" && !isNaN(duration_in_months)
        ? duration_in_months
        : 0;

    const dataToSend = await addStripeCoupon({
      name: couponState.name ?? "",
      percent_off: !isNaN(percent_off) ? percent_off : null,
      duration: couponState.duration ?? "recurring",
      duration_in_months,
      max_redemptions: maxRedemption > 0 ? maxRedemption : null,
    });
    if (!dataToSend.success) {
      setLoading(false);
      return toaster({
        type: "error",
        description: "Error, check console for more details",
        title: "Error",
      });
    }

    setSaasStripeCoupons([...saasStripeCoupons, dataToSend.success as iStripeCoupon]);
    toaster({
      type: "success",
      description: "Coupon created",
      title: "Success",
    });
    setcouponState({
      duration_in_months: 0,
      name: "",
      percent_off: 0,
      max_redemptions: null,
      duration: "",
    });

    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-13 w-full gap-5 p-2 mt-5">
        <div className="col-span-3">
          <div className="inputs">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              value={couponState.name ?? ""}
              onChange={(e) => handleInputChange(e, "name")}
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="inputs">
            <Label htmlFor="percent">Percent</Label>
            <Input
              type="number"
              name="percent_off"
              value={couponState.percent_off ?? 0}
              onChange={(e) => {
                handleInputChange(e, "percent_off");
              }}
            />
          </div>
        </div>
        <div className="col-span-3">
          <div className="inputs">
            <Label htmlFor="duration">Duration</Label>
            <Select
              name="duration"
              value={couponState.duration} // Utilisez `value` au lieu de `defaultValue`
              onValueChange={(value) => handleSelectChange(value, "duration")}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Duration</SelectLabel>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                  <SelectItem value="repeating">Repeating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div
          className={cn(
            {
              "opacity-50": couponState.duration !== "repeating",
            },
            "col-span-2"
          )}>
          <div className="inputs">
            <Label htmlFor="duration_in_months">...in months</Label>
            <Input
              disabled={couponState.duration !== "repeating"}
              type="number"
              name="duration_in_months"
              value={couponState.duration_in_months ?? ""}
              onChange={(e) => handleInputChange(e, "duration_in_months")}
            />
          </div>
        </div>
        <div className={cn("col-span-2")}>
          <div className="inputs">
            <Label htmlFor="max_redemptions">Maximum usage</Label>
            <Input
              type="number"
              name="max_redemptions"
              value={couponState.max_redemptions ?? 0}
              onChange={(e) => handleInputChange(e, "max_redemptions")}
            />
          </div>
        </div>
        <div
          className={cn(
            { "!cursor-not-allowed": disabled },
            "col-span-1 justify-self-end"
          )}>
          <AddButtonWrapper id="plan-tooltip">
            <Button
              className={"!p-0 w-auto"}
              disabled={disabled}
              variant={"link"}
              onClick={handleAddCoupon}>
              {loading ? (
                <SimpleLoader />
              ) : (
                <PlusCircle className="text-2xl" size={24} />
              )}
            </Button>
          </AddButtonWrapper>
        </div>
      </div>
    </>
  );
};
