"use client";
import { Button } from "@/src/components/ui/@shadcn/button";
import { useRouter } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";

type PriceCardContactUsButtonProps = {
  className?: string;
};

export const PriceCardContactUsButton = ({
  className,
}: PriceCardContactUsButtonProps) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/contact");
  };

  const t = useTranslations("Pricing.Components.PriceCardContactUsButton");
  return (
    <Button
      variant={"second"}
      className={`w-full z-0 text-sm ${className}`}
      onClick={handleRedirect}>
      {t("contact-us")}
    </Button>
  );
};
