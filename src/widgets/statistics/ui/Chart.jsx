import React from "react";
import { Card } from "../../../shared/ui/card";
import { ChartCard } from "../../../shared/ui/card/ChartCard";

export const Chart = ({
  title,
  chartId,
  series,
  options,
  colors = ["#2A85FF"],
}) => {
  return (
    <Card>
      <div className="card__head">
        <div className="card__title">{title}</div>
      </div>
      <div className="card__body">
        <ChartCard
          id={chartId}
          className="card__chart_small card__chart_goals"
          series={series}
          colors={colors}
          options={options}
        />
      </div>
    </Card>
  );
};
