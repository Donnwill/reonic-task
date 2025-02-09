import React from "react";
import { cn } from "../lib/utils";

export type TabsClickEvent = React.MouseEvent<HTMLDivElement> & {
  tabName: string;
};

type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
  tabNames: string[];
  activeTabName: string;
  onClick: (e: TabsClickEvent) => void;
};

export const Tabs: React.FC<TabsProps> = ({
  tabNames,
  activeTabName,
  onClick,
}) => {
  return (
    <div className="flex h-9 bg-blackPearl border-2 px-0.5 items-center justify-center w-full rounded-lg border-trout">
      {tabNames.map((tabName, index) => (
        <button
          onClick={(e) => {
            const event = e as unknown as TabsClickEvent;
            event.tabName = tabName;
            onClick(event);
          }}
          key={index}
          className={cn(
            `py-1 w-[50%]  rounded-md font-IBM text-sm
            text-manatee`,
            activeTabName === tabNames[index]
              ? `bg-trout text-white`
              : `hover:text-manatee cursor-pointer`
          )}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
};
