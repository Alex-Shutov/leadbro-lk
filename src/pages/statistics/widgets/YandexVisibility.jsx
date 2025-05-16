import React, { useState } from "react";
import { Icon } from "../../../shared/ui/icon";
import { Chart } from "../../../shared/ui/chart";
import { InfoModal } from "./InfoModal";

export const YandexVisibility = ({
  positions,
  isLoading,
  selectedStats,
  onStatsChange,
}) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Filter series based on selected stats
  const filteredSeries = React.useMemo(() => {
    if (!positions || !positions.data || !positions.data.series) return [];
    return positions.data.series.filter((series) =>
      selectedStats.includes(series.name),
    );
  }, [positions, selectedStats]);

  return (
    <div className="requests">
      <div className="requests__titles">
        <h2>Видимость Яндекс</h2>
        <button
          className="button-square-stroke button-small filters__head"
          onClick={() => setInfoModalOpen(true)}
        >
          <Icon name="info" />
        </button>
      </div>
      <div className="requests__checkboxes">
        {positions?.data?.stats?.map((stat, index) => (
          <div
            key={index}
            className={`requests__checkboxes-item _${stat.color}`}
          >
            <label className="checkbox">
              <input
                className="checkbox__input"
                name="position_stats"
                type="checkbox"
                checked={selectedStats.includes(stat.title)}
                onChange={() => {
                  if (selectedStats.includes(stat.title)) {
                    onStatsChange(
                      selectedStats.filter((s) => s !== stat.title),
                    );
                  } else {
                    onStatsChange([...selectedStats, stat.title]);
                  }
                }}
              />
              <span className="checkbox__inner">
                <span className="checkbox__tick"></span>
              </span>
            </label>
            <div>
              <div className="checkboxes-item__title">{stat.title}</div>
              <p>
                {stat.count} <span>({stat.percentage}%)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="card__chart card__chart_search_visits"
        style={{ marginTop: "40px" }}
      >
        <Chart
          id="positions-chart"
          type="line"
          series={filteredSeries}
          categories={positions?.data?.categories || []}
          isLoading={isLoading}
        />
      </div>

      {infoModalOpen && (
        <InfoModal
          title="Видимость Яндекс"
          description="Этот график показывает видимость сайта в поисковой системе Яндекс. Видимость отражает, насколько хорошо ваш сайт представлен в поисковых результатах по отслеживаемым запросам."
          onClose={() => setInfoModalOpen(false)}
        />
      )}
    </div>
  );
};
