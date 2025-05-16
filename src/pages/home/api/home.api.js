import apiClient from "../../../shared/api/client";

export const homeApi = {
  getMetrics: () => {
    return apiClient.get("/metrics");
  },

  getSearchChart: () => {
    return apiClient.get("/charts/search");
  },

  getRejectionsChart: () => {
    return apiClient.get("/charts/rejections");
  },

  getLatestRequests: () => {
    return apiClient.get("/requests/latest");
  },
};
