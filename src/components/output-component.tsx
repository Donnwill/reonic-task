import React, { useState } from "react";
import { ChargingSessionVisualisation } from "./charging-session-visualisation";
import { Tabs, TabsClickEvent } from "./tabs";

const TABNAMES = ["Day", "Week", "Month", "Year"] as const;
export type TabName = (typeof TABNAMES)[number];

export const OutputComponent: React.FC = () => {
  const [activeTabName, setActiveTabName] = useState<TabName>("Day");

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        tabNames={[...TABNAMES]}
        activeTabName={activeTabName}
        onClick={ (e: TabsClickEvent)=> {
          setActiveTabName(e.tabName as TabName)
        }}
      />
      <ChargingSessionVisualisation tabName={activeTabName} />
    </div>
  );
};
