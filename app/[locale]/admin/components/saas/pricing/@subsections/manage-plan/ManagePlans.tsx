"use client";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { Suspense } from "react";
import { AddPlan } from "./plans/AddPlan";
import { PlansList } from "./plans/PlansList";

export const ManagePlans = () => {
  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-center">
        <AddPlan />
      </div>
      <Suspense fallback={<Loader noHFull />}>
        <PlansList />
      </Suspense>
    </>
  );
};
