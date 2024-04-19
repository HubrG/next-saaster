"use client";

import { PriceCardFeatures } from "@/app/[locale]/pricing/components/PriceCardFeatures";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { SimpleLoader, SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { toLower } from "lodash";
import { Check, CreditCard, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { formatDateRelativeToNow } from "../../../../../../src/helpers/functions/convertDate";
import {
  cancelSubscription,
  changePaymentMethod,
  reportUsage,
} from "../../../queries/queries";

type ProfileBillingProps = {};

export const ProfileBilling = ({}: ProfileBillingProps) => {
  const router = useRouter();
  const { saasSettings } = useSaasSettingsStore();
  const [userProfile, setUserProfile] = useState<ReturnUserDependencyProps>();
  const { userStore, isUserStoreLoading, fetchUserStore } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    setUserProfile(getUserInfos({ user: userStore }));
    if (!isUserStoreLoading) {
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isUserStoreLoading]);
 

  // Dans votre composant ProfileBilling.tsx
  const handleCancelOrRestartSubscription = async (
    action: "cancel" | "restart",
    subscriptionId: string,
    userEmail: string
  ) => {

    setIsLoading(true);
    const cancel = await cancelSubscription(
      subscriptionId,
      userProfile?.info.email ?? "",
      action
    );
    if (cancel.error) {
      toaster({
        type: "error",
        description: cancel.error,
      });
      setIsLoading(false);
      return;
    }
    setTimeout(async () => {
      setIsLoading(false);
      await fetchUserStore(userEmail ?? "");
      setRefresh(!refresh);
      toaster({
        type: "success",
        description:
          action === "cancel"
            ? "Your subscription has been canceled"
            : "Your subscription has been restarted",
      });
    }, 7000);
  };

  const handleGoToPricingPage = () => {
    router.push("/pricing");
  };

  const handlAddItem = async (subItem: string) => {
    const addItem = await reportUsage(subItem, 100000);
    if (addItem) {
      toaster({
        type: "success",
        description: "Item added",
      });
      fetchUserStore(userStore.email ?? "");
      setRefresh(true);
    }
  };

  const changePayMethod = async () => {
    setButtonLoading(true);
    const changePayMeth = await changePaymentMethod(
      userProfile?.info.customerId ?? ""
    );
    if (!changePayMeth) return;
    setButtonLoading(false);
    return router.push(changePayMeth as any);
  };

   if (!userProfile || userProfile?.isLoading) {
     return <SkeletonLoader type="card" />;
   }

  return (
    <div className="rounded-default relative flex flex-col w-full gap-2 items-start p-5 ">
      <SimpleLoader
        className={cn(
          { hidden: !isLoading },
          "!absolute top-[40%] z-50 left-[48%]"
        )}
      />
      {userProfile?.activeSubscription ? (
        <>
          <div
            className={cn(
              { blur: isLoading },
              "flex md:flex-row flex-col w-full justify-between items-start"
            )}>
            <div className="md:w-1/2 w-full flex flex-col  h-full text-left  pr-5">
              <div className="flex flex-col border rounded-default p-5">
                <h2 className="text-base mb-2">Your plan</h2>
                <h3 className="text-2xl flex flex-row  items-start justify-between w-full">
                  <span className="flex flex-col">
                    <span>
                      {userProfile?.activeSubscription?.planObject?.name}
                    </span>
                    <span className="text-xs font-normal">
                      {/* {userInfo?.subItem} */}
                      {userProfile?.activeSubscription.trialDaysRemaining &&
                        userProfile?.activeSubscription.trialDaysRemaining +
                          " trial days remaining, then..."}
                    </span>
                  </span>
                  <span className="flex flex-col">
                    {userProfile.activeSubscription.usageType !== "metered" ? (
                      <>
                        <span>
                          {convertCurrencyName(
                            userProfile.activeSubscription.currency,
                            "sigle"
                          )}
                          {
                            userProfile.activeSubscription
                              .priceWithDiscountAndQuantity
                          }
                        </span>
                        <span className="text-sm">
                          /{userProfile.activeSubscription.recurring ?? ""}
                          {userProfile.activeSubscription.quantity > 1 &&
                            "/" +
                              userProfile.activeSubscription.quantity +
                              " users"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {convertCurrencyName(
                            userProfile.activeSubscription.currency,
                            "sigle"
                          )}
                          {userProfile.activeSubscription.priceWithDiscount ??
                            0 / 100}
                        </span>
                        <span className="text-sm">
                          /per {userProfile.activeSubscription.meteredUnit}{" "}
                          {toLower(saasSettings.creditName ?? "credits")}
                        </span>
                        <span className="text-sm font-normal">
                          billed each{" "}
                          {userProfile.activeSubscription.recurring ?? ""}
                        </span>
                        <span className="text-sm font-normal">
                          (according to use)
                        </span>
                      </>
                    )}
                    {userProfile.activeSubscription.quantity > 1 && (
                      <span className="text-sm font-normal">
                        {convertCurrencyName(
                          userProfile.activeSubscription.currency,
                          "sigle"
                        )}
                        {userProfile.activeSubscription.priceWithDiscount +
                          " per user"}
                      </span>
                    )}
                  </span>
                </h3>
              </div>
              <ul className="mt-3">
                {userProfile.activeSubscription.coupon?.percent_off ||
                  (userProfile.activeSubscription.coupon?.amount_off && (
                    <li className="mt-2 text-theming-text-900  grid grid-cols-12">
                      <span className="col-span-1">
                        <Check className="icon text-theming-text-500-second mt-1" />
                      </span>
                      <span className=" col-span-11">
                        You save{" "}
                        {userProfile.activeSubscription?.coupon.percent_off
                          ? userProfile.activeSubscription?.coupon.percent_off +
                            "%"
                          : (userProfile.activeSubscription?.coupon
                              .amount_off ?? 0) /
                              100 +
                            `${convertCurrencyName(
                              userProfile.activeSubscription?.coupon.currency ??
                                undefined,
                              "sigle"
                            )} `}
                        on this plan
                      </span>
                    </li>
                  ))}

                {userProfile.activeSubscription.isTrial && (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Your trial ends at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userProfile.activeSubscription.trialDateEnd ?? 0,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                )}
                {userProfile.activeSubscription.isCanceling ? (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Your subscription will be canceled at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userProfile.activeSubscription.canceledActiveUntil ??
                            0,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                ) : (
                  <li className="mt-2 text-theming-text-900 grid grid-cols-12">
                    <span className="col-span-1">
                      <Check className="icon text-theming-text-500-second mt-1" />
                    </span>
                    <span className="flex flex-col col-span-11">
                      <span>Next invoice at :</span>
                      <span className="dark:text-theming-text-500-second !text-sm text-theming-text-500-second">
                        {formatDateRelativeToNow(
                          userProfile.activeSubscription.canceledActiveUntil ??
                            0,
                          "US"
                        )}
                      </span>
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <Goodline className="md:hidden" />
            <div className={"md:w-1/2 w-full flex flex-col  text-left  pl-5"}>
              <h2 className="text-base mb-2">Features</h2>
              <ul>
                {userProfile.activeSubscription.planObject && (
                  <PriceCardFeatures
                    plan={userProfile.activeSubscription.planObject}
                  />
                )}
              </ul>
            </div>
          </div>
          <Goodline />
          <div className="col-span-full  gap-2 flex md:flex-row flex-col justify-between w-full">
            <Button className="md:w-2/5 w-full" variant={"default"}>
              Downgrad or upgrade plan
            </Button>
            <div className="md:w-1/4 w-full">&nbsp;</div>
            <div className="md:w-2/3 w-full flex flex-row justify-end items-end">
              <ButtonWithLoader
                onClick={changePayMethod}
                type="button"
                disabled={buttonLoading}
                loading={buttonLoading}
                className="w-full !px-0 !pr-0"
                variant="link">
                <CreditCard className="icon mt-1" /> Change payment method
              </ButtonWithLoader>
              {!userProfile.activeSubscription.isCanceling ? (
                <>
                  <Button
                    data-tooltip-id="cancel-subscription"
                    disabled={isLoading}
                    className="w-full !px-0 !pr-0"
                    variant={"link"}
                    onClick={() =>
                      handleCancelOrRestartSubscription(
                        "cancel",
                        userProfile.activeSubscription.subscription?.id ?? "",
                        userStore.email ?? ""
                      )
                    }>
                    <XCircle className="icon text-red-500 mt-1" /> Cancel
                    subscription
                  </Button>
                </>
              ) : (
                <Button
                  data-tooltip-id="restart-subscription"
                  disabled={isLoading}
                  className="w-full"
                  variant={"link"}
                  onClick={() =>
                    handleCancelOrRestartSubscription(
                      "restart",
                      userProfile.activeSubscription.subscription?.id ?? "",
                      userStore.email ?? ""
                    )
                  }>
                  <RotateCcw className="icon text-green-500" /> Restart
                  subscription
                </Button>
              )}
            </div>
            <Tooltip id="cancel-subscription" place="top" className="tooltip">
              <span>
                Your subscription will be canceled at the end of the current
                period at{" "}
                {formatDateRelativeToNow(
                  userProfile.activeSubscription.canceledActiveUntil ?? 0,
                  "US"
                )}
                . You can continue to use the service until then and you
                won&apos;t be charged again.
              </span>
            </Tooltip>
            <Tooltip id="restart-subscription" place="top" className="tooltip">
              <span>
                Your subscription will be restarted and you will not be charged
                more.
              </span>
            </Tooltip>
            {/* <Button onClick={() => handlAddItem(userInfo?.subItem)}>
              Add item
            </Button> */}
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full items-start justify-center">
          <h2 className="text-2xl mb-2">No plan</h2>
          <Button onClick={handleGoToPricingPage}>Subscribe to a plan</Button>
        </div>
      )}
    </div>
  );
};
