import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { InputParameters, InputParametersName } from "../models/input-parameters-model";

type InputParametersAction =
  | {
      type: "UPDATE_INPUT_PARAMETERS";
      payload: { parameterName: InputParametersName; value: number | string };
    }
  | { type: "RESET" };

const initialState: InputParameters = {
  totalChargingPoint: 20,
  numberOfCarsPerHour: 20,
  arrivalProbability: 100,
  powerConsumedByCars: 18,
  chargingPointPower: 11,
  chargingPoints11kW: 1,
  chargingPoints22kW: 0,
  chargingPoints50kW: 0,
};

function updateInputParameters(
  state: InputParameters,
  action: InputParametersAction
): InputParameters {
  switch (action.type) {
    case "UPDATE_INPUT_PARAMETERS": {
      const { parameterName, value } = action.payload;
      return { ...state, [parameterName]: value };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const InputParametersContext = createContext<
  | {
      inputParametersState: InputParameters;
      inputParametersDispatch: React.Dispatch<InputParametersAction>;
    }
  | undefined
>(undefined);

export const InputParametersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inputParametersState, inputParametersDispatch] = useReducer(
    updateInputParameters,
    initialState
  );

  return (
    <InputParametersContext.Provider
      value={{ inputParametersState, inputParametersDispatch }}
    >
      {children}
    </InputParametersContext.Provider>
  );
};

export function useInputParametersState() {
  const context = useContext(InputParametersContext);
  if (context === undefined) {
    throw new Error(
      "InputParametersState must be used within an InputParametersProvider"
    );
  }
  return context;
}
