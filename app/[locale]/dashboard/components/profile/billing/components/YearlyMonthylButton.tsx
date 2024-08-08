"use client";

import { Button } from "@/src/components/ui/@shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/@shadcn/popover";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const PlanSelector = ({
  onSelect,
}: {
  onSelect: (isYearly: boolean) => void;
}) => {
  const t = useTranslations(
    "Dashboard.Components.Profile.Billing"
  );
  const [isYearly, setIsYearly] = useState(false);

  const handleSelect = (yearly: boolean) => {
    setIsYearly(yearly);
    onSelect(yearly);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{isYearly ? t("yearly") : t("monthly")}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col">
          <Button onClick={() => handleSelect(false)}>{t("monthly")}</Button>
          <Button onClick={() => handleSelect(true)}>{t("yearly")}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
