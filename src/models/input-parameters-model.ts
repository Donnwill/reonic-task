export type InputParameters = {
  totalChargingPoint: number;
  numberOfCarsPerHour: number;
  arrivalProbability: number;
  powerConsumedByCars: number;
  chargingPointPower: number;
  chargingPoints11kW: number;
  chargingPoints22kW: number;
  chargingPoints50kW: number;
};

export type InputParametersName = keyof InputParameters;
