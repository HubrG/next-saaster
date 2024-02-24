"use client";
import { GoodlineSecond } from "@/src/components/ui/@aceternity/good-line";
import { useIsClient } from "@/src/hooks/useIsClient";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { SaasSettings } from "@prisma/client";
import { motion } from "framer-motion";
import { useEffect } from "react";
type SwitchRecurrenceProps = {
  saasSettings: SaasSettings;
  ifOnceSentence?: string;
  yearlyPercentOff?: number;
};
export const SwitchRecurrence = ({
  saasSettings,
  yearlyPercentOff,
}: SwitchRecurrenceProps) => {
  const { isYearly, setIsYearly, togglePricingPlan } =
    usePublicSaasPricingStore();
  const sliderVariants = {
    monthly: { x: 3 },
    yearly: { x: "98.5%" },
  };
  const isClient = useIsClient();

  useEffect(() => {
    if (
      saasSettings.saasType === "PAY_ONCE" ||
      !saasSettings.activeMonthlyPlans ||
      !saasSettings.activeYearlyPlans
    ) {
      setIsYearly(saasSettings.activeMonthlyPlans ? false : true);
    }
  }, [saasSettings, setIsYearly]);

  if (
    saasSettings.saasType === "PAY_ONCE" ||
    !isClient ||
    !saasSettings.activeMonthlyPlans ||
    !saasSettings.activeYearlyPlans
  ) {
    // setIsYearly(saasSettings.activeMonthlyPlans ? false : true);
    return null;
  }

  return (
    <div className=" relative w-1/6 h-10 mb-5 -mt-5 rounded-default">
      <motion.div
        variants={sliderVariants}
        animate={isYearly ? "yearly" : "monthly"}
        transition={{ type: "tween" }}
        className="absolute  w-1/2 bottom-0 ">
        <GoodlineSecond />
      </motion.div>
      <div className="absolute w-full flex flex-row h-full mt-1.5 cursor-pointer  rounded-default">
        <div
          className={cn(
            {
              "text-theming-text-700 opacity-50": isYearly,
              "text-theming-text-700": !isYearly,
            },
            "flex-1 text-center font-bold line-40"
          )}
          onClick={() => togglePricingPlan()}>
          Monthly
        </div>
        <div
          className={cn(
            {
              "text-theming-text-700 opacity-50": !isYearly,
              "text-theming-text-700": isYearly,
            },
            "flex-1 text-center font-bold line-40"
          )}
          onClick={() => togglePricingPlan()}>
          Yearly{" "}
          <span className="text-sm opacity-70">
            {yearlyPercentOff && `— save ${yearlyPercentOff}% !`}
          </span>
        </div>
      </div>
    </div>
  );
};
