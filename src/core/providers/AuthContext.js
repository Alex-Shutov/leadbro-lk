import React, { createContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../pages/signin/state/signin.store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    verifyCode,
    logout,
    checkAuth,
  } = useAuthStore();

  // Проверяем аутентификацию при монтировании
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Редирект при изменении статуса аутентификации
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    verifyCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
