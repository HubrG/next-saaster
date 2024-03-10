import { Feature, FeatureCategory, Plan, User, UserUsage } from "@prisma/client";

interface usFeatures extends UserUsage {
  user: User | null;
}



export interface iFeature extends Feature {
  category?: FeatureCategory | null;
  userUsage?: usFeatures[];
  Plans?: {
    plan: Plan;
  }[];
}
