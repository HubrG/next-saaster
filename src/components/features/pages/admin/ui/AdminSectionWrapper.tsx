import { Separator } from "@/src/components/ui/separator";
import React from "react";
type Props = {
  children: React.ReactNode;
  id: string;
  sectionName: string;
  className?: string;
};
export const AdminSectionWrapper = ({
  children,
  id,
  sectionName,
  className,
}: Props) => {
  return (
    <>
      <div className={`admin-section bg-background`} id={id}>
        <div className="admin-header-section">
          <h4 className="text-right mb-10">{sectionName}</h4>
        </div>
        <div className={`${className}`}>{children}</div>
      </div>
      <Separator decorative={true}  className="opacity-30 bg-transparent border-b border-dashed" />
    </>
  );
};
