import apiClient from "../../../shared/api/client";

export const documentsApi = {
  getDocuments: async () => {
    try {
      const response = await apiClient.get("/docs");
      return response.data;
    } catch (error) {
      console.error("Error fetching months:", error);
      throw error;
    }
  },
};
