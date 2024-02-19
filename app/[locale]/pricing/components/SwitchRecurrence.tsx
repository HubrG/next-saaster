// SwitchRecurrence.tsx
"use client";
import { Switch } from "@/src/components/ui/switch";
import { cn } from "@/src/lib/utils";
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
    <div className="grid grid-cols-12 items-center gap-4">
      <span
        className={cn(
          {
            "font-bold text-xl underline underline-offset-8": !isYearly,
            "opacity-50": isYearly,
          },
          "col-span-4"
        )}>
        Monthly
      </span>
      <Switch
        className="data-[state=unchecked]:bg-primary-foreground col-span-4 mx-auto"
        onCheckedChange={handleSwitchChange}
        checked={isYearly}
      />
      <span
        className={cn(
          {
            "font-bold text-xl underline underline-offset-8": isYearly,
            "opacity-50": !isYearly,
          },
          "col-span-4"
        )}>
        Yearly
      </span>
    </div>
  );
};
