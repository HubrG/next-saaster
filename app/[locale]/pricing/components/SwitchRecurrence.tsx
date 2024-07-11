"use client";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
type SwitchRecurrenceProps = {
  ifOnceSentence?: string;
  yearlypercent_off?: number;
};
export const SwitchRecurrence = ({
  yearlypercent_off,
}: SwitchRecurrenceProps) => {
  const t = useTranslations("Pricing.Components.SwitchRecurrence");
  const { isYearly, setIsYearly, togglePricingPlan } =
    usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const sliderVariants = {
    monthly: { transform: "translateX(0)" },
    yearly: { transform: "translateX(100%)" },
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
          : saasSettings.activeYearlyPlans
          ? true
          : false
      );
    }
  }, [saasSettings, notDisplay, setIsYearly]);

  if (notDisplay) {
    return null;
  }


  return (
    <div className="switch-recurrence-container">
      <div className="switch-recurrence">
        <motion.div
          className="switch-recurrence-slider"
          style={sliderVariants[isYearly ? "yearly" : "monthly"]}
        />
        <div
          className={cn("switch-recurrence-option", !isYearly && "inactive")}
          onClick={() => togglePricingPlan()}>
          {t("monthly")}
        </div>
        <div
          className={cn("switch-recurrence-option", isYearly && "inactive")}
          onClick={() => togglePricingPlan()}>
          {t("yearly")}
          <span className="text-sm opacity-70">
            {yearlypercent_off && `— save ${yearlypercent_off}% !`}
          </span>
        </div>
      </div>
    </div>
  );
};
