import apiClient, { apiClient2 } from "../../../shared/api/client";
import { onCompanyInfoMapper } from "../lib/company.mapper";

export const companyApi = {
  getCompanyInfo: (id) => {
    //Пока получаем 0 компанию, потом надо будет изменить
    return apiClient2
      .get(`/api/cabinet/company/${id}`)
      .then(onCompanyInfoMapper);
  },

  updateCompany: (companyData) => {
    return apiClient.put("/company/update", companyData);
  },

  getServices: () => {
    return apiClient.get("/company/services");
  },
};
