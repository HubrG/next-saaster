"use client";
import { updateMRRSPlanPosition } from "@/src/components/features/pages/admin/actions.server";
import { PlanCard } from "@/src/components/features/pages/admin/saas/saas-pricing/@subsections/manage-plan/@subcomponents/@ui/PlanCard";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import SortableList, { SortableItem } from "react-easy-sort";

export const PlansList = () => {
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlans();
  const { saasSettings } = useSaasSettingsStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasMRRSPlans = await sortADminFeatureAndPlan(saasMRRSPlans, oldIndex, newIndex) as MRRSPlan[];
    if (newSaasMRRSPlans) {
      setSaasMRRSPlans(newSaasMRRSPlans);
      const update = await updateMRRSPlanPosition(newSaasMRRSPlans);
    }
    // if (update) {
    //   setSaasMRRSPlans(update);
    // }
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2  grid-cols-1 md:gap-x-5 md:gap-y-14"
      draggedItemClassName="dragged">
      {saasSettings.saasType === "MRR_SIMPLE" &&
        saasMRRSPlans
          .filter((plan) => !plan.deleted)
          .map((plan, index) => (
            <SortableItem key={plan.id}>
              <div className="!select-none">
                <PlanCard plan={plan} />
              </div>
            </SortableItem>
          ))}
    </SortableList>
  );
};
