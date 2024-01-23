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
          <h2 className="text-right text-2xl mb-10">{sectionName}</h2>
        </div>
        <div className={`${className}`}>{children}</div>
      </div>
      <Separator decorative={true}  className="opacity-30 dark:opacity-80 border-2  bg-transparent border-b light:border-dashed" />
    </>
  );
};
