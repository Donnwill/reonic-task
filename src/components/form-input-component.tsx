import React from "react";
import { InputLayoutComponent } from "../layout/input-layout-component";
import { FormLabel } from "./form-label";
import { InputParameters } from "../models/input-parameters-model";

export type FormInputComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  parameterValue: number;
  unit: string;
  title: string;
  parameterName: keyof InputParameters;
  error: string;
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const INPUTSTYLE = `bg-trout rounded px-3 py-1 w-[50%] text-manatee shadow-sm items-center justify-center 
font-IBM focus-visible:outline-none overflow-hidden h-7.5 [&::-webkit-inner-spin-button]:appearance-none`;

export const FormInputComponent: React.FC<FormInputComponentProps> = ({
  parameterValue,
  unit,
  title,
  parameterName,
  error,
  onHandleChange,
}) => {
  return (
    <>
      <FormLabel className="mt-6" title={title} />
      <InputLayoutComponent className="mt-1" unit={unit}>
        <input
          className={INPUTSTYLE}
          placeholder={title}
          value={parameterValue}
          name={parameterName}
          type="number"
          onChange={onHandleChange}
        />
      </InputLayoutComponent>
      {error && (
        <p className="text-error font-IBM text-sm whitespace-pre-line">
          {error}
        </p>
      )}
    </>
  );
};
