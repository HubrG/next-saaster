"use client";
import { useFeatureCategoryStore } from "@/src/stores/featureCategoryStore";

export const ManagePricing = () => {
  const { pricingFeatCat } = useFeatureCategoryStore();

  return <div>ManagePricing</div>;
};
