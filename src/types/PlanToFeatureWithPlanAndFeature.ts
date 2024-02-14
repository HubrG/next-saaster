import { Feature, Plan, PlanToFeature } from "@prisma/client";

export type PlanToFeatureWithPlanAndFeature = PlanToFeature & {
  plan: Plan;
  feature: Feature;
};
