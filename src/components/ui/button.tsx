import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex md:items-center justify-center whitespace-nowrap push-effect rounded-md md:text-base text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:opacity-90 disabled:opacity-50 disabled !break-words  whitespace-normal !leading-[1]",
  {
    variants: {
      variant: {
        default:
          " font-semibold text-theming-text-50 dark:text-theming-text-900 dark:bg-theming-text-300 bg-theming-text-500 hover:bg-theming-text-500/90 ",
        destructive:
          "bg-destructive text-white  hover:text-theming-text-50 hover:bg-destructive/90  dark:hover:text-theming-text-900",
        outline:
          "border dark:border-input border-input/20 hover:bg-accent hover:text-accent-foreground",
        ghostDestructive:
          "hover:bg-destructive hover:text-theming-text-50 dark:hover:text-theming-text-900",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-text-800 font-normal underline-offset-4 underline decoration-theming-text-200 decoration-dashed",
        tooltip: "!px-0 !mx-0",
        second:
          "bg-theming-background-500-second dark:!text-theming-text-900-second font-bold !text-theming-text-50-second",
      },
      size: {
        default: "md:h-10 h-auto px-4 py-2",
        sm: "md:h-9   rounded-md px-4 py-1",
        lg: "md:h-11   rounded-md px-8",
        icon: "md:h-10  w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
