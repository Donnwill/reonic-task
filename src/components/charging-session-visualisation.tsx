import React from "react";
import { GraphContainer } from "./Graph-container";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { useChargingSessionsState } from "../provider/charging-sessions-provider";
import { visualiseSessionData } from "../functionality/visualise-session-data";
import { useInputParametersState } from "../provider/input-parameters-provider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type SessionVisualisationProps = {
  tabName: string;
};

const GRAPHCONTAINERSTYLE = `sm:w-[10rem] md:w-[18rem] lg:w-[25rem] xl:w-[35rem] sm:h-[12rem] 
md:h-[14rem] lg:h-[16rem] xl:h-[18rem]`;

const DAYOFWEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const WEEKINMONTH = ["Week 1", "Week 2", "Week 3", "Week 4"];
const MONTHSINYEAR = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ChargingSessionVisualisation: React.FC<
  SessionVisualisationProps
> = ({ tabName }) => {
  const { chargingSessionsState } = useChargingSessionsState();
  const { inputParametersState } = useInputParametersState();

  const visualiseSession = visualiseSessionData(
    chargingSessionsState.sessionsInfo,
    inputParametersState
  );

  const chargingSession = (function chargingSession() {
    switch (tabName) {
      case "Day":
        return visualiseSession.chargingSessionPerDay();
      case "Week":
        return visualiseSession.chargingSessionPerWeek();
      case "Month":
        return visualiseSession.chargingSessionPerMonth();
      case "Year":
        return visualiseSession.chargingSessionPerYear();
      default:
        return visualiseSession.chargingSessionPerDay();
    }
  })();

  const chargingValuePerChargePoint = Object.values(
    chargingSession.chargingValuePerChargePoint
  );
  const chargePoints = Object.keys(
    chargingSession.chargingValuePerChargePoint
  );

  const powerConsumedPerHour = Object.values(
    chargingSession.exemplaryDay.powerConsumedPerHour
  );
  const powerConsumedTimeStamp = Object.keys(
    chargingSession.exemplaryDay.powerConsumedPerHour
  );

  const chargingEvent = Object.values(chargingSession.chargingEvent);
  const chargingEventTimeStamp = Object.keys(
    chargingSession.chargingEvent
  );

  const maxPowerDemand = chargingSession.exemplaryDay.maxPowerDemand;
  const totalEnergyCharged =
    chargingSession.exemplaryDay.totalEnergyCharged;
  const peakTime = chargingSession.exemplaryDay.peakTime;
  const TotalCarCharged = chargingSession.exemplaryDay.totalCarsCharged;

  const displayPeak =
    tabName === "Day"
      ? `${peakTime} Hour`
      : tabName === "Week"
      ? DAYOFWEEK[peakTime - 1]
      : tabName === "Month"
      ? WEEKINMONTH[peakTime - 1]
      : MONTHSINYEAR[peakTime - 1]; // -1 to get the correct Index

  const timeStampText =
    tabName === "Day"
      ? "Timestamp (24 hours)"
      : tabName === "Week"
      ? "Timestamp (1 Weeks)"
      : tabName === "Month"
      ? "Timestamp (1 Month)"
      : "Timestamp (1 Year)";

  const chargePointData = {
    labels: chargePoints,
    datasets: [
      {
        label: "Charge Point Value",
        data: chargingValuePerChargePoint,
        backgroundColor: "rgba(26, 132, 229)",
      },
    ],
  };

  const powerConsumedPerHourData = {
    labels:
      tabName === "Day"
        ? powerConsumedTimeStamp
        : tabName === "Week"
        ? DAYOFWEEK
        : tabName === "Month"
        ? WEEKINMONTH
        : MONTHSINYEAR,
    datasets: [
      {
        label: "Power Consumed Per Hour",
        data: powerConsumedPerHour,
        backgroundColor: "rgba(26, 132, 229)",
      },
    ],
  };

  const chargingEventData = {
    labels:
      tabName === "Day"
        ? chargingEventTimeStamp
        : tabName === "Week"
        ? DAYOFWEEK
        : tabName === "Month"
        ? WEEKINMONTH
        : MONTHSINYEAR,
    datasets: [
      {
        label: "Charging Event Per Hour",
        data: chargingEvent,
        fill: false,
        borderColor: "rgba(26, 132, 229)",
        pointBackgroundColor: "rgba(174, 50, 14, 1)",
        pointBorderColor: "rgba(174, 50, 14, 1)",
        pointRadius: 3,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4">
        <GraphContainer className={GRAPHCONTAINERSTYLE}>
          <Bar
            data={chargePointData}
            options={chartOptions(
              "Number of charge points",
              "Charge Point Value (kWh)"
            )}
          />
        </GraphContainer>
        <div className="flex flex-row justify-center gap-2">
          <p className="font-figtreeBold text-casper text-md">{`Total Energy Charged: `}</p>
          <p className="font-figtreeBold text-white text-md">
            {totalEnergyCharged} kWh
          </p>
        </div>
        <GraphContainer className={GRAPHCONTAINERSTYLE}>
          <Line
            data={chargingEventData}
            options={chartOptions(timeStampText, "Charging Event")}
          />
        </GraphContainer>
        <div className="flex flex-row justify-center gap-2">
          <p className="font-figtreeBold text-casper text-md">{`Total Car Charged: `}</p>
          <p className="font-figtreeBold text-white text-md">
            {TotalCarCharged} Cars
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <GraphContainer className={GRAPHCONTAINERSTYLE}>
          <Bar
            data={powerConsumedPerHourData}
            options={chartOptions(timeStampText, "Power Consumed (kWh)")}
          />
        </GraphContainer>
        <div className="flex flex-row justify-center gap-2">
          <p className="font-figtreeBold text-casper text-md">{`Max Power Demand: `}</p>
          <p className="font-figtreeBold text-white text-md">
            {maxPowerDemand} kWh
          </p>
        </div>
        <div className="flex flex-row justify-center gap-2">
          <p className="font-figtreeBold text-casper text-md">{`Peak Time: `}</p>
          <p className="font-figtreeBold text-white text-md">{displayPeak}</p>
        </div>
      </div>
    </div>
  );
};

function chartOptions(xAxisName: string, yAxisName: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(45, 51, 57)",
        },
        ticks: {
          color: "rgba(145, 153, 161)",
          padding: 0,
          font: {
            family: "IBM",
          },
        },
        title: {
          display: true,
          text: xAxisName,
          color: "rgba(145, 153, 161)",
          font: {
            family: "Figtree-SemiBold",
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(45, 51, 57)",
        },
        ticks: {
          color: "rgba(145, 153, 161)",
          padding: 0,
          font: {
            family: "IBM",
          },
        },
        title: {
          display: true,
          text: yAxisName,
          color: "rgba(145, 153, 161)",
          font: {
            family: "Figtree-SemiBold",
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255)",
          font: {
            family: "Figtree-SemiBold",
            size: 14,
          },
          padding: 0,
        },
      },
    },
  };
}
