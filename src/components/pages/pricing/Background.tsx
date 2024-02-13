"use client";
import { BackgroundGradient } from "@/src/components/ui/@aceternity/background-gradient";
import Image from "next/image";
type Props = {
  children: React.ReactNode;
};
export function BackgroundGrad({ children }: Props) {
  return (
    <div>
      <BackgroundGradient className="rounded-default max-w-sm p-2 sm:p-10 bg-white bg-theming-background-50 dark:border border-border/50">
        {children}
      </BackgroundGradient>
    </div>
  );
}
