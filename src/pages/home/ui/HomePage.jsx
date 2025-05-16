import React, { useEffect } from "react";
import { Layout } from "../../../shared/ui/layout";
import { HomeMetrics } from "./HomeMetrics";
import { HomeCharts } from "./HomeCharts";
import { RequestsTable } from "../../../widgets/requests";
import { useHomeStore } from "../state/home.store";
import { useAuthStore } from "../../signin/state/signin.store";

export const HomePage = () => {
  const { metrics, charts, requests, fetchAllData, isLoading } = useHomeStore();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  useEffect(() => {
    // Загружаем данные после проверки авторизации
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  if (!isAuthenticated) {
    return null; // Или редирект на страницу входа
  }

  return (
    <Layout>
      <div className="page__title h3">Добро пожаловать в LeadBro!</div>
      <div className="home">
        {isLoading ? (
          <div className="loading">Загрузка данных...</div>
        ) : (
          <>
            {/*<HomeMetrics metrics={metrics} />*/}
            {/*<HomeCharts charts={charts} />*/}
            {/*<RequestsTable requests={requests} />*/}
          </>
        )}
      </div>
    </Layout>
  );
};
