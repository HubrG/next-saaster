"use client";
import { updateSaasSettings } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MoonStar } from "lucide-react";
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
          description:
            "You can't disable both yearly and monthly plans, please enable one of them",
        });
      }
      const dataToSet = await updateSaasSettings(saasSettings.id, { activeMonthlyPlans: e });
      if (dataToSet) {
        setActiveMonthlyPlans(e);
        setSaasSettings({ ...saasSettings, activeMonthlyPlans: e });
        return toaster({
          description: `Monthly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
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
      id="switch-active-monthly-plans">
      <MoonStar className="icon" />
      Active the <strong>monthly plans</strong> for your SaaS
    </ToggleWrapper>
  );
}
