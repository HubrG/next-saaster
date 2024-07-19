import { Feature, Plan, PlanToFeature, UserUsage } from "@prisma/client";

export interface iPlanToFeature extends PlanToFeature {
  feature: Feature;
  plan: Plan;
  planToFeatureUsage?: UserUsage[];
}
