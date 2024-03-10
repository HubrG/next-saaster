"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Card } from "../../card";

type Props = {
  children: React.ReactNode;
  handleChange?: (e: any) => void;
  checked: boolean;
  id: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const SwitchWrapper = ({
  children,
  id,
  icon,
  checked,
  handleChange,
  disabled = false,
}: Props) => {
  const handleClick = (e: any) => {
    if (e.target.tagName === "LABEL") {
      return;
    }
    document.getElementById(id)?.click();
  };
  return (
    <Card
      className="switch-wrapper "
      data-tooltip-id={`tooltip-${id}`}
      onClick={(e) => handleClick(e)}>
      {/* <div className="row-span-1">{icon}</div> */}
      <Label htmlFor={id}></Label>
      <div>
        {icon}
        <span>{children}</span>
      </div>
      {/* <Goodline className="row-span-1" /> */}
      <Switch
        onCheckedChange={handleChange}
        disabled={disabled}
        id={id}
        checked={checked}
      />
    </Card>
  );
};
