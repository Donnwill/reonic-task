import * as React from "react";
import { cn } from "../lib/utils";

export type GraphContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const GraphContainer: React.FC<GraphContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        `w-full relative rounded-lg bg-cinder box-border flex flex-col items-start justify-center p-3 gap-3 text-left
        text-sm text-white font-IBM border-2 border-solid border-trout`,
        className
      )}
    >
      {children}
    </div>
  );
};
