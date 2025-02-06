import React, { useState } from "react";
import { ComponentsBackground } from "./components/components-background";
import { Heading } from "./components/heading";
import { InputComponent } from "./components/input-component";
import { SubHeading } from "./components/sub-heading";
import { FormValidation } from "./functionality/form-validation";

const INPUTSTYLE = `bg-trout rounded px-3 py-1 w-[50%] text-manatee shadow-sm items-center justify-center 
font-IBM focus-visible:outline-none overflow-hidden h-7.5 [&::-webkit-inner-spin-button]:appearance-none`;

export type InputParameters = {
  totalChargingPoint: number;
  totalNumberOfCars: number;
  arrivalProbability: number;
  powerConsumedByCars: number;
  chargingPointPower: number;
};

function App() {
  const [inputParameters, setInputParameters] = useState<InputParameters>({
    totalChargingPoint: 1,
    totalNumberOfCars: 1,
    arrivalProbability: 100,
    powerConsumedByCars: 18,
    chargingPointPower: 11,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValidation: FormValidation = new FormValidation(inputParameters);

  function onHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setInputParameters({
      ...inputParameters,
      [name]: value === "" ? "" : Number(value),
    });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function onFormSubmit(formData: React.FormEvent<HTMLFormElement>) {
    formData.preventDefault();

    setErrors(formValidation.validateInputParameters());
    if (formValidation.isInputParametersValid()) {
      console.log({ formData });
    }
  }

  function resetInputParameters() {
    setInputParameters({
      totalChargingPoint: 1,
      totalNumberOfCars: 1,
      arrivalProbability: 100,
      powerConsumedByCars: 18,
      chargingPointPower: 11,
    });
  }

  return (
    <div className="flex flex-row">
      <ComponentsBackground className={"ml-10 mt-10"}>
        <Heading title={"Simulation Input Parameters"} />
        <form onSubmit={onFormSubmit}>
          <SubHeading className="mt-6" title={"Total Charging Points"} />
          <InputComponent className="mt-1" unit="Nos">
            <input
              className={INPUTSTYLE}
              placeholder={"Total charging points"}
              value={inputParameters.totalChargingPoint}
              name="totalChargingPoint"
              type="number"
              onChange={onHandleChange}
            />
          </InputComponent>
          {errors.totalChargingPoint && (
            <p className="text-error font-IBM text-sm">
              {errors.totalChargingPoint}
            </p>
          )}
          <SubHeading className="mt-6" title={"Total Number Of Cars"} />
          <InputComponent className="mt-1" unit="Nos">
            <input
              className={INPUTSTYLE}
              placeholder={"Total number of cars"}
              value={inputParameters.totalNumberOfCars}
              name="totalNumberOfCars"
              type="number"
              onChange={onHandleChange}
            />
          </InputComponent>
          {errors.totalNumberOfCars && (
            <p className="text-error font-IBM text-sm">
              {errors.totalNumberOfCars}
            </p>
          )}
          <SubHeading className="mt-6" title={"Arrival Probability"} />
          <InputComponent className="mt-1" unit="%">
            <input
              className={INPUTSTYLE}
              placeholder={"Arrival probability"}
              value={inputParameters.arrivalProbability}
              name="arrivalProbability"
              type="number"
              onChange={onHandleChange}
            />
          </InputComponent>
          {errors.arrivalProbability && (
            <p className="text-error font-IBM text-sm">
              {errors.arrivalProbability}
            </p>
          )}
          <SubHeading className="mt-6" title={"Power Consumed By Cars"} />
          <InputComponent className="mt-1" unit="kWh">
            <input
              className={INPUTSTYLE}
              placeholder={"Power consumed by cars"}
              value={inputParameters.powerConsumedByCars}
              name="powerConsumedByCars"
              type="number"
              onChange={onHandleChange}
            />
          </InputComponent>
          {errors.powerConsumedByCars && (
            <p className="text-error font-IBM text-sm">
              {errors.powerConsumedByCars}
            </p>
          )}
          <SubHeading className="mt-6" title={"Charging Point Power"} />
          <InputComponent className="mt-1" unit="kW">
            <input
              className={INPUTSTYLE}
              placeholder={"Charging point power"}
              value={inputParameters.chargingPointPower}
              name="chargingPointPower"
              type="number"
              onChange={onHandleChange}
            />
          </InputComponent>
          {errors.chargingPointPower && (
            <p className="text-error font-IBM text-sm">
              {errors.chargingPointPower}
            </p>
          )}
          <button
            className="text-manatee cursor-pointer mr-5 font-IBM underline"
            type="button"
            onClick={resetInputParameters}
          >
            Reset
          </button>
          <button
            className={`mt-6 text-sm font-figtreeSemiBold uppercase bg-contained-button text-white rounded 
              active:text-active-button-text active:bg-active-button hover:bg-hover-button w-[30%] h-8 cursor-pointer`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </ComponentsBackground>
    </div>
  );
}

export default App;
