import { handleCopy } from "@/src/functions/handleCopy";
import React from "react";
import { Tooltip } from "react-tooltip";
type Props = {
  children: React.ReactNode;
  id: string;
  what: string;
  copyText: string;
};
export const CopySomething = ({ children, id, what, copyText }: Props) => {
  return (
    <span
      data-tooltip-id={id}
      className="text-xs p-0.5 hover:bg-primary rounded-default cursor-pointer"
      onClick={() => handleCopy(copyText, what)}>
      {children}
      <Tooltip className="tooltip" opacity={100} id={id} place="right-start">
        <strong className=" !text-xs">Copy </strong>
        <span className=" !text-xs">{copyText}</span>
      </Tooltip>
    </span>
  );
};
