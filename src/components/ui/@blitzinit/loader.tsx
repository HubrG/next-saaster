import { cn } from "@/src/lib/utils";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { Goodline } from "../@aceternity/good-line";
import { Card } from "../@shadcn/card";
import { Skeleton } from "../@shadcn/skeleton";
import { DivFullScreenGradient } from "./layout-elements/gradient-background";

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
      <Loader2
        className={clsx("animate-spin text-theming-text-500", className)}
        size={size}
      />
    </div>
  );
};

export const SimpleLoader = ({
  size,
  style,
  className,
}: {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <Loader2
      style={style}
      className={clsx(
        "animate-spin icon flex justify-center items-center w-full",
        className
      )}
      size={size}
    />
  );
};

export const SkeletonLoader = ({
  type,
  className,
}: {
  type?: "card" | "card-page" | "rounded" | "simple-line" | "page";
  className?: string;
}) => {
  if (type === "card") {
    return (
      <div
        className={`flex items-center space-x-4 mt-16 w-full justify-center mx-auto`}>
        <div className={className}>
          <Skeleton className="h-24 w-1/3  rounded-default" />
          <div className="space-y-2 w-2/3">
            <Skeleton className="h-4 w-12/12 rounded-default" />
            <Skeleton className="h-4 w-10/12 rounded-default" />
            <Skeleton className="h-4 w-11/12 rounded-default" />
            <Skeleton className="h-4 w-12/12 rounded-default" />
          </div>
        </div>
      </div>
    );
  } else if (type === "card-page") {
    return (
      <Card
        className={`flex flex-col items-center space-x-4 mt-16 w-full justify-center mx-auto ${className}`}>
        <div className="flex flex-row w-full items-center justify-between">
          <div className="w-1/2 flex flex-row items-center ">
            <Skeleton className="h-8 w-8  rounded-full" />
            <Skeleton className="h-8 w-4/12 ml-10  rounded-default" />
          </div>
          <div className="w-1/2 flex justify-end">
            <Skeleton className="h-2 w-1/12 ml-10  rounded-default" />
          </div>
        </div>
        <Goodline />
        <div className="flex  items-center  space-x-4 mt-5 w-full justify-center mx-auto">
          <Skeleton className="h-24 w-1/3  rounded-default" />
          <div className="space-y-2 w-2/3">
            <Skeleton className="h-4 w-12/12 rounded-default" />
            <Skeleton className="h-4 w-10/12 rounded-default" />
            <Skeleton className="h-4 w-11/12 rounded-default" />
            <Skeleton className="h-4 w-12/12 rounded-default" />
          </div>
        </div>
      </Card>
    );
  } else if (type === "rounded") {
    return (
      <div
        className={`flex items-center space-x-4 mt-16 w-full justify-center mx-auto ${className}`}>
        <Skeleton className={`${className} rounded-full`} />
      </div>
    );
  } else if (type === "simple-line") {
    return (
      <div
        className={`flex items-center space-x-4 w-full justify-start ${className}`}>
        <Skeleton className="h-4 w-1/3 mx-auto  rounded-default" />
      </div>
    );
  } else if (type === "page") {
    return (
      <>
        <DivFullScreenGradient gradient="gradient-to-r" />
        <div
          className={`flex items-center space-x-4 mt-16 w-full justify-center mx-auto ${className}`}>
          <Skeleton className="h-24 w-1/3 rounded-default" />
          <div className="space-y-2 w-2/3">
            <Skeleton className="h-4 w-full rounded-default" />
            <Skeleton className="h-4 w-10/12 rounded-default" />
            <Skeleton className="h-4 w-11/12 rounded-default" />
            <Skeleton className="h-4 w-full rounded-default" />
          </div>
        </div>
      </>
    );
  }
  return <Loader noHFull />;
};
