import { Link } from "@/src/lib/intl/navigation";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="logo mr-2">
      <span className="sm:text-xs flex flex-row">
        <span className="mr-1">
          {/* <FontAwesomeIcon
                className="mr-1"
                icon={faBrainCircuit}
              /> */}
        </span>
        <span>Fastuff</span>
        <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup>
      </span>
    </Link>
  );
}
