"use client";
import { Badge } from "@/src/components/ui/@shadcn/badge";

type PriceCardBadgeProps = {
  text: string | null;
};

export const PriceCardBadge = ({ text }: PriceCardBadgeProps) => {
 if (text === null) return null;
  return (
    <Badge className="mx-auto z-50 md:-mt-[3.645rem] -mt-[3rem]  !shadow-none !hover:opacity-100 mb-6 bg-theming-background-500-second text-sm text-theming-text-50-second hover:bg-theming-background-500-second dark:text-theming-text-900-second">
      {text}
    </Badge>
  );
};
