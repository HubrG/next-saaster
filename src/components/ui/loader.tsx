import { cn } from "@/src/lib/utils";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: number;
  className?: string;
  noHFull?: boolean;
};
export const Loader = ({ size, className, noHFull }: LoaderProps) => {
  return (
    <div
      className={cn(
        { "h-[90vh]": !noHFull, "h-20": noHFull },
        "flex justify-center items-center w-full"
      )}>
      <Loader2 className={clsx("animate-spin", className)} size={size} />
    </div>
  );
};

export const SimpleLoader = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Loader2 className={clsx("animate-spin icon", className)} size={size} />
  );
};
