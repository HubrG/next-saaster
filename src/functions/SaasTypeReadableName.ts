import { SaasTypes } from "@prisma/client";

export const SaasTypeReadableName = (saasType: SaasTypes) => {
  if (saasType === SaasTypes.MRR_COMPLEXE) {
    return "MRR complexe";
  }
  if (saasType === SaasTypes.MRR_SIMPLE) {
    return "MRR simple";
  }
  if (saasType === SaasTypes.CREDIT) {
    return "Credit";
  }
};
