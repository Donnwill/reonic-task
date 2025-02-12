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
import { useSessionInfoState } from "./provider/session-info-provider";
import { useInputParametersState } from "./provider/input-parameters-provider";
import { OutputComponent } from "./components/output-component";
import { Tabs, TabsClickEvent } from "./components/tabs";

const CHARGEPOINTTYPES = ["Basic", "Advanced"] as const;
export type ChargePointType = (typeof CHARGEPOINTTYPES)[number];

function App() {
  const { sessionInfoDispatch } = useSessionInfoState();
  const { inputParametersState, inputParametersDispatch } =
    useInputParametersState();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chargePointType, setChargePointType] =
    useState<ChargePointType>("Basic");

  const formValidation: FormValidation = new FormValidation(
    inputParametersState
  );

  const calculateSessions = inputCalculation(
    inputParametersState,
    chargePointType
  );

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
      const sessionInfo =
        chargePointType === "Basic"
          ? calculateSessions.chargingSessions()
          : calculateSessions.advancedChargingSession();

      sessionInfoDispatch({
        type: "UPDATE_SESSION_INFO",
        payload: { sessionInfo },
      });
    }
  }

  function resetInputParameters() {
    inputParametersDispatch({ type: "RESET" });
    sessionInfoDispatch({ type: "RESET" });
  }

  return (
    <div className="flex flex-col md:flex-row m-10 gap-10 items-start">
      <ComponentsBackground className="w-[22rem]">
        <Heading title={"Simulation Input Parameters"} />
        <Tabs
          className="w-[50%] mt-6"
          tabNames={[...CHARGEPOINTTYPES]}
          activeTabName={chargePointType}
          onClick={(e: TabsClickEvent) => {
            inputParametersDispatch({ type: "RESET" });
            setChargePointType(e.tabName as ChargePointType);
          }}
        />
        <form onSubmit={onFormSubmit}>
          {INPUT_PARAMETERS_FIELDS(chargePointType).map(
            (inputParametersData, index) => (
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
            )
          )}
          <button
            className="text-manatee cursor-pointer mr-5 font-IBM underline"
            type="button"
            onClick={resetInputParameters}
          >
            Reset
          </button>
          <button
            className={`mt-6 text-sm font-figtreeSemiBold uppercase bg-contained-button text-white text-ellipsis rounded 
              overflow-hidden p-2 active:text-active-button-text active:bg-active-button hover:bg-hover-button
              w-[30%] h-8 cursor-pointer`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </ComponentsBackground>
      <ComponentsBackground>
        <OutputComponent chargePointType={chargePointType} />
      </ComponentsBackground>
    </div>
  );
}

type InputFieldConfig = {
  title: string;
  parameterName: InputParametersName;
  unit: string;
};

function INPUT_PARAMETERS_FIELDS(tabName: ChargePointType): InputFieldConfig[] {
  return [
    ...(tabName === "Advanced"
      ? [
          {
            title: "Charging Points 11kW",
            parameterName: "chargingPoints11kW" as InputParametersName,
            unit: "Nos",
          },
          {
            title: "Charging Points 22kW",
            parameterName: "chargingPoints22kW" as InputParametersName,
            unit: "Nos",
          },
          {
            title: "Charging Points 50kW",
            parameterName: "chargingPoints50kW" as InputParametersName,
            unit: "Nos",
          },
        ]
      : [
          {
            title: "Total Charging Points",
            parameterName: "totalChargingPoint" as InputParametersName,
            unit: "Nos",
          },
          {
            title: "Charging Point Power",
            parameterName: "chargingPointPower" as InputParametersName,
            unit: "kW",
          },
        ]),

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
  ];
}

export default App;
