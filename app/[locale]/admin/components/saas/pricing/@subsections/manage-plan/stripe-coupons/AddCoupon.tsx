"use client";
import { addStripeCoupon } from "@/app/[locale]/admin/queries/saas/saas-pricing/stripe-coupon.action";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
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
import { isStripeSetted } from "@/src/helpers/functions/isStripeSetted";
import { cn } from "@/src/lib/utils";
import { useSaasStripeCoupons } from "@/src/stores/admin/stripeCouponsStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
import { StripeCoupon } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AddButtonWrapper } from "../@ui/AddButtonWrapper";
export const AddCoupon = () => {
  const { saasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState(false);
  const { saasStripeCoupons, setSaasStripeCoupons } = useSaasStripeCoupons();
  const [disabled, setDisabled] = useState(false);
  const [couponState, setCouponState] = useState<Partial<StripeCoupon>>({
    duration_in_months: 0,
    name: "",
    percent_off: 0,
    amount_off: 0,
    max_redemptions: null,
    duration: "",
  });
  const [percentOrFixed, setPercentOrFixed] = useState<"percent" | "fixed">(
    "percent"
  );
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = e.target.value;
    let newValue;
    if (
      [
        "amount_off",
        "percent_off",
        "duration_in_months",
        "max_redemptions",
      ].includes(key)
    ) {
      newValue = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : null;
    } else {
      newValue = value;
    }

    setCouponState({ ...couponState, [key]: newValue });
  };
  const handleSelectChange = (value: string, key: string) => {
    if (value !== "repeating") {
      setCouponState({ ...couponState, [key]: value, duration_in_months: 0 });
    } else {
      console.log("Setting duration without changing duration_in_months");
      setCouponState({ ...couponState, [key]: value });
    }
  };

  useEffect(() => {
    const newDisabledState =
      !isStripeSetted() ||
      couponState.name === "" ||
      (couponState.percent_off === 0 && couponState.amount_off === 0) ||
      couponState.duration === "" ||
      (couponState.duration === "repeating" &&
        couponState.duration_in_months === 0);
    setDisabled(newDisabledState);
  }, [couponState]);

  const handleAddCoupon = async () => {
    setLoading(true);
    const dataToSend = await addStripeCoupon({
      name: couponState.name ?? "",
      percent_off: couponState.percent_off ?? undefined,
      amount_off: couponState.amount_off ?? undefined,
      duration: couponState.duration ?? "recurring",
      currency: saasSettings.currency,
      duration_in_months:
        couponState.duration === "repeating"
          ? couponState.duration_in_months
          : 0,
      max_redemptions: couponState.max_redemptions ?? null,
    });
    if (!dataToSend.success) {
      setLoading(false);
      return toaster({
        type: "error",
        description: "Error, check console for more details",
        title: "Error",
      });
    }

    setSaasStripeCoupons([
      ...saasStripeCoupons,
      dataToSend.success as iStripeCoupon,
    ]);
    toaster({
      type: "success",
      description: "Coupon created",
      title: "Success",
    });
    setCouponState({
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
      <h2 className="text-base font-semibold mt-5 text-left opacity-90">
        Add a coupon
      </h2>
      <div className="md:grid md:grid-cols-13 grid grid-cols-2 w-full gap-5 p-2 mt-5">
        <div className="md:col-span-2 col-span-1">
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
        <div className="md:col-span-3 col-span-1">
          <div className="inputs">
            <div className="flex flex-row justify-evenly">
              <Label
                onClick={() => {
                  setPercentOrFixed("percent");
                  setCouponState({ ...couponState, amount_off: 0 });
                }}
                className={cn(
                  { "opacity-50 hover:opacity-60": percentOrFixed === "fixed" },
                  "cursor-pointer"
                )}
                htmlFor="percent">
                Percent
              </Label>
              <Label
                onClick={() => {
                  setPercentOrFixed("fixed");
                  setCouponState({ ...couponState, percent_off: 0 });
                }}
                className={cn(
                  {
                    "opacity-50 hover:opacity-60": percentOrFixed === "percent",
                  },
                  "cursor-pointer"
                )}
                htmlFor="percent">
                Fixed
              </Label>
            </div>
            {percentOrFixed === "fixed" ? (
              <Input
                type="number"
                name="amount_off"
                value={couponState.amount_off ?? 0}
                onChange={(e) => {
                  handleInputChange(e, "amount_off");
                }}
              />
            ) : (
              <Input
                type="number"
                name="percent_off"
                value={couponState.percent_off ?? 0}
                onChange={(e) => {
                  handleInputChange(e, "percent_off");
                }}
              />
            )}
          </div>
        </div>
        <div className="md:col-span-3 col-span-1">
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
            "md:col-span-2 col-span-1"
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
        <div
          className={cn(
            "md:col-span-2 col-span-1 !items-center !justify-center"
          )}>
          <div className="inputs w-full">
            <Label htmlFor="max_redemptions ">Max usage</Label>
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
                <>
                  <PlusCircle className="md:block hidden text-2xl" size={24} />
                  <span className="md:hidden block">Add</span>
                </>
              )}
            </Button>
          </AddButtonWrapper>
        </div>
      </div>
    </>
  );
};
