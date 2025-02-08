import React, { useState } from "react";
import { cn } from "../lib/utils";
import { DaySession } from "./day-session";

const TABNAMES = ["Day", "Week", "Month", "Year"] as const;

export type TabsClickEvent = React.MouseEvent<HTMLDivElement> & {
  tabName: (typeof TABNAMES)[number];
};

type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
  onClick: (e: TabsClickEvent) => void;
};

export const Tabs: React.FC<TabsProps> = ({ onClick }) => {
  const [activeTab, setActiveTab] = useState("Day");
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-9 bg-blackPearl border-2 px-0.5 items-center justify-center w-full rounded-lg border-trout">
        {TABNAMES.map((tabName, index) => (
          <button
            onClick={(e) => {
              const event = e as unknown as TabsClickEvent;
              event.tabName = tabName;
              onClick(event);
              setActiveTab(tabName);
            }}
            key={index}
            className={cn(
              `py-1 w-[50%]  rounded-md font-IBM text-sm
            text-manatee`,
              activeTab === TABNAMES[index]
                ? `bg-trout text-white`
                : `hover:text-manatee cursor-pointer`
            )}
          >
            {tabName}
          </button>
        ))}
      </div>
      {activeTab === "Day" && (
        <DaySession />
      )}
    </div>
  );
};
