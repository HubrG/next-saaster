/**
 * This file contains the SaasTypes enum and the SaasTypeReadableName function
 * which returns the readable name of the SaasType.
 * This file is used in the ManagePricing component.
 * @packageDocumentation
 * @module SaasTypes
 * @category Components
 * @subcategory Features
 */
import { SaasTypes } from "@prisma/client";

export const SaasTypeReadableName = (saasType: SaasTypes) => {
  switch (saasType) {
    case SaasTypes.PAY_ONCE:
      return "Pay once";
    case SaasTypes.MRR_SIMPLE:
      return "Recurring (MRR)";
    case SaasTypes.METERED_USAGE:
      return "Usage";
    case SaasTypes.PER_SEAT:
      return "Per seat";
    case SaasTypes.CUSTOM:
      return "Custom";
    // case SaasTypes.CUSTOM_AMOUNT:
    //   return "User-defined price";
  }
};

export const SaasTypeList = [
  {
    name: "Pay once",
    value: SaasTypes.PAY_ONCE,
    description:
      "This straightforward model requires customers to make a one-time payment to gain access to all the software’s features. There are no recurring charges or usage limits. Customers enjoy full access to the software's capabilities from the outset. This model is ideal for businesses looking for a simple, upfront cost without the worry of recurring payments. It is particularly attractive for users who prefer complete access to all features without restrictions or the need to upgrade plans.",
  },
  {
    name: "Simple recurring (MRR)",
    value: SaasTypes.MRR_SIMPLE,
    description:
      "In this model, customers are billed on a recurring monthly basis, with several tiers available, each offering a different set of features and usage limits. Lower tiers may offer basic features with limited usage, while higher tiers include additional or premium features with higher or unlimited usage caps. This model is suitable for businesses seeking predictable billing and the ability to choose a plan that aligns with their specific needs. It encourages upgrading to higher tiers as business requirements grow.",
  },
  {
    name: "Usage based",
    value: SaasTypes.METERED_USAGE,
    description:
      "This model operates on a usage-based billing system where customers are billed based on the actual usage of services or features. It offers high flexibility, allowing users to scale their usage up or down based on their needs and only pay for what they use. Ideal for businesses with fluctuating demands, this model ensures customers are billed precisely for the resources consumed, promoting efficiency and cost-effectiveness.",
  },
  {
    name: "Per seat",
    value: SaasTypes.PER_SEAT,
    description:
      "This model charges customers based on the number of users or seats accessing the software. It is particularly suitable for businesses with a large number of users who require access to the software. It offers a predictable and scalable pricing structure, allowing businesses to add or remove users as needed. This model is ideal for businesses seeking a straightforward and predictable pricing model based on the number of users accessing the software. It encourages businesses to scale their operations without worrying about additional costs for new users.",
  },
  {
    name: "Fine tuned custom pricing (development required)",
    value: SaasTypes.CUSTOM,
    description:
      "This model is tailored to meet the specific needs of individual customers. It offers a high degree of flexibility, allowing businesses to customize their pricing based on unique requirements, features, and usage patterns. This model is ideal for businesses with complex needs that cannot be met by standard pricing models. It encourages businesses to work closely with the vendor to design a pricing model that aligns with their specific requirements.",
  },
];
