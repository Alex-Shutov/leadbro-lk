import apiClient, {
  apiClient2,
  topvisorClient,
  yandexMetricaClient,
} from "../../../shared/api/client";
import {
  mapGoalsData,
  mapRejectionsData,
  mapTopVisorPositionsData,
  mapVisitsData,
} from "../lib/statistics.mapper";
import { formatDateForYandex } from "../lib/utils";

const COUNTER_ID = process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID;

export const statisticsApi = {
  fetchVisits: async (period, dateRange) => {
    try {
      // Format dates for Yandex Metrica
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
        // filters: "ym:s:trafficSource=='organic'",
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

  fetchRejections: async (period, dateRange) => {
    try {
      // Format dates for Yandex Metrica
      const startDate = formatDateForYandex(dateRange.start);
      const endDate = formatDateForYandex(dateRange.end);

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
        // Используем только поисковый трафик для расчета отказов
        // filters: "ym:s:trafficSource=='organic'",
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

  fetchGoals: async (period, params = {}) => {
    try {
      const { start, end, conversion } = params;
      const startDate = formatDateForYandex(start);
      const endDate = formatDateForYandex(end);

      // Сначала получаем список целей
      let goalsList = [];
      try {
        const goalsResponse = await apiClient2.get(
          `/api/cabinet/yandex/counter-goals`,
        );
        goalsList = goalsResponse.data.goals || [];
      } catch (error) {
        console.error("Error fetching goals list:", error);
      }

      // Если нет доступных целей, возвращаем пустые данные
      if (goalsList.length === 0) {
        return {
          data: {
            value: 0,
            change: 0,
            comparedTo: start,
            series: [{ name: "Конверсии", data: [] }],
            categories: [],
            conversions: ["Показать все конверсии"],
          },
        };
      }

      // Находим ID выбранной цели или берем первую цель по умолчанию
      let goalId;
      let selectedConversion = conversion || "Показать все конверсии";

      if (selectedConversion === "Показать все конверсии") {
        // Если выбраны все конверсии, берем первую цель для примера отображения
        goalId = goalsList[0].id;
      } else {
        // Находим выбранную цель
        const selectedGoal = goalsList.find(
          (goal) => goal.name === selectedConversion,
        );

        if (selectedGoal) {
          goalId = selectedGoal.id;
        } else {
          // Если цель не найдена, используем первую
          goalId = goalsList[0].id;
          selectedConversion = goalsList[0].name;
        }
      }

      // Параметры для запроса данных о конверсиях
      const requestParams = {
        ids: process.env.REACT_APP_YANDEX_METRICA_COUNTER_ID,
        dimensions: "ym:s:date",
        metrics: `ym:s:goal${goalId}conversionRate`,
        date1: startDate || "7daysAgo",
        date2: endDate || "today",
        group:
          period === "months" ? "month" : period === "weeks" ? "week" : "day",
        // filters: "ym:s:lastSignificantSource=='organic' AND ym:s:sourceEngine!='(not set)'",
      };

      // Выполняем запрос к API
      const response = await apiClient2.post(`/api/cabinet/yandex/stat`, {
        ...requestParams,
      });

      const mappedData = mapGoalsData(
        response.data,
        { goals: goalsList },
        { start, end },
        selectedConversion,
      );

      return {
        data: mappedData,
      };
    } catch (error) {
      console.error("Error fetching goals data:", error);

      // Возвращаем пустые данные в случае ошибки
      return {
        data: {
          value: 0,
          change: 0,
          comparedTo: params?.start,
          series: [{ name: "Конверсии", data: [] }],
          categories: [],
          conversions: ["Показать все конверсии"],
        },
      };
    }
  },

  fetchPositions: async (period, filters = {}) => {
    try {
      // Set up TopVisor API parameters
      const projectId = process.env.REACT_APP_TOPVISOR_PROJECT_ID;
      const searchEngineIds = filters.searchEngineIds || [1]; // 1 = Yandex
      const regionIds = filters.regionIds || [];

      // Calculate date range based on period
      const today = new Date();
      let startDate;
      let groupBy;

      if (period === "months") {
        // Last 6 months
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        groupBy = "month";
      } else if (period === "weeks") {
        // Last 8 weeks
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 8 * 7);
        groupBy = "week";
      } else {
        // Last 30 days (default)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        groupBy = "day";
      }

      // Format dates for TopVisor API
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(today);

      // 1. Get summary statistics (current counts of keywords in each position range)
      const summaryResponse = await topvisorClient.post(
        "/get/positions_2/summary",
        {
          project_id: projectId,
          date: endDateStr,
          search_engines: searchEngineIds,
          regions: regionIds.length > 0 ? regionIds : undefined,
        },
      );

      // 2. Get chart data for positions over time
      const chartResponse = await topvisorClient.post(
        "/get/positions_2/summary_chart",
        {
          project_id: projectId,
          // date1: startDateStr,
          // date2: endDateStr,
          // search_engines: searchEngineIds,
          // regions: regionIds.length > 0 ? regionIds : undefined,
          // group_by: groupBy,
          // tops: [3, 10, 30, 50, 100], // Position ranges to track
        },
      );

      // 3. Get all keywords to calculate total count and other metrics
      const keywordsResponse = await topvisorClient.post("/get/keywords_2", {
        project_id: projectId,
      });

      // Use mapper to transform the data
      const mappedData = mapTopVisorPositionsData(
        chartResponse.data,
        summaryResponse.data,
        keywordsResponse.data,
        { startDate: startDateStr, endDate: endDateStr, period },
      );

      return { data: mappedData };
    } catch (error) {
      console.error("Error fetching positions data:", error);
      // Return empty data structure in case of error
      return {
        data: {
          series: [],
          categories: [],
          stats: [
            { title: "Топ 1-3", count: 0, percentage: 0, color: "gray" },
            { title: "Топ 1-10", count: 0, percentage: 0, color: "orange" },
            { title: "Топ 1-30", count: 0, percentage: 0, color: "purple" },
            { title: "Топ 1-50", count: 0, percentage: 0, color: "green" },
            { title: "Все запросы", count: 0, percentage: 0, color: "default" },
            { title: "WS10", count: 0, percentage: 0, color: "yellow" },
            { title: "PTraf", count: 0, percentage: 0, color: "blue" },
          ],
        },
      };
    }
  },

  fetchKeywords: (period, filters = {}) => {
    return apiClient.get("/statistics/keywords", {
      params: { period, ...filters },
    });
  },
};
