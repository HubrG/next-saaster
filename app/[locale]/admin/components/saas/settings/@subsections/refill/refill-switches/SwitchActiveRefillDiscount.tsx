"use client";
import { updateSaasSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { BadgePercent } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function SwitchActiveRefillDiscount() {
  const [activeDiscountRefillCredit, setActiveDiscountRefillCredit] =
    useState<boolean>(true);
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setActiveDiscountRefillCredit(
      saasSettings.activeDiscountRefillCredit ?? false
    );
  }, [saasSettings]);

  const handleChangeActiveDiscountRefillCredit = async (e: any) => {
    setLoading(true);
    if (saasSettings.id) {
      setSaasSettings({ ...saasSettings, activeDiscountRefillCredit: e });
      const dataToSet = await updateSaasSettings(
        saasSettings.id,
        {
          activeDiscountRefillCredit: e,
        },
        chosenSecret()
      );
      if (dataToSet) {
        setActiveDiscountRefillCredit(e);

        setSaasSettings({
          ...saasSettings,
          activeDiscountRefillCredit: e,
        });
        setLoading(false);
        return toaster({
          description: `Refill discount ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        setSaasSettings({ ...saasSettings, activeDiscountRefillCredit: !e });
        return toaster({
          type: "error",
          description: "Refill discount option not changed, please try again",
        });
      }
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeActiveDiscountRefillCredit}
      checked={activeDiscountRefillCredit}
      loading={loading}
      className="!w-full"
      icon={<BadgePercent className="icon" />}
      id="switch-active-refill-discount-system">
      Enable discount from a certain threshold
      <Tooltip
        id="tooltip-switch-active-refill-discount-system"
        opacity={1}
        variant="dark"
        className="tooltip"
        place={"top"}>
        <span>
          You allow the user to benefit from a discount once a certain credit
          threshold is reached.
        </span>
      </Tooltip>
    </SwitchWrapper>
  );
}
