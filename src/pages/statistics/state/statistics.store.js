// src/pages/statistics/state/statistics.store.js

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
  setPositionsDateRange: (positionsDateRange) => set({ positionsDateRange }),
  positionsDateRange: {
    start: getMonthAgoFormatted(),
    end: getCurrentDateFormatted(),
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
  selectedConversion: null, // Changed from "Показать все конверсии" to null
  availableGoals: [], // New property to store all available goals
  availableGoalsLoading: false,
  setSelectedConversion: (conversion) => set({ selectedConversion: conversion }),

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
  searchers: [],
  regions: [],
  projectId: null,
  selectedSearcher: null, // Will store the selected searcher object
  selectedRegion: null, // Will store the selected region object
  isProjectDataLoaded: false,

  setSearchers: (searchers) => set({ searchers }),
  setRegions: (regions) => set({ regions }),
  setSelectedSearcher: (searcher) => {
    debugger
    // При изменении поисковика получаем соответствующие регионы
    const regions = searcher?.regions || [];
    // Выбираем первый регион из нового списка
    const defaultRegion = regions.length > 0 ? regions[0] : null;

    set({
      selectedSearcher: searcher,
      regions, // Обновляем список доступных регионов
      selectedRegion: defaultRegion // Устанавливаем первый регион по умолчанию
    });

    // После смены поисковика и региона загружаем новые данные позиций
    if (searcher && defaultRegion) {
      const { fetchPositions } = get();
      fetchPositions();
    }
  },

// Метод для изменения выбранного региона
  setSelectedRegion: (region) => {
    set({ selectedRegion: region });

    // После смены региона загружаем новые данные позицийo
    if (region) {
      const { fetchPositions } = get();
      fetchPositions();
    }
  },

  // Fetch actions
  fetchProjectData: async () => {
    try {
      set({ projectDataLoading: true });
      const response = await statisticsApi.fetchProjectData()

      set({
        ...response,
        projectId: response.projectData.id,
        selectedSearcher: response.defaultSearcher,
        selectedRegion: response.defaultRegion,
        projectDataLoading: false
      });

      if (response.defaultSearcher && response.defaultRegion) {
        const { fetchPositions } = get();
        fetchPositions();
      }

      return {
      ...response,
      };
    } catch (error) {
      console.error("Error fetching project data:", error);
      set({ projectDataLoading: false });
      return {
        projectData: null,
        searchers: [],
        defaultSearcher: null,
        regions: [],
        defaultRegion: null,
      };
    }
  },


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

  // New function to fetch goals list
  fetchGoalsList: async () => {
    try {
      const { availableGoals } = get();
      if (availableGoals.length !== 0) {
        return availableGoals
      }
      set({ availableGoalsLoading: true });

      const goalsList = await statisticsApi.fetchGoalsList();
      set({ availableGoals: goalsList });
      debugger
      // If we have goals but no selected conversion yet, select the first one
      if (goalsList.length > 0 && !get().selectedConversion) {
        set({ selectedConversion: goalsList[0].name });
      }
      set({availableGoalsLoading: false});
      return goalsList;
    } catch (error) {
      console.error("Error fetching goals list:", error);
      return [];
    }
  },

  // Updated goals fetch function
  fetchGoals: async () => {
    const { period, dateRange, selectedConversion, availableGoals,fetchGoalsList,availableGoalsLoading,goalsLoading } = get();
    try {
      if (availableGoalsLoading) {
        return
      }
      // If we don't have goals yet, fetch them first
      if (availableGoals.length === 0) {
        await fetchGoalsList();
      }

      // Get the current goals from state (in case they were updated)
      const goals = availableGoals;

      // If we have no selected conversion but have goals, select the first one
      let currentConversion = selectedConversion;
      if (!currentConversion && goals.length > 0) {
        currentConversion = goals[0].name;
        set({ selectedConversion: currentConversion });
      }

      // If we have a selected conversion and goals, fetch data for that conversion
      if (currentConversion && goals.length > 0 && !goalsLoading) {
        // Find the goal object that matches the selected conversion name
        const selectedGoal = goals.find(goal => goal.name === currentConversion);
        set({ goalsLoading: true });

        if (selectedGoal) {
          // Fetch goal data with the selected goal ID
          const response = await statisticsApi.fetchGoalData(period, {
            ...dateRange,
            goalId: selectedGoal.id,
            goalName: selectedGoal.name
          });

          set({
            goals: response,
            goalsLoading: false
          });
        } else {
          // If we couldn't find the selected goal, set a default empty state
          set({
            goals: {
              data: {
                value: 0,
                change: 0,
                comparedTo: dateRange.start,
                series: [{ name: currentConversion || "Нет данных", data: [] }],
                categories: [],
                conversions: goals.map(g => g.name)
              }
            },
            goalsLoading: false
          });
        }
      } else {
        // No goals or selected conversion - set empty state
        // set({
        //   goals: {
        //     data: {
        //       value: 0,
        //       change: 0,
        //       comparedTo: dateRange.start,
        //       series: [{ name: "Нет данных", data: [] }],
        //       categories: [],
        //       conversions: []
        //     }
        //   },
        //   goalsLoading: false
        // });
      }

    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  },

  fetchPositions: async () => {
    const { period, positionsDateRange, selectedSearcher, selectedRegion, projectId } = get();

    // Проверяем наличие необходимых данных
    if (!selectedSearcher || !selectedRegion || !projectId) {
      console.warn("Cannot fetch positions: searcher or region not selected");
      set({
        positions: {
          data: {
            series: [],
            categories: [],
            stats: [],
            topDynamics: {}
          }
        },
        positionsLoading: false
      });
      return null;
    }

    set({ positionsLoading: true });
    try {
      // Получаем searcherKey и regionKey для API
      const searcherKey = selectedSearcher.key;
      const regionKey = selectedRegion.key;

      // Вызываем API с необходимыми параметрами
      const response = await statisticsApi.fetchPositions(
          period,
          positionsDateRange,
          searcherKey,
          regionKey,
          projectId  // Используем ID проекта или значение по умолчанию
      );

      // Проверяем наличие данных в ответе
      if (!response || !response.data) {
        throw new Error("No data in positions response");
      }

      // Устанавливаем данные в store
      set({
        positions: { data: response.data },
        positionsLoading: false
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch positions:", error);

      // В случае ошибки устанавливаем пустые данные
      set({
        positions: {
          data: {
            series: [],
            categories: [],
            stats: [],
            topDynamics: {}
          }
        },
        positionsLoading: false
      });

      return null;
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
  // initialize: async () => {
  //   const {
  //     fetchGoalsList,
  //     fetchVisits,
  //     fetchRejections,
  //     fetchGoals,
  //     fetchPositions,
  //     fetchKeywords,
  //   } = get();
  //
  //   // First fetch the goals list
  //   await fetchGoalsList();
  //
  //   // Then fetch all data in parallel
  //   await Promise.all([
  //     fetchVisits(),
  //     fetchRejections(),
  //     fetchGoals(),
  //     fetchPositions(),
  //     fetchKeywords(),
  //   ]);
  // },
}));