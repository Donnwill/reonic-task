import { ExemplaryDay, SessionsInfo } from "../models/charging-sessions-model";
import { InputParameters } from "../models/input-parameters-model";

const TOTALMINUTES = 525600; // 365 days in minutes

export function inputCalculation(inputParameters: InputParameters) {
  const {
    arrivalProbability,
    chargingPointPower,
    numberOfCarsPerHour,
    powerConsumedByCars,
    totalChargingPoint,
  } = inputParameters;

  function getArrivalTime(): number[] {
    const carArrivaltimes: number[] = [];
    const arrivalRate = (arrivalProbability / 100) * (numberOfCarsPerHour / 60);

    let currentTime = 0;

    while (true) {
      // Randomised arrival time
      currentTime += -Math.log(1 - Math.random()) / arrivalRate;

      if (currentTime > TOTALMINUTES) break;

      carArrivaltimes.push(Math.round(currentTime));
    }

    return carArrivaltimes;
  }

  // Assumption made The cars that arrive when all the charging points are full will leave
  // and not be placed in a queue, its pointless for the cars to wait until a place is free.
  function chargingSessions(): SessionsInfo[] {
    const maxCarChargingDuration =
      (powerConsumedByCars / chargingPointPower) * 60;
    const arrivalTimes = getArrivalTime();

    const sessionsInfo: SessionsInfo[] = [];
    const availableChargingPoints = Array(totalChargingPoint).fill(0);

    arrivalTimes.forEach((arrival) => {
      // Prevent adding session after 365 days
      if (arrival + maxCarChargingDuration > TOTALMINUTES) return sessionsInfo;

      const randomChargingPercentage = Math.random() * 0.7 + 0.3; // between 30% to 100% charge
      const carChargingDuration = Math.round(
        maxCarChargingDuration * randomChargingPercentage
      );

      const nextAvailableChargingPoint = availableChargingPoints.findIndex(
        (time) => time <= arrival
      );

      if (nextAvailableChargingPoint !== -1) {
        sessionsInfo.push({
          chargingPoint: nextAvailableChargingPoint + 1,
          sessionTime: Math.ceil(arrival / 60), //Convert it to hour of day
          duration: carChargingDuration,
        });
        availableChargingPoints[nextAvailableChargingPoint] =
          arrival + carChargingDuration;
      }
    });

    return sessionsInfo;
  }

  function chargingValuePerChargePoint(
    sessionsInfo: SessionsInfo[]
  ): Record<number, number> {
    const chargePointRecord: Record<number, number> = {};

    sessionsInfo.forEach(({ chargingPoint, duration }) => {
      const powerUsed = Math.round((duration / 60) * chargingPointPower);

      if (chargingPoint in chargePointRecord) {
        chargePointRecord[chargingPoint] += powerUsed;
      } else {
        chargePointRecord[chargingPoint] = powerUsed;
      }
    });
    return chargePointRecord;
  }

  function exemplaryDay(sessionsInfo: SessionsInfo[]): ExemplaryDay {
    const exemplaryDay: ExemplaryDay = {
      totalCarsCharged: sessionsInfo.length,
      peakTime: 0,
      totalEnergyCharged: 0,
      maxPowerDemand: 0,
      powerConsumedPerHour: {},
    };

    sessionsInfo.forEach((session) => {
      const hour = session.sessionTime;
      const sessionDuration = Math.round(session.duration / 60);

      if (hour in exemplaryDay.powerConsumedPerHour) {
        exemplaryDay.powerConsumedPerHour[hour] +=
          chargingPointPower * sessionDuration;
      } else {
        exemplaryDay.powerConsumedPerHour[hour] =
          chargingPointPower * sessionDuration;
      }
    });

    Object.entries(exemplaryDay.powerConsumedPerHour).forEach(
      ([hour, powerDemand]) => {
        if (powerDemand > exemplaryDay.maxPowerDemand) {
          exemplaryDay.maxPowerDemand = powerDemand;
          exemplaryDay.peakTime = Number(hour);
        }
        exemplaryDay.totalEnergyCharged += powerDemand;
      }
    );

    return exemplaryDay;
  }

  function chargingEvent(sessionsInfo: SessionsInfo[]): Record<number, number> {
    const chargingEvent: Record<number, number> = {};
    sessionsInfo.forEach(({ sessionTime }) => {
      if (sessionTime in chargingEvent) {
        chargingEvent[sessionTime] += 1;
      } else {
        chargingEvent[sessionTime] = 1;
      }
    });
    return chargingEvent;
  }

  return {
    chargingSessions,
    chargingValuePerChargePoint,
    exemplaryDay,
    chargingEvent,
  };
}
