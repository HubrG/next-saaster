export const isStripeSetted = () => {
  if 
    ((
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SIGNIN_SECRET) &&
    process.env.STRIPE_SIGNIN_SECRET.length > 4 &&
    process.env.STRIPE_SECRET_KEY.length > 4
  ) {
    return true;
  } else return false
};
