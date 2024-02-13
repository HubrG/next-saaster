"use client";
import { updateSaasSettings } from "@/src/components/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleActiveMonthlyPlan() {
  const [activeMonthlyPlans, setActiveMonthlyPlans] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveMonthlyPlans(saasSettings.activeMonthlyPlans ?? false);
  }, [saasSettings]);

  const handleChangeActiveMonthlyPlans = async (e: any) => {
    if (saasSettings.id) {
      if (saasSettings.activeYearlyPlans === false && e === false) {
        return toaster({
          type: "error",
          duration: 8000,
          description: "You can't disable both yearly and monthly plans.",
        });
      }
      setSaasSettings({ ...saasSettings, activeMonthlyPlans: e });
      const dataToSet = await updateSaasSettings(saasSettings.id, {
        activeMonthlyPlans: e,
      });
      if (dataToSet) {
        setActiveMonthlyPlans(e);
        return toaster({
          description: `Monthly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeMonthlyPlans: !e });
        return toaster({
          type: "error",
          description: "Monthly plans otpion not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeActiveMonthlyPlans}
      checked={activeMonthlyPlans}
      icon={<CalendarDays className="icon" />}
      id="switch-active-monthly-plans">
      Active the <strong>monthly plans</strong> for your SaaS
    </ToggleWrapper>
  );
}
