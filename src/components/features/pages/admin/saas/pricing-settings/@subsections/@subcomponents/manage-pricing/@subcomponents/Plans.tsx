"use client";

import { PlanCard } from "@/src/components/features/pages/admin/saas/pricing-settings/@subsections/@subcomponents/manage-pricing/@subcomponents/@ui/PlanCard";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
export const Plans = () => {
  const { saasMRRSPlans } = useSaasMRRSPlans();
  const { saasSettings } = useSaasSettingsStore();

  return (
    <div className="grid grid-flow-row lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-x-20 gap-y-14">
      {saasSettings.saasType === "MRR_SIMPLE" &&
        saasMRRSPlans
          .slice()
          .sort((a, b) => {
            if (a.active && !b.active) {
              return -1;
            }
            if (!a.active && b.active) {
              return 1;
            }
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          })
          .map((plan, index) => (
            <PlanCard key={index + plan.id} modeAdmin={true} plan={plan} />
          ))}
    </div>
  );
};
