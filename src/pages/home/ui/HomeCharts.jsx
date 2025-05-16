import React from "react";
import { Chart } from "../../../widgets/statistics";

export const HomeCharts = ({ charts }) => {
  const searchOptions = {
    xaxis: {
      type: "category",
      categories: charts.search.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  const rejectionsOptions = {
    xaxis: {
      type: "category",
      categories: charts.rejections.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  return (
    <div className="graphs__container">
      <Chart
        title="Поисковые запросы"
        chartId="search-visits"
        series={[
          {
            name: "Запросы",
            data: charts.search.data,
          },
        ]}
        options={searchOptions}
      />
      <Chart
        title="Отказы"
        chartId="rejections"
        series={[
          {
            name: "Отказы",
            data: charts.rejections.data,
          },
        ]}
        options={rejectionsOptions}
      />
    </div>
  );
};
