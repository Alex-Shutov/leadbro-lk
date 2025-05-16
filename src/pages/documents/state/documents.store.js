import { docTypes, docTypesRu } from "../lib/constants";
import { create } from "zustand";
import {
  colorTaskCategories,
  taskCategories,
  taskCategoriesRu,
} from "../../tasks/lib/constants";
import { documentsApi } from "../api/documents.api";

export const useDocumentsStore = create((set, get) => ({
  docTypes: [],
  documents: [],
  selectedDocType: null,

  isLoading: false,
  error: null,

  setSelectedDocType: (type) => {
    set({ selectedDocType: type });
  },
  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await documentsApi.getDocuments();
      set({ documents, isLoading: false });
    } catch (error) {
      set({
        error: error.message || "Произошла ошибка при загрузке документов",
        isLoading: false,
        documents: [],
      });
    }
  },
  getDocTypes: () => {
    // set({ isLoading: true, error: null });
    try {
      // Преобразуем наши константы в массив категорий
      const categories = Object.keys(docTypes).map((key) => ({
        id: key,
        key,
        label: docTypesRu[key],
      }));

      set({ docTypes: categories, isLoading: false });
    } catch (error) {
      set({
        error:
          error.message || "Произошла ошибка при загрузке типов документов",
        isLoading: false,
        docTypes: [], // или можно оставить дефолтные категории
      });
    }
  },
}));
