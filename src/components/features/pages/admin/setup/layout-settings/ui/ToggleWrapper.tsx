"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import React from "react";

type Props = {
  children: React.ReactNode;
  handleChange?: (e: any) => void;
  checked: boolean;
  id: string;
};

export const ToggleWrapper = ({
  children,
  id,
  checked,
  handleChange,
}: Props) => {
  const handleClick = (e: any) => {
    if (e.target.tagName === "LABEL") {
      return;
    }
    document.getElementById(id)?.click();
  };
  return (
    <div
      className="toggle-wrapper"
      onClick={(e) => handleClick(e)}>
      <Switch
        onCheckedChange={handleChange}
        className="mx-auto"
        id={id}
        checked={checked}
      />
      <Label htmlFor={id} className="disabled select-none cursor-pointer font-semibold relative">
        {children}
      </Label>
    </div>
  );
};
