"use client";
import { updateMRRSPlanPosition } from "@/src/components/pages/admin/queries/queries";
import { PlanCard } from "@/src/components/pages/admin/saas/pricing/@subsections/manage-plan/plans/@ui/PlanCard";
import { Loader } from "@/src/components/ui/loader";
import { sortADminFeatureAndPlan } from "@/src/functions/sortAdminFeatureAndPlan";
import { useSaasMRRSPlanToFeatureStore } from "@/src/stores/admin/saasMRRSPlanToFeatureStore";
import { useSaasMRRSPlansStore } from "@/src/stores/admin/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import SortableList, { SortableItem } from "react-easy-sort";

export const PlansList = () => {
  const { setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasMRRSPlanToFeature, setSaasMRRSPlanToFeature } =
    useSaasMRRSPlanToFeatureStore();

  const saasMRRSPlans = useSaasMRRSPlansStore((state) => state.saasMRRSPlans);

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

  if (saasMRRSPlans.length === 0) {
    return (
      <Suspense fallback={<Loader noHFull />}>
        <div className="flex justify-center items-center py-10">
          <p className="text-2xl font-bold text-gray-500">
            No plan created yet
          </p>
        </div>
      </Suspense>
    );
  }

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="grid grid-flow-row 2xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 md:gap-x-5 md:gap-y-14"
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
