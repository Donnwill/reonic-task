import {
  ChargingSessions,
  ExemplaryDay,
  SessionInfo,
} from "../models/charging-sessions-model";
import { InputParameters } from "../models/input-parameters-model";

const TOTALMINUTES = 1440; // 24 hours in minutes

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
  // and not be place in a queue, its pointless for the cars to wait until a place is freed.
  function chargingSessions(): ChargingSessions {
    const maxCarChargingDuration =
      (powerConsumedByCars / chargingPointPower) * 60;
    const arrivalTimes = getArrivalTime();

    const sessionsInfo: SessionInfo[] = [];
    const availableChargingPoints = Array(totalChargingPoint).fill(0);

    arrivalTimes.forEach((arrival) => {
      // Prevent adding session after 24 hours
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
          timeOfDay: arrival,
          duration: carChargingDuration,
        });
        availableChargingPoints[nextAvailableChargingPoint] =
          arrival + carChargingDuration;
      }
    });

    const chargingValuePerChargePointData =
      chargingValuePerChargePoint(sessionsInfo);
    const exemplaryDayData = exemplaryDay(sessionsInfo);
    const chargingEventsData = chargingEvents(sessionsInfo);

    return {
      chargingValuePerChargePoint: chargingValuePerChargePointData,
      exemplaryDay: exemplaryDayData,
      chargingEvents: chargingEventsData,
    };
  }

  function chargingValuePerChargePoint(
    sessionsInfo: SessionInfo[]
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

  function exemplaryDay(sessionsInfo: SessionInfo[]): ExemplaryDay {
    const exemplaryDay: ExemplaryDay = {
      totalCarsCharged: sessionsInfo.length,
      peakHour: 0,
      totalEnergyCharged: 0,
      maxPowerDemand: 0,
      powerConsumedPerHour: {},
    };

    sessionsInfo.forEach((session) => {
      const hour = Math.ceil(session.timeOfDay / 60);
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
          exemplaryDay.peakHour = Number(hour);
        }
        exemplaryDay.totalEnergyCharged += powerDemand;
      }
    );

    return exemplaryDay;
  }

  function chargingEvents(sessionsInfo: SessionInfo[]): Record<string, number> {
    const chargingEventPerDay = sessionsInfo.length;

    return {
      day: chargingEventPerDay,
      week: chargingEventPerDay * 7,
      month: chargingEventPerDay * 30,
      year: chargingEventPerDay * 365,
    };
  }

  return { chargingSessions };
}
