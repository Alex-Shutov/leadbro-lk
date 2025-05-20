import React, { useEffect, useState } from "react";
import { useStatisticsStore } from "../state/statistics.store";
import { PeriodSelector } from "../../../widgets/common/ui/PeriodSelector";
import { GraphTypeSelector } from "../widgets/GraphTypeSelector";
import { StatisticsTabs } from "./StatisticsTabs/StatisticsTabs";
import { SearchEngineSelector } from "../../../widgets/common/ui/SearchEngineSelector";
import { RegionSelector } from "../../../widgets/common/ui/RegionSelector";
import { YandexVisibility } from "../widgets/YandexVisibility";
import { KeywordsPositions } from "../widgets/KeywordsPostitions";
import { HowToModal } from "../widgets/HowToModal";
import { Layout } from "../../../shared/ui/layout";
import {useEffectOnce} from "../../../core/hooks/useEffectOnce";

export const StatisticsPage = () => {
  const {
    period,

    setPeriod,
    dateRange,
    positionsDateRange,
    setPositionsDateRange,
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
    // New properties and methods
    fetchProjectData,
    projectDataLoading,
    searchers,
    regions,
    fetchGoalsList,
    selectedSearcher,
    selectedRegion,
    setSelectedSearcher,
    setSelectedRegion,
    isProjectDataLoaded,
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

  // Initialize data when component mounts
  useEffectOnce(() => {
    // First, fetch goals list
    fetchGoalsList()
    fetchProjectData()
  }, []);
  useEffect(() => {
    fetchVisits();
    fetchRejections();
    fetchGoals();
  }, [period, dateRange]);

  useEffect(() => {
    if (selectedConversion) {
      fetchGoals();
    }
  }, [selectedConversion]);

  // Reload positions when selected searcher or region changes
  useEffect(() => {
    if (isProjectDataLoaded && selectedSearcher && selectedRegion) {
      fetchPositions();
    }
  }, [selectedSearcher, selectedRegion, isProjectDataLoaded]);

  // Reload keywords when selected cities or groups change
  useEffect(() => {
    if (isProjectDataLoaded) {
      fetchKeywords();
    }
  }, [selectedCities, selectedGroups]);

  // Handle conversion change
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

        {/* Add search engine and region selectors */}



        <YandexVisibility
            positions={positions}
            isLoading={positionsLoading}
            selectedStats={selectedStats}
            onStatsChange={setSelectedStats}
            selectedSearcher={selectedSearcher}
            selectedRegion={selectedRegion}
            searchers={searchers}
            regions={regions}
            onSearcherChange={setSelectedSearcher}
            onRegionChange={setSelectedRegion}
            projectDataLoading={projectDataLoading}
            dateRange={positionsDateRange} // Используем отдельный dateRange
            onDateRangeChange={setPositionsDateRange} // И его метод обновления
            fetchPositions={fetchPositions}
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
