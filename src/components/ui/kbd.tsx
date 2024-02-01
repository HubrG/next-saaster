import { cn } from "@/src/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Keybd = ({ children, className }: Props) => {
  return (
    <kbd
      className={cn(
        `${className ? className : "ml-2"} px-1 mr-0.5 py-0.5 text-xs font-semibold text-primary-foreground bg-secondary border border-secondary rounded-default dark:bg-primary-foreground dark:text-primary dark:border-primary-foreground`
      )}>
      {children}
    </kbd>
  );
};
