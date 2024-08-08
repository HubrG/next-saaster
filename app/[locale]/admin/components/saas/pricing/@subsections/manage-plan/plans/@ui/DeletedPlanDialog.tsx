import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/@shadcn/dialog";
import { Separator } from "@/src/components/ui/@shadcn/separator";
import { updatePlan } from "@/src/helpers/db/plans.action";
import { SaasTypeReadableName } from "@/src/helpers/functions/SaasTypes";
import { useSaasPlanToFeatureStore } from "@/src/stores/admin/saasPlanToFeatureStore";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlanToFeature } from "@/src/types/db/iPlanToFeature";
import { iPlan } from "@/src/types/db/iPlans";
import { format } from "date-fns";
import { toLower } from "lodash";
import { Fragment } from "react";

type DeletedPlanDialogProps = {
  children: React.ReactNode;
};
export function DeteledPlanDialog({ children }: DeletedPlanDialogProps) {
  const { saasPlans, restorePlanOnStore } = useSaasPlansStore();
  const { saasSettings } = useSaasSettingsStore();
  const { setSaasPlanToFeature, saasPlanToFeature } =
    useSaasPlanToFeatureStore();
  const handleRestore = async (planState: iPlan) => {
    const dataToSet = await updatePlan({
      data: {
        id:planState.id,
        deleted: false,
      }
    });
    if (dataToSet.serverError || dataToSet.validationErrors) {
      const error = dataToSet.serverError || dataToSet.validationErrors?.data;
      return toaster({
        description: error,
        type: "error",
      });
    }
    if (dataToSet) {
      restorePlanOnStore(planState.id);
      setSaasPlanToFeature(
        saasPlanToFeature.map((item) =>
          item.planId === planState.id
            ? { ...item, plan: { ...planState, deleted: true } }
            : item
        ) as iPlanToFeature[]
      );
      return toaster({
        description: `« ${planState.name} » dearchived successfully.`,
        type: "success",
        duration: 8000,
      });
    } else {
      return toaster({
        description: `Error while archiving plan ${planState.name}, please try again later`,
        type: "error",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Archived {toLower(SaasTypeReadableName(saasSettings.saasType))} plans
          </DialogTitle>
          <DialogDescription>
            You can restore these plans at any time.
            To permanently delete one of these plans, you must do so from your Stripe interface to ensure that no customer has subscribed to any of the subscriptions in the archived plan.

          </DialogDescription>
        </DialogHeader>
        <Goodline />
        {saasPlans.filter((e) => e.deleted).length > 0 ? (
          <div className="-mt-4  max-h-[50vh] overflow-y-auto">
            {saasPlans
              .filter((e) => e.deleted)
              .filter((e) => e.saasType === saasSettings.saasType)
              .sort((a, b) => {
                if (a.deletedAt && b.deletedAt) {
                  return (
                    new Date(b.deletedAt).getTime() -
                    new Date(a.deletedAt).getTime()
                  );
                }
                return 0;
              })
              .map((plan, index, filteredArray) => (
                <Fragment key={plan.id}>
                  <div className="grid grid-cols-12 items-start">
                    <div className="col-span-10 flex flex-col">
                      <div className="font-bold">{plan.name}</div>
                      {plan.description && <div>{plan.description}</div>}
                      <div className="text-sm opacity-50">
                        Deleted at{" "}
                        {plan.deletedAt && (
                          <>
                            {format(new Date(plan.deletedAt), "yyyy-MM-dd")} at{" "}
                            {format(new Date(plan.deletedAt), "HH:mm:ss")}
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={"link"}
                      className="px-0 !py-0 col-span-2 self-start"
                      onClick={() => {
                        handleRestore(plan);
                      }}>
                      Restore
                    </Button>
                  </div>
                  {index !== filteredArray.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </Fragment>
              ))}
          </div>
        ) : (
          <div>No deleted plans</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
