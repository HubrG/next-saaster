"use client";
import { Button } from "./button";
import { SimpleLoader } from "./loader";
type ButtonWithLoaderProps = {
  size?: "sm" | "default" | "lg";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghostDestructive"
    | "secondary"
    | "ghost"
    | "link"
    | "tooltip";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  // reset
  onClick?: () => void;
  children: React.ReactNode;
};
export const ButtonWithLoader = ({
  children = "Button",
  loading = false,
  className,
  type = "button",
  disabled = false,
  variant = "default",
  size,
  onClick,
}: ButtonWithLoaderProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={className}
      type={type}
      disabled={disabled}>
      {loading && <SimpleLoader />}
      {children}
    </Button>
  );
};
