import React, { useState } from "react";
import { ChargingSessionVisualisation } from "./charging-session-visualisation";
import { Tabs, TabsClickEvent } from "./tabs";
import { ChargePointType } from "../App";

const TIMEINTERVALS = ["Day", "Week", "Month", "Year"] as const;
export type TimeIntervals = (typeof TIMEINTERVALS)[number];

type OutputComponentProps = {
  chargePointType: ChargePointType;
};

export const OutputComponent: React.FC<OutputComponentProps> = ({
  chargePointType,
}) => {
  const [activeTabName, setActiveTabName] = useState<TimeIntervals>("Day");

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        tabNames={[...TIMEINTERVALS]}
        activeTabName={activeTabName}
        onClick={(e: TabsClickEvent) => {
          setActiveTabName(e.tabName as TimeIntervals);
        }}
      />
      <ChargingSessionVisualisation
        timeIntervals={activeTabName}
        chargePointType={chargePointType}
      />
    </div>
  );
};
