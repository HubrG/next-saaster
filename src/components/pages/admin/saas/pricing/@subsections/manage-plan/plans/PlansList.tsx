"use client";
import { updatePlanPosition } from "@/src/components/pages/admin/queries/queries";
import { PlanCard } from "@/src/components/pages/admin/saas/pricing/@subsections/manage-plan/plans/@ui/PlanCard";
import { Loader } from "@/src/components/ui/loader";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { AnimatePresence, motion } from "framer-motion";
import SortableList, { SortableItem } from "react-easy-sort";

export const PlansList = () => {
  const { setSaasPlans, isPlanStoreLoading } = useSaasPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();

  const saasPlans = useSaasPlansStore((state) => state.saasPlans);

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasPlans = (await sortADminFeatureAndPlan(
      saasPlans,
      oldIndex,
      newIndex
    )) as iPlan[];
    if (newSaasPlans) {
      setSaasPlans(newSaasPlans as iPlan[]);
      await updatePlanPosition(newSaasPlans);
      setSaasPlanToFeature(
        saasPlanToFeature.map((link) => {
          const newPlanPosition = newSaasPlans.findIndex(
            (plan) => plan.id === link.planId
          );
          return {
            ...link,
            plan: newSaasPlans[newPlanPosition],
          };
        })
      );
    }
  };

  if (saasPlans.length === 0 && !isPlanStoreLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-2xl font-bold text-gray-500">No plan created yet</p>
      </div>
    );
  }
  if (isPlanStoreLoading) {
    return <Loader noHFull />;
  }

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="grid grid-flow-row 2xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 md:gap-x-5 md:gap-y-14"
      draggedItemClassName="dragged">
      <AnimatePresence>
        {saasPlans
          .filter(
            (plan) => !plan.deleted && plan.saasType === saasSettings.saasType
          )
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
