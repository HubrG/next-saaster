import { Separator } from "@/src/components/ui/separator";
import React from "react";
import { Card } from "../card";
type Props = {
  children: React.ReactNode;
  id: string;
  sectionName: string;
  className?: string;
};
export const SectionWrapper = ({
  children,
  id,
  sectionName,
  className,
}: Props) => {
  return (
    <>
      <Card
        className={`user-inteface-main-content-section !border-0 `}
        id={id}>
        <div className="user-inteface-main-content-section-header">
          <h2 className="text-right md:text-3xl text-2xl mb-10">
            {sectionName}
          </h2>
        </div>
        <div className={`${className}`}>{children}</div>
      </Card>
      {/* <Separator className=" dark:opacity-80 border-b-4 my-20 border-dotted h-[1px]   bg-transparent " /> */}
    </>
  );
};
