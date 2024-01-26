"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";

type Props = {
  children: React.ReactNode;
  handleChange?: (e: any) => void;
  checked: boolean;
  id: string;
  disabled?: boolean;
};

export const ToggleWrapper = ({
  children,
  id,
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
    <div className="toggle-wrapper" onClick={(e) => handleClick(e)}>
      <Switch
        onCheckedChange={handleChange}
        className="mx-auto"
        disabled={disabled}
        id={id}
        checked={checked}
      />
      <Label
        htmlFor={id}
        className="disabled select-none hidden cursor-pointer font-semibold relative"></Label>
      <div>{children}</div>
    </div>
  );
};
