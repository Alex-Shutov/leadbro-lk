// src/pages/statistics/widgets/YandexVisibility.jsx
import React, { useState } from "react";
import { Chart } from "../../../shared/ui/chart";
import { InfoModal } from "./InfoModal";
import { Icon } from "../../../shared/ui/icon";
import {SearchEngineSelector} from "../../../widgets/common/ui/SearchEngineSelector";
import {RegionSelector} from "../../../widgets/common/ui/RegionSelector";

export const YandexVisibility = ({
                                     positions,
                                     isLoading,
                                     selectedStats,
                                     onStatsChange,
                                     selectedSearcher,
                                     selectedRegion,
                                     searchers,
                                     regions,
                                     onSearcherChange,
                                     onRegionChange,
                                     projectDataLoading
                                 }) => {
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    // Filter series based on selected stats
    const filteredSeries = React.useMemo(() => {
        if (!positions || !positions.data || !positions.data.series) return [];
        return positions.data.series.filter((series) =>
            selectedStats.includes(series.name)
        );
    }, [positions, selectedStats]);

    // Get the search engine name - default to "Яндекс" if not available
    const searcherName = selectedSearcher?.name || "Яндекс";

    return (
        <div className="requests">
            <div className="requests__titles">
                <h2>Видимость {searcherName}</h2>
                <button
                    className="button-square-stroke button-small filters__head"
                    onClick={() => setInfoModalOpen(true)}
                >
                    <Icon name="info" />
                </button>
            </div>


            <div className="selectors-container" style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <SearchEngineSelector
                    searchers={searchers}
                    selectedSearcher={selectedSearcher}
                    onSearcherChange={onSearcherChange}
                    isLoading={projectDataLoading}
                />

                <RegionSelector
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onRegionChange={onRegionChange}
                    isLoading={projectDataLoading}
                />
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
                                            selectedStats.filter((s) => s !== stat.title)
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
                    title={`Видимость ${searcherName}`}
                    description={`Этот график показывает видимость сайта в поисковой системе ${searcherName}. Видимость отражает, насколько хорошо ваш сайт представлен в поисковых результатах по отслеживаемым запросам.`}
                    onClose={() => setInfoModalOpen(false)}
                />
            )}
        </div>
    );
};