// src/pages/tasks/lib/mappers.js

// Мапперы для категорий
import { loadAvatar } from "../../../core/lib/mapper.utils";
import { formatDate } from "./utils";

export const categoryMapping = {
  frontend: "Фронтенд",
  backend: "Бэкенд",
  seo: "SEO",
  design: "Дизайн",
  internal: "Внутренние задачи",
  analytics: "Аналитика",
  brief: "Бриф",
  calculation: "Расчеты",
  target: "Таргетированная реклама",
  context: "Контекстная реклама",
  copywriting: "Копирайтинг",
};

// Мапперы для статусов
export const statusMapping = {
  created: "Создана",
  in_work: "В работе",
  review: "На проверке",
  finished: "Завершено",
  paused: "Отложено",
};

// Маппинг статусов к порядку колонок
export const statusOrder = [
  "created",
  "in_work",
  "review",
  "finished",
  "paused",
];

// Маппинг категорий к цветам тэгов
export const categoryColorMapping = {
  frontend: "blue", // Синий
  backend: "blue", // Синий
  seo: "green", // Зеленый
  design: "purple", // Фиолетовый
  internal: "yellow", // Желтый
  analytics: "orange", // Оранжевый
  brief: "red", // Красный
  calculation: "gray", // Серый
  target: "green", // Зеленый
  context: "green", // Зеленый
  copywriting: "blue", // Синий
};

/**
 * Маппер для преобразования задачи из API в формат для фронтенда
 * @param {Object} apiTask - Задача из API
 * @returns {Object} - Задача в формате для фронтенда
 */
export const mapTaskFromApi = (apiTask) => {
  return {
    id: apiTask.id,
    title: apiTask.name || "Без названия",
    description: apiTask.description || "",
    deadline: formatDate(apiTask.deadline) || "",
    tag: {
      text: categoryMapping[apiTask.type] || apiTask.type || "Задача",
      type: categoryColorMapping[apiTask.type] || "green",
    },
    status: apiTask.status || "created",
    users: apiTask.responsible
      ? [
          {
            id: apiTask.responsible.id,
            name: apiTask.responsible.name,
            image:
              loadAvatar(apiTask.responsible.avatar) ||
              "img/custom/customer-1.png",
          },
        ]
      : [],
    // createdAt: apiTask.deadline || new Date().toLocaleDateString(),
    tasks: apiTask.description
      ? apiTask.description.split("\n").filter((line) => line.trim())
      : [],
    additionalInfo: "",
    team: apiTask.responsible
      ? [
          {
            id: apiTask.responsible.id,
            name: apiTask.responsible.name,
            position: apiTask.responsible.position?.name || "Специалист",
            image:
              loadAvatar(apiTask.responsible.avatar) ||
              "img/custom/customer-1.png",
          },
        ]
      : [],
    comments: [],
  };
};

/**
 * Группирует задачи по статусам
 * @param {Array} tasks - Массив задач
 * @returns {Object} - Объект с задачами, сгруппированными по статусам
 */
export const groupTasksByStatus = (tasks) => {
  const groupedTasks = {};

  // Инициализация пустых массивов для всех статусов
  statusOrder.forEach((status) => {
    groupedTasks[status] = [];
  });

  // Распределение задач по статусам
  tasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    } else {
      // Если встретился неизвестный статус, добавляем его в "created"
      groupedTasks.created.push({ ...task, status: "created" });
    }
  });

  return groupedTasks;
};

/**
 * Преобразует сгруппированные задачи в массив колонок для компонента TasksBoard
 * @param {Object} groupedTasks - Задачи, сгруппированные по статусам
 * @returns {Array} - Массив колонок
 */
export const createColumnsFromGroupedTasks = (groupedTasks) => {
  return statusOrder.map((status, index) => ({
    id: index + 1,
    title: statusMapping[status],
    count: groupedTasks[status]?.length || 0,
    tasks: groupedTasks[status] || [],
  }));
};

export const mapComments = (commentsData) => {
  return commentsData.map((comment) => ({
    id: comment.id,
    author:
      `${comment.commentator.name} ${comment.commentator.middle_name || ""}`.trim(),
    text: comment.text,
    date: new Date(comment.created_at).toLocaleDateString(),
    // Можно добавить другие поля если нужно
  }));
};
