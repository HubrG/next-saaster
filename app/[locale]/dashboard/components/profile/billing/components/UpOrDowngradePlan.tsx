"use client";
import { Button } from "@/src/components/ui/@shadcn/button";
import { Separator } from "@/src/components/ui/@shadcn/separator";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { useRouter } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";

type UpOrDowngradePlanProps = {
  userProfile: ReturnUserDependencyProps;
};
export const UpOrDowngradePlan = ({ userProfile }: UpOrDowngradePlanProps) => {
  const t = useTranslations("Dashboard.Components.Profile.Billing.UpOrDowngradePlan");
  const router = useRouter();

  
  return (
    <>
      <Button className="w-full" onClick={() => router.push("/pricing")}>
        {t("buttons.update-plan")}
      </Button>
      <Separator className="md:hidden mt-5 mb-5" />
    </>
  );
};
