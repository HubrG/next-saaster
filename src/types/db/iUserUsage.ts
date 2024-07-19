import { Feature, PlanToFeature, User, UserUsage } from "@prisma/client";

export interface iUserUsage extends UserUsage {
  feature?: Feature | null;
  user: User;
  planToFeature?: PlanToFeature;
} 
