import React from "react";
import { Card } from "../../../shared/ui/card/Card";
import { ChartCard } from "../../../shared/ui/card/ChartCard";

export const MetricCard = ({
  title,
  value,
  percentage,
  chartId,
  chartOptions,
  series,
  colors,
}) => {
  return (
    <Card>
      <div className="card__body">
        <ChartCard
          id={chartId}
          className="card__chart_small card__chart_dashboard-products"
          series={series}
          colors={colors}
          options={chartOptions}
        />
        <div className="card__title">{title}</div>
        <div className="card__counter">{value}</div>
        <div className="card__indicator">
          <div
            className={`card__indicator-line card__indicator-line_${colors[0] === "#2A85FF" ? "blue" : colors[0] === "#83BF6E" ? "green" : "purple"}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
