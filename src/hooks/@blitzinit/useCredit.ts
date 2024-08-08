import { toaster } from "../../components/ui/@blitzinit/toaster/ToastConfig";
import { addUserUsage } from "../../helpers/db/userUsage.action";
import { chosenSecret } from "../../helpers/functions/verifySecretRequest";
import { handleError } from "../../lib/error-handling/handleError";
import { useUserInfoStore } from "../../stores/userInfoStore";
type useCreditProps = {
  increment?: boolean;
  decrement?: boolean;
  credits: number;
  type: "Stripe metered usage" | "Credit";
  quantityForFeature?: number;
  featureAlias?: string;
};
/**
 * @description - This hook is used to consume credit for a feature (or not) or for Stripe metered usage. The credits are updated in the database and in the use store (user view)
 * @param increment - Increment the credit
 * @param decrement - Decrement the credit
 * @param credits - The amount of credit to increment or decrement
 * @param type - The type of credit to consume
 * @param quantityForFeature - The quantity of the feature
 * @param featureAlias - The alias of the feature to consume credit for
 * @returns boolean. True if the credit was consumed or incremented and if user has been authorized to consume credit ; false if not
 */
export const useCredit = async ({
  credits,
  quantityForFeature,
  type,
  increment,
  decrement,
  featureAlias,
}: useCreditProps) => {
  const { decrementCredit, incrementCredit } = useUserInfoStore.getState();
  if (quantityForFeature && !featureAlias) {
    toaster({
      description:
        "Feature alias is required when consuming credit for a feature",
      type: "error",
    });
    return false;
  } else if (credits <= 0) {
    toaster({
      description: "Credit must be greater than 0",
      type: "error",
    });
    return false;
  } else if (increment && decrement) {
    toaster({
      description: "Increment and decrement cannot be true at the same time",
      type: "error",
    });
    return false;
  }
  if (decrement) {
    const click = await addUserUsage({
      featureAlias: featureAlias || undefined,
      consumeCredit: type === "Credit" ? credits : undefined,
      consumeStripeMeteredCredit:
        type === "Stripe metered usage" ? credits : undefined,
      quantityForFeature: quantityForFeature || undefined,
      secret: chosenSecret(),
    });
    const { error, message } = handleError(click);
    if (error) {
      toaster({
        description: message,
        type: "error",
      });
      return false;
    } else {
      decrementCredit(credits);
      return true;
    }
  } else if (incrementCredit) {
    incrementCredit(credits);
    return true;
  }
};
