import React, { createContext, ReactNode, useContext, useReducer } from "react";

export type InputParametersState = {
  totalChargingPoint: number;
  totalNumberOfCars: number;
  arrivalProbability: number;
  powerConsumedByCars: number;
  chargingPointPower: number;
};

export type InputParametersName = keyof InputParametersState;

// Accepting string becasue it clears the input field, if it's only number, the first char is always 0.
type InputParametersAction =
  | {
      type: "UPDATE_PARAMETERS";
      payload: { parameterName: InputParametersName; value: number | string };
    }
  | { type: "RESET" };

const initialState: InputParametersState = {
  totalChargingPoint: 1,
  totalNumberOfCars: 1,
  arrivalProbability: 100,
  powerConsumedByCars: 18,
  chargingPointPower: 11,
};

function updateInputParameters(
  state: InputParametersState,
  action: InputParametersAction
): InputParametersState {
  switch (action.type) {
    case "UPDATE_PARAMETERS": {
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
      inputParametersState: InputParametersState;
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
