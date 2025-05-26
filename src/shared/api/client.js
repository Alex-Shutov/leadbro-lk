import axios from "axios";
import { handleError } from "../../core/lib/snackbar";

const API_URL = process.env.REACT_APP_API_URL;
const API_URL_2 = process.env.REACT_APP_API_URL_2;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient2 = axios.create({
  baseURL: API_URL_2,
  headers: {
    "Content-Type": "application/json",
  },
});

export const topvisorClient = axios.create({
  baseURL: process.env.REACT_APP_TOPVISOR_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `bearer ${process.env.REACT_APP_TOPVISOR_API_KEY}`,
  },
});

export const yandexMetricaClient = axios.create({
  baseURL: process.env.REACT_APP_YANDEX_METRICA_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${process.env.REACT_APP_YANDEX_METRICA_TOKEN}`,
  },
});

const setupBaseInterceptors = (client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log the error or handle it appropriately
      console.error("API request failed:", error);
      return Promise.reject(error);
    },
  );
  return client;
};

const setupAuthInterceptors = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Редирект на страницу входа при неавторизованном доступе
        localStorage.removeItem("authToken");
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    },
  );
};

setupAuthInterceptors(apiClient);
setupAuthInterceptors(apiClient2);

setupBaseInterceptors(topvisorClient);
setupBaseInterceptors(yandexMetricaClient);

const handleSuccessResponse = (response) => {
  debugger;
  return { status: "success", data: response.data };
};

// Обработка ошибок
const handleErrorResponse = (error) => {
  debugger;
  const errorResponse = {
    status: "error",
    message: error.message,
    code: error.code,
    response: {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    },
    request: {
      url: error.config?.url,
      method: error.config?.method,
    },
  };

  // Обработка и показ ошибок пользователю
  const showErrorsToUser = () => {
    const errors = error.response?.data?.errors;
    const message = error.response?.data?.message;

    let errorMessages = [];

    if (errors) {
      // Преобразуем объект ошибок в массив сообщений
      errorMessages = Object.entries(errors).flatMap(([field, messages]) => {
        return Array.isArray(messages)
          ? messages.map((msg) => `${field}: ${msg}`)
          : [`${field}: ${messages}`];
      });
    } else if (message) {
      errorMessages = [message];
    } else {
      errorMessages = [error.message || "Произошла ошибка"];
    }

    // Здесь можно добавить логику отображения ошибок (например, через toast)
    errorMessages.forEach((msg) => {
      console.error("Error:", msg); // Замените на ваш механизм показа ошибок
      handleError(msg);
    });
  };

  showErrorsToUser();

  return Promise.reject(errorResponse);
};
apiClient.interceptors.response.use(handleSuccessResponse, handleErrorResponse);
apiClient2.interceptors.response.use(
  handleSuccessResponse,
  handleErrorResponse,
);

export default apiClient;
