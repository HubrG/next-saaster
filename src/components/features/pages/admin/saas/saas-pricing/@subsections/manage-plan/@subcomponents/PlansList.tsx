"use client";
import { updateMRRSPlanPosition } from "@/src/components/features/pages/admin/queries/queries";
import { PlanCard } from "@/src/components/features/pages/admin/saas/saas-pricing/@subsections/manage-plan/@subcomponents/@ui/PlanCard";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import SortableList, { SortableItem } from "react-easy-sort";

export const PlansList = () => {
  const { saasMRRSPlans, setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } =
    useSaasMRRSPlanToFeatureStore();

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasMRRSPlans = (await sortADminFeatureAndPlan(
      saasMRRSPlans,
      oldIndex,
      newIndex
    )) as MRRSPlan[];
    if (newSaasMRRSPlans) {
      setSaasMRRSPlans(newSaasMRRSPlans);
      await updateMRRSPlanPosition(newSaasMRRSPlans);
      setSaasMRRSPlanToFeature(
        saasMRRSPlanToFeature.map((link) => {
          const newPlanPosition = newSaasMRRSPlans.findIndex(
            (plan) => plan.id === link.planId
          );
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
      className="grid grid-flow-row 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 md:gap-x-5 md:gap-y-14"
      draggedItemClassName="dragged">
      <AnimatePresence>
        {saasSettings.saasType === "MRR_SIMPLE" &&
          saasMRRSPlans
            .filter((plan) => !plan.deleted)
            .map((plan) => (
              <SortableItem key={plan.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="!select-none">
                  <PlanCard plan={plan} />
                </motion.div>
              </SortableItem>
            ))}
      </AnimatePresence>
    </SortableList>
  );
};
