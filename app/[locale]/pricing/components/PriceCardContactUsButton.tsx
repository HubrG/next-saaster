"use client";
import { Button } from "@/src/components/ui/button";
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
      className={`w-full -mt-12 text-sm ${className}`}
      onClick={handleRedirect}>
      {t("contact-us")}
    </Button>
  );
};
