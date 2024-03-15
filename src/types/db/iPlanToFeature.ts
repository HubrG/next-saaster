import { Feature, Plan, PlanToFeature } from "@prisma/client";

export interface iPlanToFeature extends PlanToFeature {
  feature: Feature;
  plan: Plan;
}
