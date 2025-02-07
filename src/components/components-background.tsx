import React, { ReactNode } from "react";
import { cn } from "../lib/utils";

export type ComponentsBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const ComponentsBackground: React.FC<ComponentsBackgroundProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(`rounded-xl bg-gunmetal flex flex-col p-4`, className)}>
      {children}
    </div>
  );
};
