import { ChargePointType } from "../App";
import {
  ChargingSessions,
  SessionsInfo,
} from "../models/charging-sessions-model";
import { InputParameters } from "../models/input-parameters-model";
import { inputCalculation } from "./input-calculation";

const HOURNSINDAY = 24;
const HOURSINWEEK = 168;
const HOURSINMONTH = 672; // Assume 28 days a week

export function visualiseSessionData(
  sessionsInfo: SessionsInfo[],
  inputParameters: InputParameters,
  chargePointType: ChargePointType
) {
  const calculateSessions = inputCalculation(inputParameters, chargePointType);

  function chargingSessionPerDay(): ChargingSessions {
    const daySession = sessionsInfo.filter(
      (session) => session.sessionTime < HOURNSINDAY
    );

    const chargingEvent = calculateSessions.chargingEvent(daySession);
    const chargingValuePerChargePoint =
      calculateSessions.chargingValuePerChargePoint(daySession);
    const exemplaryDay = calculateSessions.exemplaryDay(daySession);

    return {
      chargingEvent,
      chargingValuePerChargePoint,
      exemplaryDay,
      sessionsInfo: daySession,
    };
  }

  function chargingSessionPerWeek(): ChargingSessions {
    const weekSession = sessionsInfo.filter(
      (session) => session.sessionTime < HOURSINWEEK
    );

    const updatedWeekSession = weekSession.map((session) => {
      return {
        ...session,
        sessionTime: Math.ceil(session.sessionTime / HOURNSINDAY), // Timeframe to week
      };
    });

    const chargingEvent = calculateSessions.chargingEvent(updatedWeekSession);
    const chargingValuePerChargePoint =
      calculateSessions.chargingValuePerChargePoint(updatedWeekSession);
    const exemplaryDay = calculateSessions.exemplaryDay(updatedWeekSession);

    return {
      chargingEvent,
      chargingValuePerChargePoint,
      exemplaryDay,
      sessionsInfo: updatedWeekSession,
    };
  }

  function chargingSessionPerMonth(): ChargingSessions {
    const monthSession = sessionsInfo.filter(
      (session) => session.sessionTime < HOURSINMONTH
    );

    const updatedMonthSession = monthSession.map((session) => {
      return {
        ...session,
        sessionTime: Math.ceil(session.sessionTime / HOURSINWEEK), // Timeframe to month
      };
    });

    const chargingEvent = calculateSessions.chargingEvent(updatedMonthSession);
    const chargingValuePerChargePoint =
      calculateSessions.chargingValuePerChargePoint(updatedMonthSession);
    const exemplaryDay = calculateSessions.exemplaryDay(updatedMonthSession);

    return {
      chargingEvent,
      chargingValuePerChargePoint,
      exemplaryDay,
      sessionsInfo: updatedMonthSession,
    };
  }

  function chargingSessionPerYear(): ChargingSessions {
    const updatedYearSession = sessionsInfo.map((session) => {
      return {
        ...session,
        sessionTime: Math.ceil(session.sessionTime / 730), // Ensures all the values are within 12 months
      };
    });

    const chargingEvent = calculateSessions.chargingEvent(updatedYearSession);
    const chargingValuePerChargePoint =
      calculateSessions.chargingValuePerChargePoint(updatedYearSession);
    const exemplaryDay = calculateSessions.exemplaryDay(updatedYearSession);

    return {
      chargingEvent,
      chargingValuePerChargePoint,
      exemplaryDay,
      sessionsInfo: sessionsInfo,
    };
  }

  return {
    chargingSessionPerDay,
    chargingSessionPerWeek,
    chargingSessionPerMonth,
    chargingSessionPerYear,
  };
}
