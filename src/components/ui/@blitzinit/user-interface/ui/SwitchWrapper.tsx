"use client";
import { Label } from "@/src/components/ui/@shadcn/label";
import { Switch } from "@/src/components/ui/@shadcn/switch";
import { cn } from "@/src/lib/utils";
import { Card } from "../../../@shadcn/card";
import { SimpleLoader } from "../../loader";

type Props = {
  children: React.ReactNode;
  handleChange?: (e: any) => void;
  checked: boolean;
  id: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export const SwitchWrapper = ({
  children,
  id,
  icon,
  className,
  checked,
  handleChange,
  loading,
  disabled = false,
}: Props) => {
  const handleClick = (e: any) => {
    if (e.target.tagName === "LABEL") {
      return;
    }
    document.getElementById(id)?.click();
  };

  const handleSwitchChange = async (e: any) => {
    if (handleChange) {
      handleChange(e);
    }
  };

  return (
    <Card
      aria-disabled={disabled || loading}
      className={cn(`switch-wrapper ${className}`)}
      data-tooltip-id={`tooltip-${id}`}
      onClick={(e) => handleClick(e)}>
      {/* <div className="row-span-1">{icon}</div> */}
      <Label htmlFor={id}></Label>
      <div>
        {icon}
        <span>{children}</span>
      </div>
      {/* <Goodline className="row-span-1" /> */}
      {loading ? (
        <SimpleLoader className="!ml-4" />
      ) : (
        <Switch
          onCheckedChange={handleSwitchChange}
          disabled={disabled || loading}
          id={id}
          checked={checked}
        />
      )}
    </Card>
  );
};
