"use client";
import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchActiveYearlyPlan() {
  const [activeYearlyPlans, setActiveYearlyPlans] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveYearlyPlans(saasSettings.activeYearlyPlans ?? false);
  }, [saasSettings]);

  const handleChangeActiveYearlyPlans = async (e: any) => {
    setLoading(true);
    if (saasSettings.id) {
      if (saasSettings.activeMonthlyPlans === false && e === false) {
        setLoading(false);
        return toaster({
          type: "error",
          duration: 8000,
          description:
            "You can't disable both yearly and monthly plans, please enable one of them",
        });
      }
      setSaasSettings({ ...saasSettings, activeYearlyPlans: e });
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeYearlyPlans: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveYearlyPlans(e);
        setLoading(false);
        return toaster({
          description: `Yearly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeYearlyPlans: !e });
        setLoading(false);
        return toaster({
          type: "error",
          description: "Yearly plans option not changed, please try again",
        });
      }
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeActiveYearlyPlans}
      checked={activeYearlyPlans}
      loading={loading}
      icon={<Calendar className="icon" />}
      id="switch-active-yearly-plans">
      Enable the <strong>yearly plans</strong> for your SaaS
    </SwitchWrapper>
  );
}
