import React from "react";
type Props = {
  children: React.ReactNode;
  id: string;
  sectionName: string;
  className?: string;
  info?: string;
};
export const SubSectionWrapper = ({
  children,
  id,
  sectionName,
  className,
  info,
}: Props) => {
  return (
    <div
      className={`user-inteface-main-content-subsection  my-24 ${className}`}
      id={id}>
      <div className="flex flex-col justify-start items-start mb-5">
        <h3 className="!text-left md:text-xl text-base opacity-90">
          {sectionName}
        </h3>
        {info && <p className="text-sm opacity-70 !text-left">{info}</p>}
      </div>
      {children}
    </div>
  );
};
