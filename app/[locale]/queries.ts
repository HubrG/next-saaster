import { prisma } from "@/src/lib/prisma";
import Stripe from "stripe";
import { MRRSPlan } from "@prisma/client";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const isEmptyUser = async () => {
  const users = await prisma.user.count();
  // If there are no users, return 0
  if (users === 0) {
    return true;
  }
  return false;
};

export const getAppSettings = async () => {
  const settings = await prisma.appSettings.findUnique({
    where: {
      id: "first",
    },
  });
  if (!settings) {
    const createFirst = await prisma.appSettings.create({
      data: {
        id: "first",
      },
    });
    return createFirst;
  }
  return settings;
};

export const getSaasSettings = async () => {
  const settings = await prisma.saasSettings.findUnique({
    where: {
      id: "first",
    },
  });
  if (!settings) {
    const createFirst = await prisma.saasSettings.create({
      data: {
        id: "first",
      },
    });
    return createFirst;
  }
  return settings;
};

export const getSaasMRRSPlans = async () => {
  const plans = await prisma.mRRSPlan.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSFeatures: true,
      StripeProduct: {
        include: {
          prices: true,
        },
      },
      coupons: {
        include: {
          coupon: true,
        },
      },
    },
  });
  return plans;
};

export const getCoupons = async () => {
  const coupons = await prisma.stripeCoupon.findMany({
    orderBy: {
      created: "asc",
    },
    include: {
      MRRSPlan: {
        include: {
          MRRSPlan: true,
        },
      },
    },
  });
  return coupons;
};

export const getSaasMRRSFeatures = async () => {
  const features = await prisma.mRRSFeature.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSPlans: {
        include: {
          plan: true,
        },
      },
      category: true,
    },
  });
  return features;
};

export const getSaasMRRSFeaturesCategories = async () => {
  const featuresCat = await prisma.mRRSFeatureCategory.findMany({
    orderBy: {
      position: "asc",
    },
    include: {
      MRRSFeatures: {
        include: {
          MRRSPlans: {
            include: {
              plan: true,
            },
          },
        },
      },
    },
  });
  return featuresCat;
};

export const getSaasStripeCoupons = async () => {
  const coupons = await prisma.stripeCoupon.findMany({
    orderBy: {
      created: "asc",
    },
    include: {
      MRRSPlan: {
        include: {
          MRRSPlan: true,
        },
      
      },
    },
  });
  return coupons;
};

export const getSaasMRRSPlanToFeature = async () => {
  const planToFeatures = await prisma.mRRSPlanToFeature.findMany({
    include: {
      plan: true,
      feature: true,
    },
    orderBy: {
      plan: {
        position: "asc", // Utilisez 'asc' pour un ordre croissant ou 'desc' pour décroissant
      },
    },
  });
  return planToFeatures;
};

export const stripeGetProducts = async () => {
  // const responseFalse = await stripe.products.list({
  //   active: false,
  //   limit: 100,
  // });
  // const responseTrue = await stripe.products.list({ active: true, limit: 100 });

  // const stripeProducts = responseTrue.data.concat(responseFalse.data);

  // // Transforme les produits Stripe en format compatible avec Prisma
  // const productData = stripeProducts.map((product: Stripe.Product) => ({
  //   id: product.id,
  //   active: product.active,
  //   created: product.created,
  //   default_price: product.default_price,
  //   description: product.description,
  //   livemode: product.livemode,
  //   metadata: JSON.stringify(product.metadata), // Serialize metadata as JSON string
  //   name: product.name,
  //   unit_label: product.unit_label,
  //   updated: product.updated,
  //   url: product.url,
  //   // prices: product.prices, // Vous devrez gérer cela séparément si c'est une relation ou un champ complexe
  // }));

  // // Suppression de toutes les données de la table StripeProduct
  // await prisma.stripeProduct.deleteMany();

  // // Ajout des nouvelles données avec createMany
  // await prisma.stripeProduct.createMany({
  //   data: productData,
  //   skipDuplicates: true, // Optionnel: ignore les enregistrements dupliqués basés sur la clé primaire
  // });

  const productData = await prisma.stripeProduct.findMany({
    orderBy: {
      created: "asc",
    },
    include: {
      prices: true,
      MRRSPlanRelation: true,
    },
  });

  return productData;
};

export const stripeGetPrices = async () => {
  //   const responseTrue = await stripe.prices.list({ active: true, limit: 100 });
  //   const responseFalse = await stripe.prices.list({ active: false, limit: 100 });

  //   const stripePrices = responseTrue.data.concat(responseFalse.data);

  //   // Transforme les prix Stripe en format compatible avec Prisma
  //   const priceData = stripePrices.map((price: Stripe.Price) => ({
  //     id: price.id,
  //     active: price.active,
  //     created: price.created,
  //     currency: price.currency,
  //     metadata: price.metadata,
  //     product: price.product,
  //     recurring: price.recurring,
  //     type: price.type,
  //     unit_amount: price.unit_amount,
  //     unit_amount_decimal: price.unit_amount_decimal,
  //   }));
  // console.log("coucou")
  //   // Suppression de toutes les données de la table StripePrice
  //   await prisma.stripePrice.deleteMany();

  //   // Ajout des nouvelles données avec createMany
  //   await prisma.stripePrice.createMany({
  //     data: priceData,
  //     skipDuplicates: true, // Optionnel: ignore les enregistrements dupliqués basés sur la clé primaire
  //   });

  const priceData = await prisma.stripePrice.findMany({});
  return priceData;
};
