import apiClient, { apiClient2 } from "../../../shared/api/client";
import { onMeMapper } from "../lib/signin.mapper";

export const signinApi = {
  login: (phone) => {
    return apiClient.post("/auth/login", { phone });
  },

  verify: (code) => {
    return apiClient.post("/auth/verify", { code });
  },

  me: () => {
    return apiClient2.get("/api/cabinet/company/info").then(onMeMapper);
  },
  loginByEmail: (email, password) => {
    return apiClient2.post("/api/auth", { email: email, password: password });
  },
};
