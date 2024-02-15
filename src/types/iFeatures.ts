import { Feature } from "@prisma/client";
import { iPlan } from "./iPlans";
import { iUsers } from "./iUsers";

export interface iFeature extends Feature {
  Plans: iPlan[];
  UserFeatures: iUsers[];
}
