"use client";
import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchActiveMonthlyPlan() {
  const [activeMonthlyPlans, setActiveMonthlyPlans] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveMonthlyPlans(saasSettings.activeMonthlyPlans ?? false);
  }, [saasSettings]);

  const handleChangeActiveMonthlyPlans = async (e: any) => {
    setLoading(true);
    if (saasSettings.id) {
      if (saasSettings.activeYearlyPlans === false && e === false) {
        setLoading(false);
        return toaster({
          type: "error",
          duration: 8000,
          description: "You can't disable both yearly and monthly plans.",
        });
      }
      setSaasSettings({ ...saasSettings, activeMonthlyPlans: e });
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeMonthlyPlans: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveMonthlyPlans(e);
        setLoading(false);
        return toaster({
          description: `Monthly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeMonthlyPlans: !e });
        setLoading(false);
        return toaster({
          type: "error",
          description: "Monthly plans option not changed, please try again",
        });
      }
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeActiveMonthlyPlans}
      checked={activeMonthlyPlans}
      loading={loading}
      icon={<CalendarDays className="icon" />}
      id="switch-active-monthly-plans">
      Active the <strong>monthly plans</strong> for your SaaS
    </SwitchWrapper>
  );
}
