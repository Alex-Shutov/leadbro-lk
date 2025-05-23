import apiClient, {
  apiClient2,
  topvisorClient,
  yandexMetricaClient,
} from "../../../shared/api/client";
import {
  mapGoalsData,
  mapKeywordsData,
  mapPositionsData,
  mapRejectionsData,
  mapSummaryChartData,
  mapTopVisorPositionsData,
  mapTopVisorProjectData,
  mapVisitsData,
} from "../lib/statistics.mapper";
import { formatDateForYandex } from "../lib/utils";
import { getActiveServiceTypeFromStorage } from "../../../core/lib/utils";

const COUNTER_ID = process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID;

export const statisticsApi = {
  fetchVisits: async (period, dateRange, serviceType) => {
    try {
      // Format dates for Yandex Metrica
      let trafficFilter = "";
      if (serviceType === "target") {
        // Для SEO - только органический трафик из поисковых систем
        trafficFilter = "ym:s:trafficSource=='organic'";
      } else if (serviceType === "context") {
        // Для контекстной рекламы - только трафик из рекламных систем
        trafficFilter = "ym:s:trafficSource=='ad'";
      }
      const startDate = formatDateForYandex(dateRange.start);
      const endDate = formatDateForYandex(dateRange.end);

      // // For development/testing, use mock data
      // if (process.env.REACT_APP_USE_MOCKS === "true") {
      //   console.log("Using mock data for visits");
      //   return Promise.resolve(statisticsMocks.visits);
      // }

      // Real API call
      const response = await apiClient2.post(`/api/cabinet/yandex/stat`, {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        metrics: "ym:s:visits",
        dimensions: "ym:s:date",
        date1: startDate || "7daysAgo",
        date2: endDate || "today",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
        compare_periods: "1",
        filters: trafficFilter,
      });

      return {
        data: mapVisitsData(response.data, dateRange, period),
      };
    } catch (error) {
      console.error("Error fetching visits data:", error);
      // Return mock data on error for dev purposes
      // if (process.env.NODE_ENV === "development") {
      //   console.log("Using mock data due to error");
      //   return statisticsMocks.visits;
      // }
      throw error;
    }
  },

  fetchRejections: async (period, dateRange, serviceType) => {
    try {
      // Format dates for Yandex Metrica
      const startDate = formatDateForYandex(dateRange.start);
      const endDate = formatDateForYandex(dateRange.end);
      let trafficFilter = "";
      if (serviceType === "target") {
        // Для SEO - только органический трафик из поисковых систем
        trafficFilter = "ym:s:trafficSource=='organic'";
      } else if (serviceType === "context") {
        // Для контекстной рекламы - только трафик из рекламных систем
        trafficFilter = "ym:s:trafficSource=='ad'";
      }
      // For development/testing, use mock data
      // if (process.env.REACT_APP_USE_MOCKS === "true") {
      //   console.log("Using mock data for rejections");
      //   return Promise.resolve(statisticsMocks.rejections);
      // }

      // Real API call
      const response = await apiClient2.post(`/api/cabinet/yandex/stat`, {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        metrics: "ym:s:bounceRate", // Процент отказов
        dimensions: "ym:s:date",
        date1: startDate || "7daysAgo",
        date2: endDate || "today",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
        compare_periods: "1",
        filters: trafficFilter,
      });

      // Map the data before returning
      return {
        data: mapRejectionsData(response.data, dateRange),
      };
    } catch (error) {
      console.error("Error fetching rejections data:", error);
      // Return mock data on error for dev purposes
      // if (process.env.NODE_ENV === "development") {
      //   console.log("Using mock data due to error");
      //   return statisticsMocks.rejections;
      // }
      throw error;
    }
  },
  fetchGoalsList: async () => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/yandex/counter-goals`,
      );
      return response.data.goals || [];
    } catch (error) {
      console.error("Error fetching goals list:", error);
      return [];
    }
  },

  fetchGoalData: async (period, params = {}) => {
    try {
      const { start, end, goalId, goalName } = params;

      if (!goalId) {
        throw new Error("Goal ID is required");
      }

      const startDate = formatDateForYandex(start);
      const endDate = formatDateForYandex(end);

      // Parameters for the API request for the specific goal
      const requestParams = {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        dimensions: "ym:s:date",
        metrics: `ym:s:goal${goalId}conversionRate`,
        date1: startDate || "7daysAgo",
        date2: endDate || "today",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
      };

      // Execute API request
      const response = await apiClient2.post(`/api/cabinet/yandex/stat`, {
        ...requestParams,
      });

      // Get all goals to include in the mapped data
      const goalsResponse = await apiClient2.get(
        `/api/cabinet/yandex/counter-goals`,
      );
      const goalsList = goalsResponse.data.goals || [];

      // Map the data to the expected format
      const mappedData = mapGoalsData(
        response.data,
        { goals: goalsList },
        { start, end },
        goalName,
      );

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error fetching goal data:", error);
      throw error;
    }
  },
  fetchGoals: async (period, params = {}) => {
    try {
      const { start, end, conversion } = params;

      // If no conversion is specified, fetch the list of goals first
      if (!conversion) {
        const goalsList = await statisticsApi.fetchGoalsList();

        // If there are no goals, return empty data
        if (goalsList.length === 0) {
          return {
            data: {
              value: 0,
              change: 0,
              comparedTo: start,
              series: [{ name: "Конверсии", data: [] }],
              categories: [],
              conversions: [],
            },
          };
        }

        // Use the first goal by default
        const firstGoal = goalsList[0];

        // Fetch data for this goal
        return await statisticsApi.fetchGoalData(period, {
          start,
          end,
          goalId: firstGoal.id,
          goalName: firstGoal.name,
        });
      }

      // If a specific conversion was requested, find it in the goals list
      const goalsList = await statisticsApi.fetchGoalsList();
      const selectedGoal = goalsList.find((goal) => goal.name === conversion);

      if (selectedGoal) {
        // Fetch data for the selected goal
        return await statisticsApi.fetchGoalData(period, {
          start,
          end,
          goalId: selectedGoal.id,
          goalName: selectedGoal.name,
        });
      } else {
        // If the goal wasn't found, return empty data
        return {
          data: {
            value: 0,
            change: 0,
            comparedTo: start,
            series: [{ name: conversion || "Конверсии", data: [] }],
            categories: [],
            conversions: goalsList.map((goal) => goal.name),
          },
        };
      }
    } catch (error) {
      console.error("Error fetching goals data:", error);

      // Return empty data in case of error
      return {
        data: {
          value: 0,
          change: 0,
          comparedTo: params?.start,
          series: [{ name: "Конверсии", data: [] }],
          categories: [],
          conversions: [],
        },
      };
    }
  },

  fetchProjectData: async () => {
    const response = await apiClient2.post("/api/cabinet/topvisor/projects", {
      show_site_stat: true,
      show_searchers_and_regions: "1",
      include_positions_summary: true,
    });
    debugger;
    const projectData = response.data;
    const searchers = projectData?.searchers || [];

    const defaultSearcher =
      searchers.find((s) => s.name === "Yandex") ||
      (searchers.length > 0 ? searchers[0] : null);
    const regions = defaultSearcher?.regions || [];
    const defaultRegion = regions.length > 0 ? regions[0] : null;
    return {
      projectData,
      searchers,
      defaultSearcher,
      regions,
      defaultRegion,
    };
  },

  fetchPositions: async (
    period,
    dateRange,
    searcherKey = null,
    regionKey = null,
    projectId = null,
  ) => {
    try {
      // Check for required parameters
      if (searcherKey === null || regionKey === null) {
        console.warn("SearcherKey or regionKey not provided to fetchPositions");
        return {
          data: {
            series: [],
            categories: [],
            stats: [],
            topDynamics: {},
            visibility: [],
          },
        };
      }

      // Get project ID
      const finalProjectId =
        projectId || process.env.REACT_APP_TOPVISOR_PROJECT_ID || "7292013";

      // Format dates for API - convert from DD.MM.YYYY to YYYY-MM-DD
      let fromDate, toDate;

      if (dateRange.start && dateRange.start.includes(".")) {
        const parts = dateRange.start.split(".");
        if (parts.length === 3) {
          fromDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else {
        fromDate = dateRange.apiStart || "2025-03-01";
      }

      if (dateRange.end && dateRange.end.includes(".")) {
        const parts = dateRange.end.split(".");
        if (parts.length === 3) {
          toDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else {
        toDate = dateRange.apiEnd || "2025-03-30";
      }

      console.log(
        `Fetching positions for searcher: ${searcherKey}, region: ${regionKey}, from: ${fromDate}, to: ${toDate}`,
      );

      // Call the new API endpoint
      const positionsResponse = await apiClient2.post(
        `/api/cabinet/topvisor/summary-chart`,
        {
          project_id: finalProjectId,
          type_range: 1,
          region_index: regionKey.toString(),
          from: fromDate,
          to: toDate,
          show_tops: 1,
          show_visibility: 1,
        },
      );

      // Use the new mapper
      const mappedData = mapSummaryChartData(
        positionsResponse.data,
        finalProjectId,
      );

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error fetching positions data:", error);
      // Return empty structure in case of error
      return {
        data: {
          series: [],
          categories: [],
          stats: [
            { title: "Топ 1-3", count: 0, percentage: 0, color: "gray" },
            { title: "Топ 1-10", count: 0, percentage: 0, color: "orange" },
            { title: "Топ 11-30", count: 0, percentage: 0, color: "purple" },
            { title: "Топ 31-50", count: 0, percentage: 0, color: "green" },
            { title: "Топ 51-100", count: 0, percentage: 0, color: "blue" },
            { title: "Топ 101+", count: 0, percentage: 0, color: "red" },
            { title: "Все запросы", count: 0, percentage: 0, color: "default" },
          ],
          topDynamics: {},
          visibility: [],
        },
      };
    }
  },

  fetchKeywordPositions: async (params) => {
    try {
      // Convert dates to required format
      const fromDate =
        formatDateForYandex(params.from) ||
        params.apiFrom ||
        new Date().toISOString().slice(0, 10);
      const toDate =
        formatDateForYandex(params.to) ||
        params.apiTo ||
        new Date().toISOString().slice(0, 10);

      // Build request body
      const requestBody = {
        regions_indexes: [params.regionIndex || 84], // Default to region index 84 if not provided
        from: fromDate,
        to: toDate,
        type_range: params.typeRange || "0", // Default type_range
        show_headers: true,
        positions_fields: ["position"],
        fields: [
          `volume:${params.regionKey || 54}:${params.searcherKey || 0}:1`,
        ],
      };

      // // Add filtering by cities if provided
      // if (params.selectedCities && params.selectedCities.length > 0) {
      //   // Note: This is a placeholder - you'd need to adjust based on how filtering is actually implemented
      //   requestBody.filter_cities = params.selectedCities;
      // }

      // // Add filtering by groups if provided
      // if (params.selectedGroups && params.selectedGroups.length > 0) {
      //   // Note: This is a placeholder - you'd need to adjust based on how filtering is actually implemented
      //   requestBody.filter_groups = params.selectedGroups;
      // }

      // Make the API call
      const response = await apiClient2.post(
        "/api/cabinet/topvisor/history",
        requestBody,
      );

      // Map the response data
      return mapKeywordsData(response.data);
    } catch (error) {
      console.error("Error fetching keyword positions:", error);
      return {
        keywords: [],
        cities: [],
        groups: [],
      };
    }
  },
};
