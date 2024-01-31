import { AddFeature } from "./@subcomponents/AddFeature";
import { FeaturesList } from "./@subcomponents/FeaturesList";
import { FeaturesOptions } from "./@subcomponents/FeaturesOptions";

export const Features = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div>
          <AddFeature />
        </div>
        <div><FeaturesOptions /></div>
      </div>
      <FeaturesList />
    </>
  );
};
