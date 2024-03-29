import { cn } from '@/src/lib/utils';
import { motion } from "framer-motion";
import React from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-0 dark:p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-2 !bg-primary rounded-default z-[1] opacity-50 group-hover:opacity-100 blur-xl  transition duration-500",
          " bg-[radial-gradient(circle_farthest-side_at_0_100%,hsl(var(--background-500)),transparent),radial-gradient(circle_farthest-side_at_100%_0,hsl(var(--background-200)),transparent),radial-gradient(circle_farthest-side_at_100%_100%,hsl(var(--background-800)),transparent),radial-gradient(circle_farthest-side_at_0_0,hsl(var(--background-300)),#141316)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-2 rounded-default z-[1]",
          " bg-[radial-gradient(circle_farthest-side_at_0_100%,hsl(var(--background-500)),transparent),radial-gradient(circle_farthest-side_at_100%_0,hsl(var(--background-200)),transparent),radial-gradient(circle_farthest-side_at_100%_100%,hsl(var(--background-800)),transparent),radial-gradient(circle_farthest-side_at_0_0,hsl(var(--background-300)),#141316)]"
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
//           "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
