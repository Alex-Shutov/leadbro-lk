import React, { useEffect, useState } from "react";
import { useStatisticsStore } from "../state/statistics.store";
import { PeriodSelector } from "../../../widgets/common/ui/PeriodSelector";
import { GraphTypeSelector } from "../widgets/GraphTypeSelector";
import { StatisticsTabs } from "./StatisticsTabs/StatisticsTabs";
import { YandexVisibility } from "../widgets/YandexVisibility";
import { KeywordsPositions } from "../widgets/KeywordsPostitions";
import { HowToModal } from "../widgets/HowToModal";
import { Layout } from "../../../shared/ui/layout";
import { useEffectOnce } from "../../../core/hooks/useEffectOnce";

export const StatisticsPage = () => {
  const {
    period,
    setPeriod,
    dateRange,
    setDateRange,
    graphType,
    setGraphType,
    visits,
    rejections,
    goals,
    visitsLoading,
    rejectionsLoading,
    goalsLoading,
    positionsLoading,
    keywordsLoading,
    positions,
    keywords,
    cities,
    groups,
    selectedConversion,
    setSelectedConversion,
    selectedCities,
    selectedGroups,
    setSelectedCities,
    setSelectedGroups,
    fetchVisits,
    fetchRejections,
    fetchGoals,
    fetchPositions,
    fetchKeywords,
  } = useStatisticsStore();

  const [howToModalOpen, setHowToModalOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState([
    "Топ 1-3",
    "Топ 1-10",
    "Топ 1-30",
    "Топ 1-50",
    "Все запросы",
    "WS10",
    "PTraf",
  ]);

  // // Initialize data when component mounts
  // useEffect(() => {
  //   initialize();
  // }, [initialize]);

  // Reload data when period or date range changes

  useEffect(() => {
    fetchVisits();
    fetchRejections();
    fetchGoals();
    fetchPositions();
    fetchKeywords();
  }, [period, dateRange]);

  // Reload goals when selected conversion changes
  useEffect(() => {
    fetchGoals();
  }, [selectedConversion]);

  // Reload keywords when selected cities or groups change
  useEffect(() => {
    fetchKeywords();
  }, [selectedCities, selectedGroups, fetchKeywords]);

  // Обработчик изменения выбранной конверсии
  const handleConversionChange = (newConversion) => {
    setSelectedConversion(newConversion);
  };

  return (
    <Layout>
      <div
        className="page__inner statistics-page"
        style={{ background: "#f4f4f4" }}
      >
        <div className="shop__control">
          <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <GraphTypeSelector type={graphType} onChange={setGraphType} />
        </div>

        <div className="page__row">
          <StatisticsTabs
            visits={visits?.data}
            rejections={rejections?.data}
            goals={goals?.data}
            visitsLoading={visitsLoading}
            rejectionsLoading={rejectionsLoading}
            goalsLoading={goalsLoading}
            graphType={graphType}
            selectedConversion={selectedConversion}
            onConversionChange={handleConversionChange}
          />
        </div>

        <YandexVisibility
          positions={positions}
          isLoading={positionsLoading}
          selectedStats={selectedStats}
          onStatsChange={setSelectedStats}
        />

        <KeywordsPositions
          keywords={keywords}
          cities={cities}
          groups={groups}
          selectedCities={selectedCities}
          selectedGroups={selectedGroups}
          onCitiesChange={setSelectedCities}
          onGroupsChange={setSelectedGroups}
          isLoading={keywordsLoading}
        />

        <HowToModal
          isOpen={howToModalOpen}
          onClose={() => setHowToModalOpen(false)}
        />

        <div
          className={`black-overlay ${howToModalOpen ? "active" : ""}`}
          onClick={() => setHowToModalOpen(false)}
        ></div>
      </div>
    </Layout>
  );
};
