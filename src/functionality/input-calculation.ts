import { ChargePointType } from "../App";
import { ExemplaryDay, SessionsInfo } from "../models/charging-sessions-model";
import { InputParameters } from "../models/input-parameters-model";

const TOTALMINUTES = 525600; // 365 days in minutes
const ENERGYOUTPUT11kW = 11;
const ENERGYOUTPUT22kW = 22;
const ENERGYOUTPUT50Kw = 50;

export function inputCalculation(
  inputParameters: InputParameters,
  chargePointType: ChargePointType
) {
  const {
    arrivalProbability,
    chargingPointPower,
    numberOfCarsPerHour,
    powerConsumedByCars,
    totalChargingPoint,
    chargingPoints11kW,
    chargingPoints22kW,
    chargingPoints50kW,
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

  function advancedChargingSession(): SessionsInfo[] {
    const maxCarChargingDuration11kW =
      (powerConsumedByCars / ENERGYOUTPUT11kW) * 60;
    const maxCarChargingDuration22kW =
      (powerConsumedByCars / ENERGYOUTPUT22kW) * 60;
    const maxCarChargingDuration50kW =
      (powerConsumedByCars / ENERGYOUTPUT50Kw) * 60;

    const arrivalTimes = getArrivalTime();

    const sessionsInfo: SessionsInfo[] = [];

    // Using Number(chargingPoints50kW) becasue chargingPoints50kW could be an empty string, so that empty string will be converted to 0.
    const availableChargingPoints = {
      50: Array(Number(chargingPoints50kW)).fill(0),
      22: Array(Number(chargingPoints22kW)).fill(0),
      11: Array(Number(chargingPoints11kW)).fill(0),
    };

    arrivalTimes.forEach((arrival) => {
      const stopSession =
        arrival + maxCarChargingDuration11kW > TOTALMINUTES ||
        arrival + maxCarChargingDuration22kW > TOTALMINUTES ||
        arrival + maxCarChargingDuration50kW > TOTALMINUTES;

      if (stopSession) return sessionsInfo;

      const randomChargingPercentage = Math.random() * 0.7 + 0.3;

      const nextAvailable50kW = availableChargingPoints[50].findIndex(
        (time) => time <= arrival
      );

      const nextAvailable22kW = availableChargingPoints[22].findIndex(
        (time) => time <= arrival
      );

      const nextAvailable11kW = availableChargingPoints[11].findIndex(
        (time) => time <= arrival
      );

      if (nextAvailable50kW !== -1) {
        const carChargingDuration = Math.round(
          maxCarChargingDuration50kW * randomChargingPercentage
        );

        sessionsInfo.push({
          chargingPoint: 50,
          sessionTime: Math.ceil(arrival / 60),
          duration: carChargingDuration,
        });

        availableChargingPoints[50][nextAvailable50kW] =
          arrival + carChargingDuration;
      } else if (nextAvailable22kW !== -1) {
        const carChargingDuration = Math.round(
          maxCarChargingDuration22kW * randomChargingPercentage
        );

        sessionsInfo.push({
          chargingPoint: 22,
          sessionTime: Math.ceil(arrival / 60),
          duration: carChargingDuration,
        });

        availableChargingPoints[22][nextAvailable22kW] =
          arrival + carChargingDuration;
      } else if (nextAvailable11kW !== -1) {
        const carChargingDuration = Math.round(
          maxCarChargingDuration11kW * randomChargingPercentage
        );

        sessionsInfo.push({
          chargingPoint: 11,
          sessionTime: Math.ceil(arrival / 60),
          duration: carChargingDuration,
        });

        availableChargingPoints[11][nextAvailable11kW] =
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
      const activeChargingPointPower =
        chargePointType === "Basic" ? chargingPointPower : chargingPoint;

      const powerUsed = Math.round((duration / 60) * activeChargingPointPower);

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
      const sessionDuration = session.duration / 60;

      const activeChargingPointPower =
        chargePointType === "Basic"
          ? chargingPointPower
          : session.chargingPoint;

      if (hour in exemplaryDay.powerConsumedPerHour) {
        exemplaryDay.powerConsumedPerHour[hour] +=
          activeChargingPointPower * sessionDuration;
      } else {
        exemplaryDay.powerConsumedPerHour[hour] =
          activeChargingPointPower * sessionDuration;
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
    advancedChargingSession,
  };
}
