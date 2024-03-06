import { Feature, FeatureCategory } from "@prisma/client";


export interface iFeaturesCategories extends FeatureCategory {
  Features: Feature[];
}
