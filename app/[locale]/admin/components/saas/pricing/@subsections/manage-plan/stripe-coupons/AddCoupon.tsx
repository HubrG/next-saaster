"use client";
import { addStripeCoupon } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-coupon";
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
import { StripeCoupon } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AddButtonWrapper } from "../@ui/AddButtonWrapper";
export const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const { saasStripeCoupons, setSaasStripeCoupons } = useSaasStripeCoupons();
  const [disabled, setDisabled] = useState(false);
  const [couponState, setcouponState] = useState<Partial<StripeCoupon>>({
    durationInMonths: 0,
    name: "",
    percentOff: 0,
    maxRedemptions: null,
    duration: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (key === "percentOff" || key === "maxRedemptions") {
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
      setcouponState({ ...couponState, [key]: value, durationInMonths: 0 });
    } else {
      console.log("Setting duration without changing durationInMonths");
      setcouponState({ ...couponState, [key]: value });
    }
  };

  useEffect(() => {
    const newDisabledState =
      !isStripeSetted() ||
      couponState.name === "" ||
      Number(couponState.percentOff) === 0 ||
      couponState.duration === "" ||
      (couponState.duration === "repeating" &&
        Number(couponState.durationInMonths) === 0);

    setDisabled(newDisabledState);
  }, [couponState]);

  const handleAddCoupon = async () => {
    setLoading(true);
    const percentOff = parseInt(couponState.percentOff?.toString() ?? "0", 10);
    const maxRedemption = parseInt(
      couponState.maxRedemptions?.toString() ?? "0",
      10
    );
    let durationInMonths = parseInt(
      couponState.durationInMonths?.toString() ?? "0",
      10
    );

    durationInMonths =
      couponState.duration === "repeating" && !isNaN(durationInMonths)
        ? durationInMonths
        : 0;

    const dataToSend = await addStripeCoupon({
      name: couponState.name ?? "",
      percentOff: !isNaN(percentOff) ? percentOff : null,
      duration: couponState.duration ?? "recurring",
      durationInMonths,
      maxRedemptions: maxRedemption > 0 ? maxRedemption : null,
    });
    if (dataToSend.error) {
      toaster({
        type: "error",
        description: dataToSend.error,
        title: "Error",
      });
      setLoading(false);
      return;
    }

    setSaasStripeCoupons([...saasStripeCoupons, dataToSend.data]);
    toaster({
      type: "success",
      description: "Coupon created",
      title: "Success",
    });
    setcouponState({
      durationInMonths: 0,
      name: "",
      percentOff: 0,
      maxRedemptions: null,
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
              name="percentOff"
              value={couponState.percentOff ?? 0}
              onChange={(e) => {
                handleInputChange(e, "percentOff");
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
            <Label htmlFor="durationInMonths">...in months</Label>
            <Input
              disabled={couponState.duration !== "repeating"}
              type="number"
              name="durationInMonths"
              value={couponState.durationInMonths ?? ""}
              onChange={(e) => handleInputChange(e, "durationInMonths")}
            />
          </div>
        </div>
        <div className={cn("col-span-2")}>
          <div className="inputs">
            <Label htmlFor="maxRedemptions">Maximum usage</Label>
            <Input
              type="number"
              name="maxRedemptions"
              value={couponState.maxRedemptions ?? ""}
              onChange={(e) => handleInputChange(e, "maxRedemptions")}
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