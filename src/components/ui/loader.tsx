import clsx from "clsx";
import { Loader2 } from "lucide-react";

export const Loader = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] ">
      <Loader2 className={clsx("animate-spin", className)} size={size} />
    </div>
  );
};
