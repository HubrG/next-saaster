"use client";

import { PriceCardFeatures } from "@/app/[locale]/pricing/components/PriceCardFeatures";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { Button } from "@/src/components/ui/button";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { useUserStore } from "@/src/stores/userStore";
import { iPlan } from "@/src/types/db/iPlans";
import { Box, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PurchaseAction } from "./@ui/Action";

export const ProfilePurchase = () => {
  const t = useTranslations("Dashboard.Components.Profile.Purchases");
  const formater = useFormatter();
  const now = useNow({
    updateInterval: 1000 * 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const noOneTimePayments = (userProfile.oneTimePayments?.length ?? 0) === 0;
  const sortedPayments = userProfile.oneTimePayments?.sort((a, b) => {
    const dateA =
      a.createdAt != null ? new Date(a.createdAt).getTime() : Date.now();
    const dateB =
      b.createdAt != null ? new Date(b.createdAt).getTime() : Date.now();
    return dateB - dateA;
  });

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedPayments = sortedPayments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex flex-col gap-5 mt-14">
      {sortedPayments?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <h2 className="text-xl">{t("no-purchase-history")}</h2>
          <p className="text-center">{t("no-purchase-history-description")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-12  justify-between items-center mt-5">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 md:col-span-2 col-span-4 select-none ">
              <ChevronLeft className="icon" />
              {t("previous")}
            </Button>
            <span className="md:col-span-8 col-span-4">
              {currentPage}/
              {Math.ceil((sortedPayments?.length ?? 0) / itemsPerPage)}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={
                currentPage * itemsPerPage >= (sortedPayments?.length ?? 0)
              }
              className="flex items-center justify-between gap-2 md:col-span-2 col-span-4  select-none">
              {t("next")}
              <ChevronRight className="icon" />
            </Button>
          </div>

          {paginatedPayments?.map((payment) => {
            return (
              <div
                key={payment.id}
                className="rounded-default flex flex-col border items-center shadow w-full gap-2 p-5 ">
                <div className="flex md:flex-row items-center flex-col w-full justify-between mb-0">
                  <div>
                    <h2 className="font-bold text-xl">
                      {payment.metadata && payment.metadata.name
                        ? payment.metadata.name
                        : payment.price?.productRelation?.PlanRelation?.name
                        ? payment.price.productRelation.PlanRelation.name
                        : t("no-name")}
                    </h2>
                  </div>
                  <div className="flex flex-col justify-end items-center gap-x-5">
                    <span className="flex flex-row gap-2 items-center justify-end w-full">
                      {formater.number(payment.amount / 100, {
                        style: "currency",
                        currency: payment.currency,
                      })}
                      <CheckCircle className="icon text-green-500 !mr-0" />
                    </span>
                    <span className="flex flex-row text-xs items-center gap-1">
                      {formater.relativeTime(
                        payment.createdAt ?? Date.now(),
                        now
                      )}
                    </span>
                  </div>
                </div>
                {payment.price?.productRelation?.PlanRelation && (
                  <div className="w-full border-t pt-5 border-dashed flex flex-row justify-evenly text-left  ">
                    <div className=" w-1/2 border-r flex flex-col text-left ">
                      <h2 className="text-lg mb-2 flex-row-center">
                        <Box className="icon" /> {t("features")}
                      </h2>
                      <PriceCardFeatures
                        plan={
                          payment.price?.productRelation?.PlanRelation as iPlan
                        }
                      />
                    </div>
                    <div className="w-1/2 p-5">
                      <PurchaseAction />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
