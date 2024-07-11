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
import { iPlan } from "@/src/types/db/iPlans";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { PriceCardBuyButton } from "./PriceCardBuyButton";
import { PriceCardContactUsButton } from "./PriceCardContactUsButton";
import { PriceCardFeatureNameAndDesc } from "./PriceCardFeatureNameAndDesc";
import { PriceCardHeader } from "./PriceCardHeader";

export const PriceCardsFeaturesByCategories = ({
  customMode,
  children,
}: {
    customMode?: boolean;
    children?: React.ReactNode;
}) => {
  const { saasPlans } = useSaasPlansStore();
  const { saasFeaturesCategories } = useSaasFeaturesCategoriesStore();
  useEffect(() => {
    useSaasPlansStore.getState().fetchSaasPlan();
    useSaasFeaturesCategoriesStore.getState().fetchSaasFeaturesCategories();
  }, []);
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
        "mx-auto overflow-x-auto" // Ajout de overflow-x-auto pour permettre le défilement horizontal
      )}>
      <div className="w-full min-w-[600px]">
        {" "}
        {/* Ajout de min-width pour forcer le défilement */}
        <Table
          className="w-full rounded-default"
          style={{ tableLayout: "fixed" }}>
          <TableHeader>
            <TableRow className="!border-0">
              <TableHead></TableHead>

              {!customMode &&
                plansFiltered.map((plan) => (
                  <TableHead key={plan.id} className="pb-5">
                    <Card
                      className={cn(
                        {
                          "card-popular": plan.isPopular || plan.isRecommended,
                        },
                        `price-card-wrapper  w-full  h-[90.3%] grid place-content-end justify-between items-start`
                      )}>
                      <PriceCardHeader
                        plan={plan}
                        saasSettings={saasSettings}
                      />
                      {plan.isCustom ? (
                        <PriceCardContactUsButton className="mt-7 w-full z-[99999999]" />
                      ) : (
                        <PriceCardBuyButton
                          className="mt-7 w-full z-[999]"
                          plan={plan}
                        />
                      )}
                    </Card>
                  </TableHead>
                ))}
              {customMode && <>{children}</>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {saasFeaturesCategories
              .filter((e) =>
                e.Features.find((e) => e.active && !e.deleted && e.name)
              )
              .map((category, index) => (
                <>
                  <TableRow
                    key={`${category.id}-header`}
                    className="border-t-0 border-b-0">
                    <TableCell
                      colSpan={plansFiltered.length + 1}
                      className=" rounded-default rounded-r-none text-left font-bold text-xl">
                      <Goodline
                        className={cn({
                          "pt-5": index > 0,
                          "-mt-2": index === 0,
                        })}
                      />
                      <span
                        style={{
                          position: "sticky",
                          left: "10px",
                          zIndex: 1,
                        }}>
                        <PriceCardFeatureNameAndDesc
                          onlyFeatureCategory
                          id={category.id}
                          featName={category.name}
                          featCategory={category.name}
                        />
                      </span>
                    </TableCell>
                  </TableRow>
                  {category.Features.sort((a, b) => {
                    const positionA = a.position != null ? a.position : 0;
                    const positionB = b.position != null ? b.position : 0;
                    return positionA - positionB;
                  })
                    .filter((e) => e.active && !e.deleted && e.name)
                    .map((feature, featureIndex) => (
                      <TableRow
                        key={Math.random() + feature.id}
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
                          <span className="flex flex-row items-center gap-x-2">
                            {feature.description && (
                              <>
                                <Info
                                  className="icon"
                                  data-tooltip-id={feature.id}
                                />{" "}
                              </>
                            )}
                            <PriceCardFeatureNameAndDesc
                              onlyFeatureName
                              featName={feature.name}
                            />
                            <Tooltip
                              place="left"
                              className="tooltip"
                              id={feature.id}
                              opacity={1}>
                              <PriceCardFeatureNameAndDesc
                                onlyFeatureDesc
                                featName={feature.id}
                                featDesc={feature.description}
                              />
                            </Tooltip>
                          </span>
                        </TableCell>
                        {plansFiltered.map((plan) => {
                          const featurePlan = plan.Features.find(
                            (e) =>
                              e.active &&
                              e.featureId === feature.id &&
                              e.planId == plan.id
                          );
                          return (
                            <TableCell
                              key={plan.id}
                              className={cn(
                                { hidden: plan.isCustom },
                                "text-center"
                              )}>
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
