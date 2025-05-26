import apiClient, { apiClient2 } from "../../../shared/api/client";

export const tasksApi = {
  /**
   * Получить все задачи по категории и месяцу
   * @param {string} category - Категория задач (например, "SEO", "Дизайн")
   * @param {string} month - Месяц для фильтрации (необязательный параметр)
   * @returns {Promise<Array>} Массив задач
   */

  getTasks: async (category, month = null) => {
    try {
      let url = `/tasks?category=${category}`;

      if (month && month !== "Выбрать месяц") {
        url += `&month=${month}`;
      }

      const response = await apiClient2.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getComments: async (taskId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/tasks/${taskId}/comments`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  /**
   * Получить детали задачи по ID
   * @param {number} taskId - ID задачи
   * @returns {Promise<Object>} Объект с данными задачи
   */
  getTaskById: async (taskId) => {
    try {
      const response = await apiClient2.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task details:", error);
      throw error;
    }
  },

  /**
   * Добавить комментарий к задаче
   * @param {number} taskId - ID задачи
   * @param {string} comment - Текст комментария
   * @returns {Promise<Object>} Объект с данными добавленного комментария
   */
  addComment: async (taskId, comment) => {
    try {
      const response = await apiClient2.post(
        `/api/cabinet/tasks/${taskId}/comments`,
        {
          text: comment,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  /**
   * Получить все категории задач
   * @returns {Promise<Array>} Массив категорий
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get("/task-categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching task categories:", error);
      throw error;
    }
  },

  getTasksByService: async (serviceId) => {
    try {
      const response = await apiClient2.get(
        `/api/cabinet/service/${serviceId}/tasks`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tasks by service:", error);
      throw error;
    }
  },

  /**
   * Получить список месяцев для фильтрации
   * @returns {Promise<Array>} Массив месяцев
   */
  getMonths: async () => {
    try {
      const response = await apiClient.get("/task-months");
      return response.data;
    } catch (error) {
      console.error("Error fetching months:", error);
      throw error;
    }
  },
};
