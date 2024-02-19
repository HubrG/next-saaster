"use client";
import { updatePlanPosition } from "@/src/components/pages/admin/queries/queries";
import { sortAdminPlans } from "@/src/components/pages/admin/saas/pricing/@subsections/manage-plan/plans/@functions/sortAdminPlans";
import { PlanCard } from "@/src/components/pages/admin/saas/pricing/@subsections/manage-plan/plans/@ui/PlanCard";
import { Loader } from "@/src/components/ui/loader";
import { SaasTypeReadableName } from "@/src/functions/SaasTypes";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import { useSaasPlansStore } from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { AnimatePresence, motion } from "framer-motion";
import { toLower } from "lodash";
import SortableList, { SortableItem } from "react-easy-sort";
import { DeteledPlanDialog } from "./@ui/DeletedPlanDialog";

export const PlansList = () => {
  const { setSaasPlans, isPlanStoreLoading } = useSaasPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { saasPlanToFeature, setSaasPlanToFeature } =
    useSaasPlanToFeatureStore();

  const saasPlans = useSaasPlansStore((state) => state.saasPlans);

  const onSortEnd = async (oldIndex: number, newIndex: number) => {
    const newSaasPlans = (await sortAdminPlans({
      list: saasPlans,
      oldIndex,
      newIndex,
      saasType: saasSettings.saasType,
    })) as iPlan[];
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

  // Calcul du nombre d'éléments non supprimés correspondant au saasType
  const nonDeletedPlansCount = saasPlans.filter(
    (e) => e.saasType === saasSettings.saasType && e.deleted !== true
  ).length;

  // Calculation of the number of deleted elements corresponding to the saasType
  const deletedPlansCount = saasPlans.filter(
    (e) => e.saasType === saasSettings.saasType && e.deleted === true
  ).length;

  if (nonDeletedPlansCount === 0 && !isPlanStoreLoading) {
    return (
      <div className="flex flex-col gap-y-5 justify-center items-center py-10 opacity-60">
        <p className="text-2xl font-bold">
          No {toLower(SaasTypeReadableName(saasSettings.saasType))} plan created
          yet
        </p>
        {/* Display the message about deleted items if necessary */}
        {deletedPlansCount > 0 && (
          <p className="px-0 text-sm">
            ...but you have{" "}
            <DeteledPlanDialog>
              <strong className="px-0 text-sm underline-offset-4 underline decoration-solid hover:decoration-dashed cursor-pointer">
                {deletedPlansCount} deleted item(s)
              </strong>
            </DeteledPlanDialog>
            . Click here to view and reactivate them if necessary.
          </p>
        )}
      </div>
    );
  }

  if (isPlanStoreLoading) {
    return <Loader noHFull />;
  }

  return (
    <>
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
      {deletedPlansCount > 0 && (
        <DeteledPlanDialog>
          <strong className="px-0 text-sm underline-offset-4 underline decoration-solid hover:decoration-dashed cursor-pointer">
            {deletedPlansCount} deleted item(s)
          </strong>
        </DeteledPlanDialog>
      )}
    </>
  );
};
