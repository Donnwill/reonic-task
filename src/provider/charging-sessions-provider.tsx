import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { ChargingSessions } from "../models/charging-sessions-model";

type ChargingSessionsAction = {
  type: "UPDATE_CHARGING_SESSIONS";
  payload: { chargingSessions: ChargingSessions };
};

const initialState: ChargingSessions = {
  chargingEvents: {},
  exemplaryDay: {
    totalCarsCharged: 0,
    totalEnergyCharged: 0,
    powerConsumedPerHour: {},
    maxPowerDemand: 0,
    peakHour: 0,
  },
  chargingValuePerChargePoint: {},
};

function updateChargingSessions(
  state: ChargingSessions,
  action: ChargingSessionsAction
): ChargingSessions {
  switch (action.type) {
    case "UPDATE_CHARGING_SESSIONS": {
      const chargingSessions = action.payload.chargingSessions;
      return chargingSessions;
    }
    default:
      return state;
  }
}

const ChargingSessionsContext = createContext<
  | {
      chargingSessionsState: ChargingSessions;
      chargingSessionsDispatch: React.Dispatch<ChargingSessionsAction>;
    }
  | undefined
>(undefined);

export const ChargingSessionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chargingSessionsState, chargingSessionsDispatch] = useReducer(
    updateChargingSessions,
    initialState
  );

  return (
    <ChargingSessionsContext.Provider
      value={{ chargingSessionsState, chargingSessionsDispatch }}
    >
      {children}
    </ChargingSessionsContext.Provider>
  );
};

export function useChargingSessionsState() {
  const context = useContext(ChargingSessionsContext);
  if (context === undefined) {
    throw new Error(
      "ChargingSessionsState must be used within an ChargingSessionsProvider"
    );
  }
  return context;
}
