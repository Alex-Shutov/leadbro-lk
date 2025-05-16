import React from "react";
import { MetricCard } from "../../../widgets/statistics";

export const HomeMetrics = ({ metrics }) => {
  const requestsChartOptions = {
    xaxis: {
      type: "category",
      categories: ["Apr", "May", "Jun", "July", "Aug", "Sep"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      enabled: false,
    },
  };

  const goalsChartOptions = {
    ...requestsChartOptions,
  };

  const positionsChartOptions = {
    ...requestsChartOptions,
  };

  return (
    <div className="totals">
      <MetricCard
        title="Запросы"
        value={metrics.requests.total}
        percentage={metrics.requests.percentage}
        chartId="dashboard-products-earning"
        colors={["#83BF6E"]}
        series={[
          {
            name: "Запросы",
            data: [500, 1600, 1100, 1400, 1700, 800],
          },
        ]}
        chartOptions={requestsChartOptions}
      />
      <MetricCard
        title="Цели"
        value={metrics.goals.total}
        percentage={metrics.goals.percentage}
        chartId="dashboard-products-customer"
        colors={["#2A85FF"]}
        series={[
          {
            name: "Цели",
            data: [1400, 1700, 800, 500, 1600, 1100],
          },
        ]}
        chartOptions={goalsChartOptions}
      />
      <MetricCard
        title="Позиции"
        value={metrics.positions.total}
        percentage={metrics.positions.percentage}
        chartId="dashboard-products-payouts"
        colors={["#8E59FF"]}
        series={[
          {
            name: "Позиции",
            data: [800, 500, 1400, 1700, 1600, 1100],
          },
        ]}
        chartOptions={positionsChartOptions}
      />
    </div>
  );
};
