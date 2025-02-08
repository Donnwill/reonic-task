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

const GRAPHCONTAINERSTYLE = `sm:w-[10rem] md:w-[18rem] lg:w-[25rem] xl:w-[35rem] sm:h-[12rem] 
md:h-[14rem] lg:h-[16rem] xl:h-[18rem]`;

export const DaySession: React.FC = () => {
  const { chargingSessionsState } = useChargingSessionsState();

  const chargingValuePerChargePoint = Object.values(
    chargingSessionsState.chargingValuePerChargePoint
  );
  const chargePoints = Object.keys(
    chargingSessionsState.chargingValuePerChargePoint
  );

  const powerConsumedPerHour = Object.values(
    chargingSessionsState.exemplaryDay.powerConsumedPerHour
  );
  const powerConsumedTimeStamp = Object.keys(
    chargingSessionsState.exemplaryDay.powerConsumedPerHour
  );

  const chargingEvent = Object.values(chargingSessionsState.chargingEvent);
  const chargingEventTimeStamp = Object.keys(
    chargingSessionsState.chargingEvent
  );

  const maxPowerDemand = chargingSessionsState.exemplaryDay.maxPowerDemand;
  const totalEnergyCharged =
    chargingSessionsState.exemplaryDay.totalEnergyCharged;
  const peakHour = chargingSessionsState.exemplaryDay.peakHour;
  const TotalCarCharged = chargingSessionsState.exemplaryDay.totalCarsCharged;

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
    labels: powerConsumedTimeStamp,
    datasets: [
      {
        label: "Power Consumed Per Hour",
        data: powerConsumedPerHour,
        backgroundColor: "rgba(26, 132, 229)",
      },
    ],
  };

  const chargingEventData = {
    labels: chargingEventTimeStamp,
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
              "Charge Point Value"
            )}
          />
        </GraphContainer>
        <p className="flex justify-center font-figtreeBold text-white text-md">{`Total Energy Charged: ${totalEnergyCharged} kWh`}</p>
        <GraphContainer className={GRAPHCONTAINERSTYLE}>
          <Line
            data={chargingEventData}
            options={chartOptions("Timestamp", "Charging Event")}
          />
        </GraphContainer>
        <p className="flex justify-center font-figtreeBold text-white text-md">{`Total Car Charged: ${TotalCarCharged}`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <GraphContainer className={GRAPHCONTAINERSTYLE}>
          <Bar
            data={powerConsumedPerHourData}
            options={chartOptions("Timestamp", "Power Consumed")}
          />
        </GraphContainer>

        <p className="flex justify-center font-figtreeBold text-white text-md">{`Max Power Demand: ${maxPowerDemand} kWh`}</p>
        <p className="flex justify-center font-figtreeBold text-white text-md">{`Peak Hour: ${peakHour}`}</p>
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
