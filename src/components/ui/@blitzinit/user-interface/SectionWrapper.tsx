import React from "react";
import { Goodline } from "../../@aceternity/good-line";
import { Card } from "../../@shadcn/card";
type Props = {
  children: React.ReactNode;
  id: string;
  sectionName: string;
  className?: string;
  icon?: React.ReactNode;
  mainSectionName?: string;
};
export const SectionWrapper = ({
  children,
  id,
  sectionName,
  mainSectionName,
  icon,
  className,
}: Props) => {
  return (
    <>
      <Card className={`user-inteface-main-content-section  `} id={id}>
        <div className="user-inteface-main-content-section-header">
          <h2>
            <span className="section-name">
              {icon} {sectionName}
            </span>
            <span className="main-section-name">{mainSectionName}</span>
          </h2>
          <Goodline className="!opacity-30" />
        </div>
        <div className={`${className}`}>{children}</div>
      </Card>
    </>
  );
};
