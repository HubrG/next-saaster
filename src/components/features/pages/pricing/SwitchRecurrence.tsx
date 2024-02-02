// SwitchRecurrence.tsx
"use client";
import { Switch } from "@/src/components/ui/switch";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";

export const SwitchRecurrence = () => {
  const isYearly = usePublicSaasPricingStore((state) => state.isYearly);
  const togglePricingPlan = usePublicSaasPricingStore(
    (state) => state.togglePricingPlan
  );

  const handleSwitchChange = () => {
    togglePricingPlan();
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <span>{isYearly ? "Yearly" : "Monthly"}</span>
      <Switch onCheckedChange={handleSwitchChange} checked={isYearly} />
    </div>
  );
};
