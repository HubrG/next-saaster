"use client";
import { updateSaasSettings } from "@/src/components/features/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleActiveYearlyPlan() {
  const [activeYearlyPlans, setActiveYearlyPlans] = useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();

  useEffect(() => {
    setActiveYearlyPlans(saasSettings.activeYearlyPlans ?? false);
  }, [saasSettings]);

  const handleChangeActiveYearlyPlans = async (e: any) => {
    if (saasSettings.id) {
      if (saasSettings.activeMonthlyPlans === false && e === false) {
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
      });
      if (dataToSet) {
        setActiveYearlyPlans(e);
        return toaster({
          description: `Yearly plans ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setSaasSettings({ ...saasSettings, activeYearlyPlans: !e });
        return toaster({
          type: "error",
          description: "Yearly plans option not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeActiveYearlyPlans}
      checked={activeYearlyPlans}
      icon={<MoonStar className="icon" />}
      id="switch-active-yearly-plans">
      Active the <strong>yearly plans</strong> for your SaaS
    </ToggleWrapper>
  );
}
