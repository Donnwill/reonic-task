export type SessionInfo = {
  chargingPoint: number;
  timeOfDay: number;
  duration: number;
};

export type ExemplaryDay = {
  totalCarsCharged: number;
  totalEnergyCharged: number; // kWh
  powerConsumedPerHour: Record<number, number>; //kWh
  maxPowerDemand: number;
  peakHour: number;
};

export type ChargingSessions = {
  chargingValuePerChargePoint: Record<number, number>;
  exemplaryDay: ExemplaryDay;
  chargingEvent: Record<number, number>;
};
