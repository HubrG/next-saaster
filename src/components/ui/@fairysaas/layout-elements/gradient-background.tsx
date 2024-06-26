import { GradientsList } from "@/src/types/ui/gradientsList";

type DivFullScreenGradientProps = {
  gradient: GradientsList;
  className?: string;
};
export const DivFullScreenGradient = ({
  gradient,
  className,
}: DivFullScreenGradientProps) => {
  return (
    <div
      className={`absolute-fullscreen-div hidden dark:block ${gradient} ${className}`}></div>
  );
};
