"use client";
import { updateMRRSPlanPosition } from "@/src/components/features/pages/admin/actions.server";
import { PlanCard } from "@/src/components/features/pages/admin/saas/saas-pricing/@subsections/manage-plan/@subcomponents/@ui/PlanCard";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import SortableList, { SortableItem } from "react-easy-sort";


export const PlansList = () => {
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } = useSaasMRRSPlanToFeatureStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasMRRSPlans = await sortADminFeatureAndPlan(saasMRRSPlans, oldIndex, newIndex) as MRRSPlan[];
    if (newSaasMRRSPlans) {
      setSaasMRRSPlans(newSaasMRRSPlans);
      await updateMRRSPlanPosition(newSaasMRRSPlans);
      setSaasMRRSPlanToFeature(
        saasMRRSPlanToFeature
          .map((link) => {
            const newPlanPosition = newSaasMRRSPlans.findIndex((plan) => plan.id === link.planId);
            return {
              ...link,
              plan: newSaasMRRSPlans[newPlanPosition],
            };
          })
      );
    }
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="grid grid-flow-row lg:grid-cols-2 grid-cols-1 md:gap-x-5 md:gap-y-14"
      draggedItemClassName="dragged">
      {saasSettings.saasType === "MRR_SIMPLE" &&
        saasMRRSPlans
          .filter((plan) => !plan.deleted)
          .map((plan) => (
            <SortableItem key={plan.id}>
              <div className="!select-none">
                <PlanCard plan={plan} />
              </div>
            </SortableItem>
          ))}
    </SortableList>
  );
};
