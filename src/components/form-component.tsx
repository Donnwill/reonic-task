import React from "react";
import { InputComponent } from "./input-component";
import { SubHeading } from "./sub-heading";
import { InputParametersState } from "../provider/input-parameters-provider";

export type FormComponentProps = React.HTMLAttributes<HTMLDivElement> & {
  parameterValue: number;
  unit: string;
  title: string;
  parameterName: keyof InputParametersState;
  error: string;
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const INPUTSTYLE = `bg-trout rounded px-3 py-1 w-[50%] text-manatee shadow-sm items-center justify-center 
font-IBM focus-visible:outline-none overflow-hidden h-7.5 [&::-webkit-inner-spin-button]:appearance-none`;

export const FormComponent: React.FC<FormComponentProps> = ({
  parameterValue,
  unit,
  title,
  parameterName,
  error,
  onHandleChange,
}) => {
  return (
    <>
      <SubHeading className="mt-6" title={title} />
      <InputComponent className="mt-1" unit={unit}>
        <input
          className={INPUTSTYLE}
          placeholder={title}
          value={parameterValue}
          name={parameterName}
          type="number"
          onChange={onHandleChange}
        />
      </InputComponent>
      {error && <p className="text-error font-IBM text-sm">{error}</p>}
    </>
  );
};
