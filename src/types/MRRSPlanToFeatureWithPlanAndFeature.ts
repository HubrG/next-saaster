import { MRRSFeature, MRRSPlan, MRRSPlanToFeature } from "@prisma/client";

export type MRRSPlanToFeatureWithPlanAndFeature = MRRSPlanToFeature & {
  plan: MRRSPlan;
  feature: MRRSFeature;
};
