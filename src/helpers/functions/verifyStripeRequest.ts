export function verifyStripeRequest(stripeSignature: string) {
  return stripeSignature === process.env.STRIPE_WEBHOOK_SECRET;
}