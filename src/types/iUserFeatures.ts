import { UserFeature } from "@prisma/client";
import { iFeature } from "./iFeatures";
import { iPlan } from "./iPlans";
import { iUsers } from "./iUsers";

export interface iUserFeatures extends UserFeature {
  user: iUsers;
  feature: iFeature;
  plan: iPlan;
}
