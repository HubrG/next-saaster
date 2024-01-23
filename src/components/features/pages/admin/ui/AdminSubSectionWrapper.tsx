import { Separator } from "@/src/components/ui/separator";
import React from "react";
type Props = {
  children: React.ReactNode;
  id: string;
  sectionName: string;
  className?: string;
  info?: string;
};
export const AdminSubSectionWrapper = ({
  children,
  id,
  sectionName,
  className,
  info,
}: Props) => {
  return (
    <div className={`admin-sub-section bg-background mt-5`} id={id}>
      <div className="flex flex-col justify-end items-end mb-5">
        <h3 className="text-right text-base opacity-80">{sectionName}</h3>
        {info && <p className="text-sm opacity-70">{info}</p>}
      </div>
      {children}
    </div>
  );
};
