import React from "react";
import { cn } from "../lib/utils";

export type FormLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export const FormLabel: React.FC<FormLabelProps> = ({ title, className }) => {
  return (
    <h2
      className={cn(
        `cursor-default text-sm tracking-[0.01em] font-IBMBold text-manatee`,
        className
      )}
    >
      {title}
    </h2>
  );
};
