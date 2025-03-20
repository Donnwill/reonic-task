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
      typeof this.inputParameters.totalChargingPoint === "string" ||
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
      typeof this.inputParameters.numberOfCarsPerHour === "string" ||
      this.inputParameters.numberOfCarsPerHour <= 0
    ) {
      this.errors.numberOfCarsPerHour =
        "Number of cars per hour must be greater than 0.";
    }

    if (
      typeof this.inputParameters.arrivalProbability === "string" ||
      this.inputParameters.arrivalProbability < 20 ||
      this.inputParameters.arrivalProbability > 200
    ) {
      this.errors.arrivalProbability =
        "Arrival probability must be between 20% and 200%.";
    }

    if (
      typeof this.inputParameters.powerConsumedByCars === "string" ||
      this.inputParameters.powerConsumedByCars <= 0
    ) {
      this.errors.powerConsumedByCars =
        "Power consumed must be greater than 0.";
    }

    if (
      typeof this.inputParameters.chargingPointPower === "string" ||
      this.inputParameters.chargingPointPower <= 0
    ) {
      this.errors.chargingPointPower =
        "Charge point power must be greater than 0.";
    }

    if (
      typeof this.inputParameters.chargingPoints11kW === "string" ||
      this.inputParameters.chargingPoints11kW < 0
    ) {
      this.errors.chargingPoints11kW = "Charging point 11kW must be atleast 0.";
    }

    if (
      typeof this.inputParameters.chargingPoints22kW === "string" ||
      this.inputParameters.chargingPoints22kW < 0
    ) {
      this.errors.chargingPoints22kW = "Charging point 22kw must be atleast 0.";
    }

    if (
      typeof this.inputParameters.chargingPoints50kW === "string" ||
      this.inputParameters.chargingPoints50kW < 0
    ) {
      this.errors.chargingPoints50kW = "Charging point 50kW must be atleast 0.";
    }

    if (
      this.inputParameters.chargingPoints11kW * 11 +
        this.inputParameters.chargingPoints22kW * 22 +
        this.inputParameters.chargingPoints50kW * 50 ===
      0
    ) {
      if (this.errors.chargingPoints11kW === undefined) {
        this.errors.chargingPoints11kW = `Atleast one charging point should,\nbe greater than 0.`;
      }
    }

    if (
      this.inputParameters.chargingPoints11kW * 11 +
        this.inputParameters.chargingPoints22kW * 22 +
        this.inputParameters.chargingPoints50kW * 50 >
      220
    ) {
      if (this.errors.chargingPoints11kW === undefined) {
        this.errors.chargingPoints11kW = `Charging point 11kW * Charging point 22kW * Charging point 50kW,\nshould not exceed 220kW`;
      }
    }

    if (
      this.inputParameters.totalChargingPoint *
        this.inputParameters.chargingPointPower >
      220
    ) {
      if (this.errors.totalChargingPoint === undefined) {
        this.errors.totalChargingPoint = `Total power capacity should not exceed 220kW,\nCharging Point Power * Total Charging Point.`;
      }
    }

    return this.errors;
  }

  public isInputParametersValid() {
    return Object.keys(this.errors).length === 0;
  }
}
