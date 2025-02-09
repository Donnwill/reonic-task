import React from "react";
import { cn } from "../lib/utils";

export type InputComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  unit: string;
};

export const InputComponent: React.FC<InputComponentProps> = ({
  children,
  unit,
  className,
}) => {
  return (
    <div className={cn("flex flex-row gap-4 items-center w-full", className)}>
      {children}
      <p className="font-IBMBold text-sm text-manatee">{unit}</p>
    </div>
  );
};
