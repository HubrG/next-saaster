import { PriceCardsFeaturesByCategories } from "./PriceCardFeaturesByCategories";
import { PriceCardsSimple } from "./PriceCardsSimple";
import { SwitchRecurrence } from "./SwitchRecurrence";

export const DynamicPriceCards = () => {
  return (
    <>
      {/* Display recurrence if not "Pay once" or "Metered" business model */}
      <SwitchRecurrence
      // yearlypercent_off={20}
      // -> display a percentage off for yearly payment
      />
      <PriceCardsSimple />
      {/* If « display features by categories » is activated » */}
      <PriceCardsFeaturesByCategories />
    </>
  );
};
