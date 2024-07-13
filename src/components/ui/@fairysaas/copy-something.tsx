import { handleCopy } from "@/src/helpers/functions/handleCopy";
import { Copy } from "lucide-react";
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
      className="hover:bg-primary px-0.5 rounded-default cursor-pointer grid grid-cols-12 justify-evenly items-center  w-full"
      onClick={() => handleCopy(copyText, what)}>
      <span className="col-span-11">{children}</span>{" "}
      <Copy className="icon col-span-1" />
      <Tooltip className="tooltip" opacity={100} id={id} place="right">
        Copy {what}
      </Tooltip>
    </span>
  );
};
