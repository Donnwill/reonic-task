import React, { useState } from "react";
import { ComponentsBackground } from "./components/components-background";
import { Heading } from "./components/heading";
import { FormValidation } from "./functionality/form-validation";
import {
  InputParametersName,
  InputParametersState,
  useInputParametersState,
} from "./provider/input-parameters-provider";
import { FormInputComponent } from "./components/form-input-component";

function App() {
  const { inputParametersState, inputParametersDispatch } =
    useInputParametersState();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValidation: FormValidation = new FormValidation(
    inputParametersState
  );

  function onHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    inputParametersDispatch({
      type: "UPDATE_PARAMETERS",
      payload: {
        parameterName: name as keyof InputParametersState,
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
      console.log({ formData });
    }
  }

  function resetInputParameters() {
    inputParametersDispatch({ type: "RESET" });
  }

  return (
    <div className="flex flex-row">
      <ComponentsBackground className={"m-10"}>
        <Heading title={"Simulation Input Parameters"} />
        <form onSubmit={onFormSubmit}>
          {INPUT_PARAMETERS_FIELDS.map((inputParameters, index) => (
            <FormInputComponent
              key={index}
              title={inputParameters.title}
              parameterValue={
                inputParametersState[inputParameters.parameterName]
              }
              unit={inputParameters.unit}
              parameterName={inputParameters.parameterName}
              error={errors[inputParameters.parameterName]}
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
    title: "Total Number of Cars",
    parameterName: "totalNumberOfCars",
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
