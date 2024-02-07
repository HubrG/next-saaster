"use client";
import { Button } from "@/src/components/ui/button";
import React, { useEffect, useState } from "react";
import { AddButtonWrapper } from "./@ui/AddButtonWrapper";
import { SimpleLoader } from "@/src/components/ui/loader";
import { cn } from "@/src/lib/utils";
import { PlusSquare } from "lucide-react";
import { createNewCoupon } from "@/src/components/features/pages/admin/queries/queries";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { StripeCoupon } from "@prisma/client";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
export const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const { saasStripeCoupons, setSaasStripeCoupons } = useSaasStripeCoupons();
  const [disabled, setDisabled] = useState(false);
  const [couponState, setcouponState] = useState<Partial<StripeCoupon>>({
    durationInMonths: 0,
    name: "",
    percentOff: 0,
    duration: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
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
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.length < 4 ||
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
    let durationInMonths = parseInt(
      couponState.durationInMonths?.toString() ?? "0",
      10
    );

    durationInMonths =
      couponState.duration === "repeating" && !isNaN(durationInMonths)
        ? durationInMonths
        : 0;

    const dataToSend = await createNewCoupon({
      name: couponState.name,
      percentOff: !isNaN(percentOff) ? percentOff : undefined, // Utiliser `percentOff` seulement s'il n'est pas NaN
      duration: couponState.duration,
      durationInMonths,
    });

    if (dataToSend) {
      setSaasStripeCoupons([...saasStripeCoupons, dataToSend]);
      toaster({
        type: "success",
        description: "Coupon created",
        title: "Success",
      });
      setcouponState({
        durationInMonths: 0,
        name: "",
        percentOff: 0,
        duration: "",
      });
      setLoading(false);
    } else {
      setLoading(false);
      toaster({
        type: "error",
        description: "Coupon not created",
        title: "Error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 w-full gap-5 p-2 mt-5">
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
              onChange={(e) => handleInputChange(e, "percentOff")}
            />
          </div>
        </div>
        <div className="col-span-3">
          {/* Specifies how long the discount will be in effect if used on a subscription. Defaults to once. (once, forver, repeating) */}
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
            "col-span-3"
          )}>
          <div className="inputs">
            <Label htmlFor="durationInMonths">... repeating in months</Label>
            <Input
              disabled={couponState.duration !== "repeating"}
              type="number"
              name="durationInMonths"
              value={couponState.durationInMonths ?? ""}
              onChange={(e) => handleInputChange(e, "durationInMonths")}
            />
          </div>
        </div>
        <div
          className={cn({ "!cursor-not-allowed": disabled }, "col-span-1 justify-self-end")}>
          <AddButtonWrapper id="plan-tooltip">
            <Button
              className={"!p-0 w-auto"}
              disabled={disabled}
              variant={"link"}
              onClick={handleAddCoupon}>
              {loading ? (
                <SimpleLoader />
              ) : (
                <PlusSquare className="text-2xl" size={24} />
              )}
            </Button>
          </AddButtonWrapper>
        </div>
      </div>
    </>
  );
};
