import { Feature, FeatureCategory } from "@prisma/client";
interface CategoryFeature extends Feature {
  feature: Feature;
}
export interface iFeaturesCategories extends FeatureCategory {
  Features: CategoryFeature[];
}
