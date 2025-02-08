export type InputParameters = {
  totalChargingPoint: number;
  numberOfCarsPerHour: number;
  arrivalProbability: number;
  powerConsumedByCars: number;
  chargingPointPower: number;
};

export type InputParametersName = keyof InputParameters;

export const inputParametersDefault: InputParameters = {
  totalChargingPoint: 20,
  numberOfCarsPerHour: 20,
  arrivalProbability: 100,
  powerConsumedByCars: 18,
  chargingPointPower: 11,
};