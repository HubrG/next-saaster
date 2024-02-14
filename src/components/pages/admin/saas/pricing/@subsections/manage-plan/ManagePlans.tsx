"use client";
import { Loader } from "@/src/components/ui/loader";
import { Suspense, useState } from "react";
import { AddPlan } from "./plans/AddPlan";
import { PlansList } from "./plans/PlansList";
import { SyncFromStripe } from "./plans/SyncFromStripe";

export const ManagePlans = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-center">
        <AddPlan />
        <SyncFromStripe setLoading={setLoading} />
      </div>
      <Suspense fallback={<Loader noHFull />}>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader noHFull />
          </div>
        ) : (
          <PlansList />
        )}
      </Suspense>
    </>
  );
};
