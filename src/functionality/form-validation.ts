import { InputParameters } from "../models/input-parameters-model";

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

    if (this.inputParameters.totalChargingPoint > 20) {
      this.errors.totalChargingPoint =
        "Total charging points must be less than 20.";
    }

    if (
      !this.inputParameters.numberOfCarsPerHour ||
      this.inputParameters.numberOfCarsPerHour <= 0
    ) {
      this.errors.numberOfCarsPerHour =
        "Number of cars per hour must be greater than 0.";
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

    if (
      !this.inputParameters.chargingPoints11kW &&
      !this.inputParameters.chargingPoints22kW &&
      !this.inputParameters.chargingPoints50kW
    ) {
      this.errors.chargingPoints11kW =
        "Atleast one of the Charging point 11kW must be greater than 0.";
    }

    if (
      this.inputParameters.chargingPoints11kW * 11 +
        this.inputParameters.chargingPoints22kW * 22 +
        this.inputParameters.chargingPoints50kW * 50 >
      220
    ) {
      this.errors.chargingPoints11kW = `Charging point 11kW * Charging point 22kW * Charging point 50kW,\nshould not exceed 220kW`;
    }

    if (
      this.inputParameters.totalChargingPoint *
        this.inputParameters.chargingPointPower >
      220
    ) {
      this.errors.totalChargingPoint = `Total power capacity should not exceed 220kW,\nCharging Point Power * Total Charging Point.`;
    }

    return this.errors;
  }

  public isInputParametersValid() {
    return Object.keys(this.errors).length === 0;
  }
}
