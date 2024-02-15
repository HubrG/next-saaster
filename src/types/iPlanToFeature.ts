import { PlanToFeature } from "@prisma/client";
import { iFeature } from "./iFeatures";
import { iPlan } from "./iPlans";

export interface iPlanToFeature extends PlanToFeature {
  feature: iFeature;
  plan: iPlan;
}
