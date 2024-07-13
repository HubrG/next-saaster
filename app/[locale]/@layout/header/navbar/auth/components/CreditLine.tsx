"use client";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { cn } from "@/src/lib/utils";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { SaasSettings } from "@prisma/client";
import { lowerCase } from "lodash";
import { Coins } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type CreditLineProps = {
  saasSettings: SaasSettings;
};

export const CreditLine = ({ saasSettings }: CreditLineProps) => {
  const { userInfoStore: userStore } = useUserInfoStore();
  const [getUserProfile, setGetUserProfile] =
    useState<ReturnUserDependencyProps>();
  const format = useFormatter();

  useEffect(() => {
    if (userStore?.info.id) {
      setGetUserProfile(userStore);
    }
  }, [userStore]);

  const renderCreditInfo = () => {
    if (!saasSettings.activeCreditSystem) return null;

    const { activeSubscription } = userStore || {};
    const creditRemaining = activeSubscription?.creditRemaining ?? 0;
    const creditPercentage = activeSubscription?.creditPercentage ?? 0;
    const creditAllouedByMonth = activeSubscription?.creditAllouedByMonth ?? 0;

    if (activeSubscription && creditRemaining !== 0) {
      return (
        <>
          <div className="w-full userNavbarDiv">
            <div
              className="relative w-full flex flex-col gap-1 justify-center"
              data-tooltip-id="remainingTooltip">
              <p className="text-center flex-row-center !text-xs ">
                <Coins className="icon !mr-0.5 ml-2" /> {creditRemaining}
              </p>
              {creditPercentage !== Infinity && (
                <div>
                  <div
                    className={`${
                      creditPercentage <= 0
                        ? "progressTokenVoid"
                        : creditPercentage < 10
                        ? "progressToken bg-red-500"
                        : "progressToken"
                    }
                  `}
                    style={{ width: `${Math.min(creditPercentage, 100)}%` }}>
                    &nbsp;
                  </div>
                  <div
                    className={cn(
                      { hidden: creditPercentage === Infinity },
                      "progressTokenVoid"
                    )}></div>
                </div>
              )}
            </div>
          </div>
          <Tooltip
            id="remainingTooltip"
            opacity={1}
            place="bottom"
            className="tooltip flex flex-col">
            {creditPercentage !== Infinity ? (
              <>
                <span>
                  {saasSettings.creditName} : {creditPercentage}%
                </span>
                {format.number(creditRemaining)}&nbsp;/&nbsp;
                {format.number(creditAllouedByMonth)}
              </>
            ) : (
              <span>
                {format.number(creditRemaining)}{" "}
                {lowerCase(saasSettings.creditName ?? "credits")}
              </span>
            )}
          
          </Tooltip>
        </>
      );
    }

    if (
      (saasSettings.saasType === "PAY_ONCE" ||
        saasSettings.saasType === "CUSTOM") &&
      !activeSubscription
    ) {
      return (
        <>
          <div className="w-full userNavbarDiv">
            <div className="relative w-full" data-tooltip-id="remainingTooltip">
              <p className="text-center !text-xs font-bold">
                {format.number(getUserProfile?.info.creditRemaining ?? 0)}
              </p>
            </div>
          </div>
          <Tooltip
            id="remainingTooltip"
            opacity={1}
            place="bottom"
            className="tooltip flex flex-col">
            {format.number(getUserProfile?.info.creditRemaining ?? 0)}{" "}
            {saasSettings.creditName}s
          </Tooltip>
        </>
      );
    }

    return null;
  };

  return <>{renderCreditInfo()}</>;
};
