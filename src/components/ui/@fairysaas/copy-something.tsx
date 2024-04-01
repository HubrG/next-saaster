import { handleCopy } from "@/src/helpers/functions/handleCopy";
import React from "react";
import { Tooltip } from "react-tooltip";
type Props = {
  children: React.ReactNode;
  id: string; // Tooltip id
  what: string; // What is copied
  copyText: string; // Text to copy
};
export const CopySomething = ({ children, id, what, copyText }: Props) => {
  return (
    <span
      data-tooltip-id={id}
      className="hover:bg-primary rounded-default cursor-pointer"
      onClick={() => handleCopy(copyText, what)}>
      {children}
      <Tooltip className="tooltip" opacity={100} id={id} place="right">
        Copy {what}
      </Tooltip>
    </span>
  );
};
