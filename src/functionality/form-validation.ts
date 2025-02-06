import { InputParameters } from "../App";

export class FormValidation {
  private inputParameters: InputParameters;
  private errors: Record<string, string>;

  constructor(inputParameters: InputParameters) {
    this.inputParameters = inputParameters;
    this.errors = {};
  }

  public validateInputParameters() {
    this.errors = {};
    if (
      !this.inputParameters.totalChargingPoint ||
      this.inputParameters.totalChargingPoint <= 0
    ) {
      this.errors.totalChargingPoint =
        "Total charging points must be greater than 0.";
    }

    if (
      !this.inputParameters.totalNumberOfCars ||
      this.inputParameters.totalNumberOfCars <= 0
    ) {
      this.errors.totalNumberOfCars =
        "Total number of cars must be greater than 0.";
    }

    if (
      !this.inputParameters.arrivalProbability ||
      this.inputParameters.arrivalProbability < 20 ||
      this.inputParameters.arrivalProbability > 200
    ) {
      this.errors.arrivalProbability =
        "Arrival probability must be between 20% and 200%.";
    }

    if (
      !this.inputParameters.powerConsumedByCars ||
      this.inputParameters.powerConsumedByCars <= 0
    ) {
      this.errors.powerConsumedByCars =
        "Power consumed must be greater than 0.";
    }

    if (
      !this.inputParameters.chargingPointPower ||
      this.inputParameters.chargingPointPower <= 0
    ) {
      this.errors.chargingPointPower =
        "Charge point power must be greater than 0.";
    }

    return this.errors;
  }

  public isInputParametersValid() {
    return Object.keys(this.errors).length === 0;
  }
}
