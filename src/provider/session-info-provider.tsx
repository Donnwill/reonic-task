import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { SessionsInfo } from "../models/charging-sessions-model";

type SessionInfoAction =
  | {
      type: "UPDATE_SESSION_INFO";
      payload: { sessionInfo: SessionsInfo[] };
    }
  | { type: "RESET" };

const initialState: SessionsInfo[] = [];

function updateSessionInfo(
  state: SessionsInfo[],
  action: SessionInfoAction
): SessionsInfo[] {
  switch (action.type) {
    case "UPDATE_SESSION_INFO": {
      const chargingSessions = action.payload.sessionInfo;
      return chargingSessions;
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const SessionInfoContext = createContext<
  | {
      sessionInfoState: SessionsInfo[];
      sessionInfoDispatch: React.Dispatch<SessionInfoAction>;
    }
  | undefined
>(undefined);

export const SessionInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessionInfoState, sessionInfoDispatch] = useReducer(
    updateSessionInfo,
    initialState
  );

  return (
    <SessionInfoContext.Provider
      value={{
        sessionInfoState,
        sessionInfoDispatch,
      }}
    >
      {children}
    </SessionInfoContext.Provider>
  );
};

export function useSessionInfoState() {
  const context = useContext(SessionInfoContext);
  if (context === undefined) {
    throw new Error(
      "SessionInfoState must be used within an SessionInfoProvider"
    );
  }
  return context;
}
