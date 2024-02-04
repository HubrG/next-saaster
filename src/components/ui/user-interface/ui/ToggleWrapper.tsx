"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Card } from "../../card";
import { Goodline } from '@/src/components/ui/@aceternity/good-line';

type Props = {
  children: React.ReactNode;
  handleChange?: (e: any) => void;
  checked: boolean;
  id: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const ToggleWrapper = ({
  children,
  id,
  icon,
  checked,
  handleChange,
  disabled = false
}: Props) => {
  const handleClick = (e: any) => {
    if (e.target.tagName === "LABEL") {
      return;
    }
    document.getElementById(id)?.click();
  };
  return (
    <Card
      className="toggle-wrapper "
      data-tooltip-id={`tooltip-${id}`}
      onClick={(e) => handleClick(e)}>
          <div className="row-span-1">{icon}</div>
        <Label
          htmlFor={id}
          className="row-span-0 disabled select-none hidden cursor-pointer font-semibold relative"></Label>
        <p className="row-span-3">{children}</p>
        <Goodline className="row-span-2" />
        <Switch
          onCheckedChange={handleChange}
          className="mx-auto row-span-1"
          disabled={disabled}
          id={id}
          checked={checked}
          />
    </Card>
  );
};
