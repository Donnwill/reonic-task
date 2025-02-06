import React from "react";
import { cn } from "../lib/utils";

export type HeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export const Heading: React.FC<HeadingProps> = ({ title, className }) => {
  return (
    <h1
      className={cn(
        `font-figtreeBold text-2xl leading-[120%] inline-block text-white cursor-default`,
        className
      )}
    >
      {title}
    </h1>
  );
};
