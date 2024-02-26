"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { cn } from "@/src/lib/utils";
import { useSaasFeaturesCategoriesStore } from "@/src/stores/admin/saasFeatureCategoriesStore";
import useSaasPlansStore from "@/src/stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { PriceCardBuyButton } from "./PriceCardBuyButton";
import { PriceCardHeader } from "./PriceCardHeader";

export const PriceCardsFeaturesByCategories = () => {
  const { saasPlans } = useSaasPlansStore();
  const { saasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  useEffect(() => {
    useSaasPlansStore.getState().fetchSaasPlan();
    useSaasFeaturesCategoriesStore.getState().fetchSaasFeaturesCategories();
  },[]);
  const plans = saasPlans as iPlan[];
  const getRowClass = (index: number) => {
    return index % 2 === 0
      ? "bg-theming-background-100/0"
      : "bg-theming-background-100/0";
  };
  const { saasSettings } = useSaasSettingsStore();
  const plansFiltered = plans.filter(
    (plan) =>
      plan.active && !plan.deleted && plan.saasType === saasSettings.saasType
  );
  if (plansFiltered.length <= 1) return;
  if (!saasSettings?.displayFeaturesByCategory) return;
  return (
    <div
      className={cn(
        { "w-4/5": plansFiltered.length <= 2 },
        { "w-full": plansFiltered.length > 2 },
        "mx-auto"
      )}>
      <div className="w-full">
        <Table className="w-full rounded-default">
          <TableHeader>
            <TableRow className="!border-0">
              <TableHead></TableHead>
              {plansFiltered.map((plan) => (
                <TableHead key={plan.id} className="pb-5">
                  <Card
                    className={cn(
                      {
                        "card-popular": plan.isPopular || plan.isRecommended,
                      },
                      `price-card-wrapper  w-full  h-[90.3%] grid grid-rows-3 place-content-end justify-between items-start mt-10`
                    )}>
                    <PriceCardHeader plan={plan} saasSettings={saasSettings} />
                    <PriceCardBuyButton
                      className="mt-7 w-full z-[99999999]"
                      plan={plan}
                    />
                  </Card>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {saasFeaturesCategories
              .filter((e) => e.Features.find((e) => e.active))
              .map((category, index) => (
                <>
                  <TableRow
                    key={`${category.id}-header`}
                    className="border-t-0 border-b-0">
                    <TableCell
                      colSpan={plansFiltered.length + 1}
                      className=" rounded-default rounded-r-none text-left font-bold text-xl"
                      
                      >
                      <Goodline
                        className={cn({
                          "pt-5": index > 0,
                          "-mt-2": index === 0,
                        })}
                      />
                      <span  style={{
                            position: "sticky",
                            left: "10px",
                            zIndex: 1,
                          }}>{category.name}</span>
                    </TableCell>
                  </TableRow>
                  {category.Features.sort((a, b) => {
                    const positionA = a.position != null ? a.position : 0;
                    const positionB = b.position != null ? b.position : 0;
                    return positionA - positionB;
                  })
                    .filter((e) => e.active)
                    .map((feature, featureIndex) => (
                      <TableRow
                        key={feature.id}
                        className={`${getRowClass(
                          featureIndex
                        )} border-0 text-center`}>
                        <TableCell
                          className="w-3/12 text-left backdrop-blur-xl md:text-base text-sm"
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                          }}>
                          {feature.name}
                        </TableCell>
                        {plansFiltered.map((plan) => {
                          const featurePlan = plan.Features.find(
                            (e) =>
                              e.active &&
                              e.featureId === feature.id &&
                              e.planId == plan.id
                          );

                          return (
                            <TableCell key={plan.id} className="text-center">
                              {featurePlan?.active ? (
                                <>
                                  {featurePlan.creditAllouedByMonth &&
                                  featurePlan.creditAllouedByMonth > 0 ? (
                                    <p className="text-center font-semibold">
                                      {featurePlan.creditAllouedByMonth}{" "}
                                      <span className="opacity-50 font-normal">
                                        /mo
                                      </span>
                                    </p>
                                  ) : (
                                    <CheckCircle2 className="icon text-theming-text-500-second !mx-auto" />
                                  )}
                                </>
                              ) : (
                                <XCircle className="icon opacity-30 !mx-auto" />
                              )}
                              {plan.Features[0]
                                ? plan.Features.find((e) => e.active)?.active
                                : ""}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
