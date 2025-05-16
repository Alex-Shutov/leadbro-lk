import { useAuthStore } from "../../pages/signin/state/signin.store";
import { useMemo } from "react";

export const useUser = () => {
  // Получаем все состояние сразу
  const state = useAuthStore();

  // Мемоизируем возвращаемый объект
  return useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login: state.login,
      verifyCode: state.verifyCode,
      logout: state.logout,
      checkAuth: state.checkAuth,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.isLoading,
      state.error,
      state.login,
      state.verifyCode,
      state.logout,
      state.checkAuth,
    ],
  );
};
