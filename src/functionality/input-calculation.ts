import { InputParametersState } from "../provider/input-parameters-provider";

type SessionInfo = {
  chargingPoint: number;
  timeOfDay: number;
};

type ExemplaryDay = {
  totalCarsCharged: number;
  powerConsumed: number;
  powerConsumedPerHour: Record<number, number>; //kWh
  peakHour: number;
};

export function inputCalculation(inputParameters: InputParametersState) {
  const {
    arrivalProbability,
    chargingPointPower,
    numberOfCarsPerHour,
    powerConsumedByCars,
    totalChargingPoint,
  } = inputParameters;
  const TOTALMINUTES = 1440; // 24 hours in minutes

  function getArrivalTime(): number[] {
    const arrivalRate = (numberOfCarsPerHour / 60) * (arrivalProbability / 100);

    let currentTime = 0;
    const carArrivaltimes: number[] = [];

    while (currentTime < TOTALMINUTES) {
      // Randomised arrival time
      const randomArrivalInterval = -Math.log(Math.random()) / arrivalRate;
      currentTime += randomArrivalInterval;

      carArrivaltimes.push(Math.round(currentTime));
    }

    return carArrivaltimes;
  }

  function chargingSessions(): SessionInfo[] {
    const maxCarChargingDuration =
      (powerConsumedByCars / chargingPointPower) * 60;
    const arrivalTimes = getArrivalTime();

    const sessionsInfo: SessionInfo[] = [];
    const availableChargingPoints = Array(totalChargingPoint).fill(0);

    arrivalTimes.forEach((arrival) => {
      // Prevent adding session after 24 hours
      if (arrival + maxCarChargingDuration > TOTALMINUTES) return sessionsInfo;

      const nextAvailableChargingPoint = availableChargingPoints.findIndex(
        (time) => time <= arrival
      );

      if (nextAvailableChargingPoint !== -1) {
        sessionsInfo.push({
          chargingPoint: nextAvailableChargingPoint + 1,
          timeOfDay: arrival,
        });
        availableChargingPoints[nextAvailableChargingPoint] =
          arrival + maxCarChargingDuration;
      }
    });

    return sessionsInfo;
  }

  function chargePointChargingValue(): Record<number, number> {
    const sessionsInfo = chargingSessions();
    const chargePointRecord: Record<number, number> = {};

    sessionsInfo.forEach((session) => {
      if (session.chargingPoint in chargePointRecord) {
        chargePointRecord[session.chargingPoint] += chargingPointPower;
      } else {
        chargePointRecord[session.chargingPoint] = chargingPointPower;
      }
    });
    return chargePointRecord;
  }

  function exemplaryDay(): ExemplaryDay {
    const sessionsInfo = chargingSessions();
    const exemplaryDay: ExemplaryDay = {
      totalCarsCharged: sessionsInfo.length,
      peakHour: 0,
      powerConsumed: 0,
      powerConsumedPerHour: {},
    };
    const sessionDuration = powerConsumedByCars / chargingPointPower;

    sessionsInfo.forEach((session) => {
      const hour = Math.ceil(session.timeOfDay / 60);
      if (hour in exemplaryDay.powerConsumedPerHour) {
        exemplaryDay.powerConsumedPerHour[hour] +=
          chargingPointPower * sessionDuration;
      } else {
        exemplaryDay.powerConsumedPerHour[hour] =
          chargingPointPower * sessionDuration;
      }
    });

    let maxPower = 0;

    Object.entries(exemplaryDay.powerConsumedPerHour).forEach(
      ([hour, power]) => {
        if (power > maxPower) {
          maxPower = power;
          exemplaryDay.peakHour = Number(hour);
        }
        exemplaryDay.powerConsumed += power;
      }
    );

    return exemplaryDay;
  }

  function totalEnergyCharged() {}

  return { chargingSessions, chargePointChargingValue, exemplaryDay };
}
