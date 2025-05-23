import apiClient, { apiClient2 } from "../../../shared/api/client";
import { mapDocumentsFromApi } from "../lib/documents.mapper";

export const documentsApi = {
  getDocuments: async () => {
    try {
      const response = await apiClient2.get("/api/cabinet/company/documents");
      return mapDocumentsFromApi(response.data.data);
    } catch (error) {
      console.error("Error fetching months:", error);
      throw error;
    }
  },
};
