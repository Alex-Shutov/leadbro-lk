import { create } from "zustand";
import { statisticsApi } from "../api/statistics.api";
import {
  getCurrentDateFormatted,
  getDayAgoFormatted,
  getMonthAgoFormatted,
  getWeekAgoFormatted,
} from "../lib/utils";

export const useStatisticsStore = create((set, get) => ({
  // Common state
  period: "days",
  setPeriod: (period) => {
    let start;
    const end = getCurrentDateFormatted();

    switch (period) {
      case "days":
        start = getCurrentDateFormatted();
        break;
      case "weeks":
        start = getWeekAgoFormatted();
        break;
      case "months":
        start = getMonthAgoFormatted();
        break;
      default:
        start = getWeekAgoFormatted();
    }

    set({
      period,
      dateRange: { start, end },
    });
  },
  dateRange: {
    start: getWeekAgoFormatted(),
    end: getCurrentDateFormatted(),
  },
  setDateRange: (dateRange) => set({ dateRange }),
  graphType: "line",
  setGraphType: (graphType) => set({ graphType }),

  // Visits data
  visits: null,
  visitsLoading: false,

  // Rejections data
  rejections: null,
  rejectionsLoading: false,

  // Goals data
  goals: null,
  goalsLoading: false,
  selectedConversion: "Показать все конверсии",
  setSelectedConversion: (conversion) =>
    set({ selectedConversion: conversion }),

  // Positions data
  positions: null,
  positionsLoading: false,

  // Keywords data
  keywords: null,
  keywordsLoading: false,
  cities: [],
  groups: [],
  selectedCities: [],
  selectedGroups: [],
  setSelectedCities: (cities) => set({ selectedCities: cities }),
  setSelectedGroups: (groups) => set({ selectedGroups: groups }),

  // Fetch actions
  fetchVisits: async () => {
    const { period, dateRange } = get();
    set({ visitsLoading: true });
    try {
      const response = await statisticsApi.fetchVisits(period, dateRange);
      set({ visits: response, visitsLoading: false });
    } catch (error) {
      console.error("Failed to fetch visits:", error);
      set({ visitsLoading: false });
    }
  },

  fetchRejections: async () => {
    const { period, dateRange } = get();
    set({ rejectionsLoading: true });
    try {
      const response = await statisticsApi.fetchRejections(period, dateRange);
      set({ rejections: response, rejectionsLoading: false });
    } catch (error) {
      console.error("Failed to fetch rejections:", error);
      set({ rejectionsLoading: false });
    }
  },

  fetchGoals: async () => {
    const { period, dateRange, selectedConversion } = get();
    set({ goalsLoading: true });
    try {
      const response = await statisticsApi.fetchGoals(period, {
        ...dateRange,
        conversion: selectedConversion,
      });
      set({ goals: response, goalsLoading: false });
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      set({ goalsLoading: false });
    }
  },

  fetchPositions: async () => {
    const { period, dateRange } = get();
    set({ positionsLoading: true });
    try {
      const response = await statisticsApi.fetchPositions(period, dateRange);
      set({ positions: response, positionsLoading: false });
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      set({ positionsLoading: false });
    }
  },

  fetchKeywords: async () => {
    const { period, dateRange, selectedCities, selectedGroups } = get();
    set({ keywordsLoading: true });
    try {
      const response = await statisticsApi.fetchKeywords(period, {
        ...dateRange,
        cities: selectedCities,
        groups: selectedGroups,
      });
      set({
        keywords: response.data.keywords,
        cities: response.data.cities,
        groups: response.data.groups,
        keywordsLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch keywords:", error);
      set({ keywordsLoading: false });
    }
  },

  // Initialize data
  initialize: async () => {
    const {
      fetchVisits,
      fetchRejections,
      fetchGoals,
      fetchPositions,
      fetchKeywords,
    } = get();
    await Promise.all([
      fetchVisits(),
      fetchRejections(),
      fetchGoals(),
      fetchPositions(),
      fetchKeywords(),
    ]);
  },
}));
