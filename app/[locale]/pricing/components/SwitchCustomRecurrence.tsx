"use client";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type SwitchCustomRecurrenceProps = {
  ifOnceSentence?: string;
  yearlypercent_off?: number;
  enabled: boolean;
  custom1?: string;
  custom2?: string;
  custom3?: string;
  custom4?: string;
  custom1PercentOff?: number;
  custom2PercentOff?: number;
  custom3PercentOff?: number;
  custom4PercentOff?: number;
};

export const SwitchCustomRecurrence = ({
  custom1PercentOff,
  custom2PercentOff,
  custom3PercentOff,
  custom4PercentOff,
  ifOnceSentence,
  enabled,
  custom1,
  custom2,
  custom3,
  custom4,
}: SwitchCustomRecurrenceProps) => {
  const t = useTranslations("Pricing.Components.SwitchRecurrence");
  const {
    customIs1,
    setCustomIs1,
    customIs2,
    setCustomIs2,
    customIs3,
    setCustomIs3,
    customIs4,
    setCustomIs4,
    togglePricingPlan,
  } = usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const notDisplay =
    saasSettings.saasType === "PAY_ONCE" ||
    saasSettings.saasType === "METERED_USAGE" ||
    !saasSettings.activeMonthlyPlans ||
    !saasSettings.activeYearlyPlans;

  const options = [
    custom1 ? (
      <span className="flex items-center justify-evenly w-full gap-1">
        <span>{custom1}</span>
        {custom1PercentOff && (
          <Badge variant="default"  className="!px-1">
            -{custom1PercentOff}%
          </Badge>
        )}
      </span>
    ) : null,
    custom2 ? (
      <span className="flex items-center justify-evenly w-full gap-1">
        <span>{custom2}</span>
        {custom2PercentOff && (
          <Badge variant="default"  className="!px-1">
            -{custom2PercentOff}%
          </Badge>
        )}
      </span>
    ) : null,
    custom3 ? (
      <span className="flex items-center justify-evenly w-full gap-1">
        <span>{custom3}</span>
        {custom3PercentOff && (
          <Badge variant="default" className="!px-1">
            -{custom3PercentOff}%
          </Badge>
        )}
      </span>
    ) : null,
    custom4 ? (
      <span className="flex items-center justify-evenly w-full gap-1">
        <span>{custom4}</span>
        {custom4PercentOff && (
          <Badge variant="default"  className="!px-1">
            -{custom4PercentOff}%
          </Badge>
        )}
      </span>
    ) : null,
  ].filter(Boolean);
  const optionCount = options.length;
  const sliderWidth = 100 / optionCount;

  useEffect(() => {
    if (notDisplay) {
      if (custom1 !== undefined) setCustomIs1(custom1 ? true : false);
      if (custom2 !== undefined) setCustomIs2(custom2 ? true : false);
      if (custom3 !== undefined) setCustomIs3(custom3 ? true : false);
      if (custom4 !== undefined) setCustomIs4(custom4 ? true : false);
    }
  }, [saasSettings, notDisplay, custom1, custom2, custom3, custom4]);

  useEffect(() => {
    const newActiveIndex = [
      customIs1,
      customIs2,
      customIs3,
      customIs4,
    ].findIndex((isActive) => isActive);
    setActiveIndex(newActiveIndex !== -1 ? newActiveIndex : 0);
  }, [customIs1, customIs2, customIs3, customIs4]);

  if (notDisplay || !enabled) {
    return null;
  }

  const handleOptionClick = (index: number) => {
    setActiveIndex(index);
    switch (index) {
      case 0:
        setCustomIs1(true);
        setCustomIs2(false);
        setCustomIs3(false);
        setCustomIs4(false);
        break;
      case 1:
        setCustomIs1(false);
        setCustomIs2(true);
        setCustomIs3(false);
        setCustomIs4(false);
        break;
      case 2:
        setCustomIs1(false);
        setCustomIs2(false);
        setCustomIs3(true);
        setCustomIs4(false);
        break;
      case 3:
        setCustomIs1(false);
        setCustomIs2(false);
        setCustomIs3(false);
        setCustomIs4(true);
        break;
    }
  };

  return (
    <div className="switch-recurrence-container">
      <div
        className="switch-recurrence flex items-center"
        style={{ width: `${optionCount * 100000}px` }}>
        <motion.div
          className="switch-recurrence-slider"
          style={{ width: `${sliderWidth}%` }}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{
            type: "tween",
            duration: 0.1,
            ease: "easeInOut",
          }}
        />
        {options.map((option, index) => (
          <div
            key={index}
            className={cn(
              "switch-recurrence-option !text-[0.800rem] pl-2",
              activeIndex === index && "inactive",
              activeIndex !== index && "!text-theming-text-500"
            )}
            onClick={() => handleOptionClick(index)}>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};
