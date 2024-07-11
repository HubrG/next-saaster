import { env } from "@/src/lib/zodEnv";

export function verifyStripeRequest(stripeSignature: string) {
  return stripeSignature === env.STRIPE_WEBHOOK_SECRET;
}