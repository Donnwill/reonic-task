export type SessionsInfo = {
  chargingPoint: number;
  sessionTime: number; // will contain hours, weeks, months
  duration: number;
};

export type ExemplaryDay = {
  totalCarsCharged: number;
  totalEnergyCharged: number; // kWh
  powerConsumedPerHour: Record<number, number>; //kWh
  maxPowerDemand: number;
  peakTime: number;
};

export type ChargingSessions = {
  chargingValuePerChargePoint: Record<number, number>;
  exemplaryDay: ExemplaryDay;
  chargingEvent: Record<number, number>;
  sessionsInfo: SessionsInfo[];
};
