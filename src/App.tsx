import React, { useState } from "react";
import { ComponentsBackground } from "./components/components-background";
import { Heading } from "./components/heading";
import { FormValidation } from "./functionality/form-validation";
import { FormInputComponent } from "./components/form-input-component";
import { inputCalculation } from "./functionality/input-calculation";
import {
  InputParameters,
  InputParametersName,
} from "./models/input-parameters-model";
import { useChargingSessionsState } from "./provider/charging-sessions-provider";
import { useInputParametersState } from "./provider/input-parameters-provider";
import { OutputComponent } from "./components/output-component";

function App() {
  const { chargingSessionsDispatch } = useChargingSessionsState();
  const { inputParametersState, inputParametersDispatch } =
    useInputParametersState();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValidation: FormValidation = new FormValidation(
    inputParametersState
  );

  const calculateSessions = inputCalculation(inputParametersState);

  function onHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    inputParametersDispatch({
      type: "UPDATE_INPUT_PARAMETERS",
      payload: {
        parameterName: name as keyof InputParameters,
        // Accepting string becasue it clears the input field, if it's only number, the first char is always 0.
        value: value === "" ? "" : Number(value),
      },
    });

    setErrors((prevError) => ({ ...prevError, [e.target.name]: "" }));
  }

  function onFormSubmit(formData: React.FormEvent<HTMLFormElement>) {
    formData.preventDefault();

    const errors = formValidation.validateInputParameters();
    setErrors(errors);

    if (formValidation.isInputParametersValid()) {
      const chargingSessions = calculateSessions.chargingSessions();
      chargingSessionsDispatch({
        type: "UPDATE_CHARGING_SESSIONS",
        payload: { chargingSessions },
      });
    }
  }

  function resetInputParameters() {
    inputParametersDispatch({ type: "RESET" });
    chargingSessionsDispatch({ type: "RESET" });
  }

  return (
    <div className="flex flex-row m-10 gap-10 items-start">
      <ComponentsBackground className="w-[22rem]">
        <Heading title={"Simulation Input Parameters"} />
        <form onSubmit={onFormSubmit}>
          {INPUT_PARAMETERS_FIELDS.map((inputParametersData, index) => (
            <FormInputComponent
              key={index}
              title={inputParametersData.title}
              parameterValue={
                inputParametersState[inputParametersData.parameterName]
              }
              unit={inputParametersData.unit}
              parameterName={inputParametersData.parameterName}
              error={errors[inputParametersData.parameterName]}
              onHandleChange={onHandleChange}
            />
          ))}
          <button
            className="text-manatee cursor-pointer mr-5 font-IBM underline"
            type="button"
            onClick={resetInputParameters}
          >
            Reset
          </button>
          <button
            className={`mt-6 text-sm font-figtreeSemiBold uppercase bg-contained-button text-white rounded overflow-hidden
            p-2  active:text-active-button-text active:bg-active-button hover:bg-hover-button w-[30%] h-8 cursor-pointer`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </ComponentsBackground>
      <ComponentsBackground>
        <OutputComponent />
      </ComponentsBackground>
    </div>
  );
}

type InputFieldConfig = {
  title: string;
  parameterName: InputParametersName;
  unit: string;
};

const INPUT_PARAMETERS_FIELDS: InputFieldConfig[] = [
  {
    title: "Total Charging Points",
    parameterName: "totalChargingPoint",
    unit: "Nos",
  },
  {
    title: "Number of Cars Per Hour",
    parameterName: "numberOfCarsPerHour",
    unit: "Nos",
  },
  {
    title: "Arrival Probability",
    parameterName: "arrivalProbability",
    unit: "%",
  },
  {
    title: "Power Consumed By Cars",
    parameterName: "powerConsumedByCars",
    unit: "kWh",
  },
  {
    title: "Charging Point Power",
    parameterName: "chargingPointPower",
    unit: "kW",
  },
];

export default App;
