import React, { useEffect, useRef } from "react";
import cn from "classnames";
import ApexCharts from "apexcharts";

export const ChartCard = ({
  id,
  options = {},
  className,
  type = "line",
  height = "100%",
  series = [],
  colors = ["#2A85FF"],
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const defaultOptions = {
        chart: {
          height: height,
          type: type,
          toolbar: {
            show: false,
          },
          fontFamily: "Inter, sans-serif",
        },
        colors: colors,
        series: series,
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 4,
        },
        grid: {
          strokeDashArray: 0,
          padding: {
            top: -20,
            right: 0,
            bottom: 0,
            left: 10,
          },
        },
        legend: {
          show: false,
        },
      };

      const mergedOptions = { ...defaultOptions, ...options };
      const chart = new ApexCharts(chartRef.current, mergedOptions);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [chartRef, options, height, type, series, colors]);

  return (
    <div className={cn("card__chart", className)} id={id}>
      <div ref={chartRef}></div>
    </div>
  );
};
