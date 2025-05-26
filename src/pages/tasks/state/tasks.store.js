import { create } from "zustand";
import { tasksApi } from "../api/tasks.api";
import {
  createColumnsFromGroupedTasks,
  groupTasksByStatus,
  mapTaskFromApi,
} from "../lib/mapper";
import {
  colorTaskCategories,
  taskCategories,
  taskCategoriesRu,
} from "../lib/constants";

export const useTasksStore = create(
  (set, get) => ({
    tasks: [],
    columns: [],
    selectedTask: null,
    categories: [],
    months: [],
    selectedCategory: null,
    selectedMonth: "Выбрать месяц",
    serviceId: null,
    isLoading: false,
    error: null,

    // Установить ID услуги
    setServiceId: (id) => {
      set({ serviceId: id });
    },

    // Получить задачи по услуге
    fetchTasksByService: async (serviceId) => {
      debugger;
      const id = serviceId || get().serviceId;
      if (!id) return;

      set({ isLoading: true, error: null });
      try {
        const response = await tasksApi.getTasksByService(id);

        // Маппинг данных API в формат для фронтенда
        const mappedTasks = response.map(mapTaskFromApi);

        // Группировка задач по статусам
        const groupedTasks = groupTasksByStatus(mappedTasks);

        // Создание колонок на основе сгруппированных задач
        const columns = createColumnsFromGroupedTasks(groupedTasks);

        set({
          tasks: mappedTasks,
          columns,
          isLoading: false,
          // Если категории не были загружены, создаем их из полученных задач
          categories: get().categories.length
            ? get().categories
            : extractCategoriesFromTasks(mappedTasks),
        });
      } catch (error) {
        set({
          error: error.message || "Произошла ошибка при загрузке задач",
          isLoading: false,
        });
      }
    },

    // Получить все категории задач
    fetchCategories: async () => {
      set({ isLoading: true, error: null });
      try {
        // Преобразуем наши константы в массив категорий
        const categories = Object.keys(taskCategories).map((key) => ({
          id: key,
          key,
          label: taskCategoriesRu[key],
          ...colorTaskCategories[key],
        }));

        set({ categories, isLoading: false });
      } catch (error) {
        set({
          error: error.message || "Произошла ошибка при загрузке категорий",
          isLoading: false,
          categories: [], // или можно оставить дефолтные категории
        });
      }
    },
    // Получение задач с фильтрацией по категории и месяцу
    fetchTasks: async () => {
      console.log("fetchTasks TRIGGERED", {
        serviceId: get().serviceId,
        category: get().selectedCategory,
        month: get().selectedMonth,
      });
      const { selectedCategory, selectedMonth, serviceId } = get();
      debugger;
      if (!serviceId) return;

      set({ isLoading: true, error: null });
      try {
        let response = await tasksApi.getTasksByService(serviceId);

        // Фильтрация по категории, если она выбрана
        if (selectedCategory) {
          response = response.filter((task) => task.type === selectedCategory);
        }

        // Фильтрация по месяцу может быть добавлена при необходимости

        // Маппинг и группировка как в fetchTasksByService
        const mappedTasks = response.map(mapTaskFromApi);
        const groupedTasks = groupTasksByStatus(mappedTasks);
        const columns = createColumnsFromGroupedTasks(groupedTasks);

        set({ tasks: mappedTasks, columns, isLoading: false });
      } catch (error) {
        set({
          error: error.message || "Произошла ошибка при загрузке задач",
          isLoading: false,
        });
      }
    },

    // Получить все доступные месяцы для фильтрации
    fetchMonths: async () => {
      set({ isLoading: true, error: null });

      try {
        const months = await tasksApi.getMonths();
        set({ months, isLoading: false });
      } catch (error) {
        set({
          error: error.message || "Произошла ошибка при загрузке месяцев",
          isLoading: false,
        });

        // Если не удалось загрузить месяцы, используем дефолтные
        set({
          months: [
            "Выбрать месяц",
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ],
        });
      }
    },

    // Установить выбранную категорию и загрузить соответствующие задачи
    setSelectedCategory: (category) => {
      set({ selectedCategory: category });
      // get().fetchTasks();
    },

    // Установить выбранный месяц и загрузить соответствующие задачи
    setSelectedMonth: (month) => {
      set({ selectedMonth: month });
      // get().fetchTasks();
    },

    fetchTaskComments: async (taskId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await tasksApi.getComments(taskId);
        return response.data;
      } catch (error) {
        set({ error: error.message });
        return [];
      } finally {
        set({ isLoading: false });
      }
    },

    // Добавить комментарий к задаче
    addComment: async (taskId, comment) => {
      set({ isLoading: true, error: null });
      try {
        const result = await tasksApi.addComment(taskId, comment);

        // Обновляем задачу с новым комментарием
        const tasks = get().tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: result.id || Date.now(),
                    author: "Вы",
                    text: comment,
                    date: new Date().toLocaleDateString(),
                  },
                ],
              }
            : task,
        );

        // Перегруппировка задач и обновление колонок
        const groupedTasks = groupTasksByStatus(tasks);
        const columns = createColumnsFromGroupedTasks(groupedTasks);

        set({ tasks, columns, isLoading: false });
        return true;
      } catch (error) {
        set({
          error: error.message || "Произошла ошибка при добавлении комментария",
          isLoading: false,
        });
        return false;
      }
    },
  }),
  { name: "tasks-store" },
);

// Вспомогательная функция для извлечения категорий из задач
function extractCategoriesFromTasks(tasks) {
  const categoriesSet = new Set();

  tasks.forEach((task) => {
    if (task.tag && task.tag.text) {
      categoriesSet.add(task.tag.text);
    }
  });

  return Array.from(categoriesSet).map((category) => ({
    id: category,
    key: category,
    label: category,
  }));
}
