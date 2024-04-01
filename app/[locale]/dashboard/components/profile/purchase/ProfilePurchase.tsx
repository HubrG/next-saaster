"use client";

import { PriceCardFeatures } from "@/app/[locale]/pricing/components/PriceCardFeatures";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { convertCurrencyName } from "@/src/helpers/functions/convertCurencies";
import { formatDateWithFns } from "@/src/helpers/functions/convertDate";
import { useUserStore } from "@/src/stores/userStore";
import { iPlan } from "@/src/types/db/iPlans";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { PurchaseAction } from "./@ui/Action";

type ProfilePurchaseProps = {};

export const ProfilePurchase = ({}: ProfilePurchaseProps) => {
  const { userStore, isUserStoreLoading } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] =
    useState<ReturnUserDependencyProps | null>();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (!isUserStoreLoading) {
      setUserProfile(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isUserStoreLoading]);
  if (!userProfile || userProfile?.isLoading) {
     return <SkeletonLoader type="card" />;
  }

  return (
    <div className="flex flex-col gap-5 mt-14">
      {(userProfile.oneTimePayments?.filter((e) => !e.priceId).length ?? 0) ===
        0 ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <h2 className="text-xl">No purchase history</h2>
          <p className="text-center">
            You have not purchased any product yet. Go to the pricing page to
            make a purchase.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {userProfile.oneTimePayments
            ?.filter((e) => !e.priceId)
            .sort((a, b) => {
              const dateA =
                a.createdAt != null
                  ? new Date(a.createdAt).getTime()
                  : Date.now();
              const dateB =
                b.createdAt != null
                  ? new Date(b.createdAt).getTime()
                  : Date.now();
              return dateB - dateA;
            })
            .map((payment) => {
              return (
                <div
                  key={payment.id}
                  className="rounded-default flex flex-col border items-center shadow w-full gap-2 p-5 ">
                  <div className="flex flex-row w-full justify-between mb-0">
                    <div>
                      <h2 className="font-bold text-xl">
                        Refill
                      </h2>
                    </div>
                    <div className="flex flew-row items-center gap-x-5">
                      <span>
                        {convertCurrencyName(payment.currency, "sigle")}
                        {payment.amount / 100}
                      </span>
                      <span className="flex flex-row items-center gap-1">
                        <CheckCircle className="icon text-green-500 self-center mt-0.5" />
                        {formatDateWithFns(
                          new Date(payment.createdAt ?? Date.now()),
                          "US"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      
      )}
      {userProfile.oneTimePayments
        ?.filter((e) => e.priceId)
        .sort((a, b) => {
          const dateA =
            a.createdAt != null ? new Date(a.createdAt).getTime() : Date.now();
          const dateB =
            b.createdAt != null ? new Date(b.createdAt).getTime() : Date.now();
          return dateB - dateA;
        })
        .map((payment) => {
          return (
            <div
              key={payment.id}
              className="rounded-default flex flex-col border items-center shadow w-full gap-2  p-5 ">
              <div className="flex flex-row w-full justify-between mb-3">
                <div>
                  <h2 className="font-bold text-xl">
                    {payment.price?.productRelation?.PlanRelation?.name}
                  </h2>
                </div>
                <div className="flex flew-row items-center gap-x-5">
                  <span>
                    {convertCurrencyName(payment.currency, "sigle")}
                    {payment.amount / 100}
                  </span>
                  <span className="flex flex-row items-center gap-1">
                    <CheckCircle className="icon text-green-500 self-center mt-0.5" />
                    {formatDateWithFns(
                      new Date(payment.createdAt ?? Date.now()),
                      "US"
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full border-t pt-5 border-dashed flex flex-row justify-evenly text-left  pl-5">
                <div className=" w-1/2 border-r flex flex-col justify-evenly text-left  pl-5">
                  <h2 className="text-base mb-2">Features</h2>
                  {payment.price?.productRelation?.PlanRelation && (
                    <PriceCardFeatures
                      plan={
                        payment.price?.productRelation?.PlanRelation as iPlan
                      }
                    />
                  )}
                </div>
                <div className="w-1/2 p-5">
                  <PurchaseAction />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
