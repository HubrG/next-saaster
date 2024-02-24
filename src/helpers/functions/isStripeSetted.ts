import { env } from "../../lib/zodEnv";

export const isStripeSetted = () => {
  if (env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
    return true;
  } else return false;
};
