export type InputParameters = {
  totalChargingPoint: number;
  numberOfCarsPerHour: number;
  arrivalProbability: number;
  powerConsumedByCars: number;
  chargingPointPower: number;
};

export type InputParametersName = keyof InputParameters;
