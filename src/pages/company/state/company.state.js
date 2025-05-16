import { create } from "zustand";
import { companyApi } from "../api/company.api";
import { useAuthStore } from "../../signin/state/signin.store";

export const useCompanyStore = create((set, get) => ({
  company: null,
  manager: null,
  services: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  setCompany: (newCompany) => set({ company: newCompany }),

  fetchCompanyData: async (id) => {
    if (get().isInitialized && get().company) return;

    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      set({
        company: user.company,
        manager: user.manager,
        services: user.services || [],
        isLoading: false,
        isInitialized: true,
      });
      debugger;
      return user.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Ошибка при загрузке данных компании",
        isLoading: false,
      });
      return null;
    }
  },

  // Обновление данных компании
  updateCompany: async (companyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await companyApi.updateCompany(companyData);

      set({
        company: response.data.company,
        isLoading: false,
      });

      return response.data.company;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Ошибка при обновлении данных компании",
        isLoading: false,
      });
      return null;
    }
  },

  getActiveSite: () => {
    const { company } = get();
    return company?.website || "";
  },

  reset: () => {
    set({
      company: null,
      manager: null,
      services: [],
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },
}));
