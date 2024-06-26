import { cn } from "@/src/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md dark:bg-primary/10 bg-theming-background-100", className)}
      {...props}
    />
  )
}

export { Skeleton }
