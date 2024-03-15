"use client";
import { GoodlineSecond } from "@/src/components/ui/@aceternity/good-line";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
type SwitchRecurrenceProps = {
  ifOnceSentence?: string;
  yearlypercent_off?: number;
};
export const SwitchRecurrence = ({
  yearlypercent_off,
}: SwitchRecurrenceProps) => {
  const { isYearly, setIsYearly, togglePricingPlan } =
    usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const sliderVariants = {
    monthly: { x: 3 },
    yearly: { x: "98.5%" },
  };
  const notDisplay =
    saasSettings.saasType === "PAY_ONCE" ||
    saasSettings.saasType === "METERED_USAGE" ||
    !saasSettings.activeMonthlyPlans ||
    !saasSettings.activeYearlyPlans;
  
  useEffect(() => {
    if (notDisplay) {
      setIsYearly(
        saasSettings.activeMonthlyPlans && !saasSettings.activeYearlyPlans
          ? false
          : saasSettings.activeYearlyPlans ? true : false
      );
    }
  }, [saasSettings, notDisplay, setIsYearly]);

  if (notDisplay) {
    return null;
  }

  return (
    <div
      className={cn(
        {
          "justify-end": saasSettings.displayFeaturesByCategory,
          "justify-center": !saasSettings.displayFeaturesByCategory,
        },
        "w-full  flex mt-10 mb-10 items-center"
      )}>
      <div
        className={cn(
          "relative  md:w-2/6 sm:w-2/6 w-full h-10 mb-0 rounded-default "
        )}>
        <motion.div
          variants={sliderVariants}
          animate={isYearly ? "yearly" : "monthly"}
          transition={{ type: "tween" }}
          className="absolute  w-1/2 bottom-0 ">
          <GoodlineSecond />
        </motion.div>
        <div className="absolute w-full flex flex-row h-full mt-1.5 cursor-pointer rounded-default">
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
              {yearlypercent_off && `— save ${yearlypercent_off}% !`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
