"use client";
import currenciesData from "@/src/jsons/currencies.json";
import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iPlan } from "@/src/types/iPlans";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CheckoutButton } from "../../../../app/[locale]/pricing/components/old/CheckoutButton";
import { cn } from "../../../lib/utils";
interface Currency {
  sigle: string;
  name: string;
}

interface Currencies {
  [key: string]: Currency;
}
export const HoverEffect = ({
  items,
  className,
}: {
  items: iPlan[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { isYearly } = usePublicSaasPricingStore();
  const { saasSettings } = useSaasSettingsStore();
  const currencies: Currencies = currenciesData as Currencies;

  return (
    <>
      {items.map((item, idx) => (
        <div
          key={item?.id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/50 dark:bg-primary/10  block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.name}</CardTitle>
            <h3 className="!text-primary-foreground mt-5">
              {isYearly ? item.yearlyPrice : item.monthlyPrice}{" "}
              {saasSettings.currency
                ? currencies[saasSettings.currency]?.sigle
                : ""}
              /{isYearly ? "year" : "month"}
            </h3>
            <CardDescription>{item.description}</CardDescription>
            <CheckoutButton plan={item} />
          </Card>
        </div>
      ))}
    </>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden dark:bg-primary/5 bg-primary-foreground/5 border-2 border-dashed dark:border-solid dark:border border-primary-foreground/30 border-opacity-50 dark:border-secondary/[0.2] group-hover:border-primary-700 relative z-50",
        className
      )}>
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h1
      className={cn(
        "!text-primary-foreground dark:text-primary font-bold tracking-wide mt-4",
        className
      )}>
      {children}
    </h1>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 !text-primary-foreground tracking-wide leading-relaxed text-sm",
        className
      )}>
      {children}
    </p>
  );
};
