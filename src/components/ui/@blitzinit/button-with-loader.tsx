"use client";
import { Button } from "../@shadcn/button";
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
    | "second"
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
/**
 * Button with loader
 * @param {string} children 
 * @param {boolean} loading (optional) - Loading state
 * @param {string} className (optional) - Custom class
 * @param {string} type (optional) - Button type (button, submit, reset)
 * @param {boolean} disabled (optional) - Button disabled state
 * @param {string} variant (optional) - Button variant (default, destructive, outline, ghostDestructive, secondary, ghost, second, link, tooltip)
 * @param {string} size (optional) - Button size (sm, default, lg)
 */
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
