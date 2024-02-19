import { Plan } from "@prisma/client";

/** ManageClashes.ts
 * @param {object} data
 * @param {string} lastChanged
 * @returns {object} data
 * @description This function manages clashes between the pricing settings.
 * @example
 * const manageClashes = require("src/components/features/pages/admin/saas/pricing-settings/%40subsections/%40subcomponents/manage-pricing/%40subcomponents/%40functions/ManageClashes.ts");
 * const data = manageClashes(data, lastChanged);
 * @todo Add more clashes
*/

type PartialPlan = Partial<Plan>;

export const manageClashes = (data: PartialPlan, lastChanged: string) => {
  if (lastChanged === "isFree" && data.isFree) {
    data.isCustom = false;
    data.isTrial = false;
  } else if (lastChanged === "isCustom" && data.isCustom) {
    data.isFree = false;
  }
  if (lastChanged === "isPopular" && data.isPopular) {
    data.isRecommended = false;
  } else if (lastChanged === "isRecommended" && data.isRecommended) {
    data.isPopular = false;
  }
  if (lastChanged === "isTrial" && data.isTrial) {
    data.isFree = false;
    data.isCustom = false;
  }
  if (lastChanged === "isCustom" && data.isCustom) {
    data.isFree = false;
    data.isTrial = false;
  }
  return data as Plan;
};
