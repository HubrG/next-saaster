"use client";

import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { cn } from "@/src/lib/utils";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { SaasSettings } from "@prisma/client";
import { lowerCase } from "lodash";
import { Coins } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useRef, useState } from "react";
import FlipNumbers from "react-flip-numbers";
import { Tooltip } from "react-tooltip";

type CreditLineProps = {
  saasSettings: SaasSettings;
  className?: string;
};

export const CreditLine = ({ saasSettings, className }: CreditLineProps) => {
  const { userInfoStore: userStore } = useUserInfoStore();
  const [iconColor, setIconColor] = useState<string>("");
  const [getUserProfile, setGetUserProfile] =
    useState<ReturnUserDependencyProps>();
  const format = useFormatter();
  const [prevCreditRemaining, setPrevCreditRemaining] = useState(0);
  const [creditRemaining, setCreditRemaining] = useState(0);
  const prevCreditRemainingRef = useRef<number>(prevCreditRemaining);

   useEffect(() => {
     if (userStore?.info.id) {
       setGetUserProfile(userStore);
     }
   }, [userStore]);
  useEffect(() => {
    if (userStore?.info.id) {
      setGetUserProfile(userStore);
      setPrevCreditRemaining(
        userStore.activeSubscription
          ? userStore.activeSubscription?.creditRemaining ?? 0
          : userStore.info.creditRemaining ?? 0
      );
      setCreditRemaining(
        userStore.activeSubscription
          ? userStore.activeSubscription?.creditRemaining ?? 0
          : userStore.info.creditRemaining ?? 0
      );
    }
  }, [userStore]);

 

  useEffect(() => {
    if (creditRemaining > prevCreditRemainingRef.current) {
      setIconColor("text-amber-500"); 
      setTimeout(() => setIconColor(""), 1000); 
      prevCreditRemainingRef.current = creditRemaining;
    } else if (creditRemaining < prevCreditRemainingRef.current) {
      setIconColor("text-theming-text-500 dark:text-theming-text-200");
      setTimeout(() => setIconColor(""), 1000);
      prevCreditRemainingRef.current = creditRemaining;
    } else {
      setIconColor("");
    }
  }, [creditRemaining]);

  const renderCreditInfo = () => {
    if (!saasSettings.activeCreditSystem) return null;

    const { activeSubscription } = userStore || {};
    const creditPercentage = activeSubscription?.creditPercentage ?? 0;
    const creditAllouedByMonth = activeSubscription?.creditAllouedByMonth ?? 0;

    if (creditRemaining) {
      return (
        <>
          <div className={` userNavbarDiv ${className}`}>
            <div
              className="relative w-full flex flex-col gap-1 justify-center"
              data-tooltip-id="remainingTooltip">
              <p className="text-center flex-row-center !text-xs relative">
                <Coins
                  className={`icon !mr-1 ml-2 transition-colors ease-linear duration-100  ${iconColor}`}
                />{" "}
                <FlipNumbers
                  height={14}
                  width={10}
                  perspective={1000}
                  color=""
                  background="transparent"
                  play
                  numberClassName="-ml-0.5"
                  numberStyle={{ color: "#000", letterSpacing: "0.05em" }}
                  numbers={String(creditRemaining)}
                />
              </p>
              {creditPercentage !== Infinity && activeSubscription && (
                <div>
                  <div
                    className={`${
                      creditPercentage <= 0
                        ? "progressTokenVoid"
                        : creditPercentage < 10
                        ? "progressToken bg-red-500"
                        : "progressToken"
                    }`}
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
            
            place="bottom"
            className="tooltip flex flex-col">
            {creditPercentage !== Infinity && activeSubscription ? (
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

    return null;
  };

  return <>{renderCreditInfo()}</>;
};
