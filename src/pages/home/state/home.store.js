import { create } from "zustand";
import { homeApi } from "../api/home.api";

export const useHomeStore = create((set, get) => ({
  metrics: {
    requests: { total: 0, percentage: 0, trend: "up" },
    goals: { total: 0, percentage: 0, trend: "up" },
    positions: { total: 0, percentage: 0, trend: "down" },
  },
  charts: {
    search: { labels: [], data: [] },
    rejections: { labels: [], data: [] },
  },
  requests: [],
  isLoading: false,
  error: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await homeApi.getMetrics();
      set((state) => ({
        metrics: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Ошибка при загрузке метрик",
        isLoading: false,
      });
    }
  },

  fetchCharts: async () => {
    set({ isLoading: true, error: null });
    try {
      const [searchResponse, rejectionsResponse] = await Promise.all([
        homeApi.getSearchChart(),
        homeApi.getRejectionsChart(),
      ]);

      set((state) => ({
        charts: {
          search: searchResponse.data,
          rejections: rejectionsResponse.data,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Ошибка при загрузке графиков",
        isLoading: false,
      });
    }
  },

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await homeApi.getLatestRequests();
      set((state) => ({
        requests: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Ошибка при загрузке запросов",
        isLoading: false,
      });
    }
  },

  fetchAllData: async () => {
    const { fetchMetrics, fetchCharts, fetchRequests } = get();

    await Promise.all([fetchMetrics(), fetchCharts(), fetchRequests()]);
  },
}));
