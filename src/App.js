import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomePage } from "./pages/home";
import { SigninPage, SignInPage2 } from "./pages/signin";
import { useAuthStore } from "./pages/signin/state/signin.store";

import "./shared/api/mockAdapter";

import "./core/styles/global.css";
import { useEffectOnce } from "./core/hooks/useEffectOnce";
import { TasksPage } from "./pages/tasks/ui/TasksPage";
import { StatisticsPage } from "./pages/statistics";
import { DocumentsPage } from "./pages/documents";
import { FaqPage } from "./pages/faq";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" />;
  // }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffectOnce(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/*<Route*/}
        {/*  path="/"*/}
        {/*  element={*/}
        {/*    <ProtectedRoute>*/}
        {/*      <HomePage />*/}
        {/*    </ProtectedRoute>*/}
        {/*  }*/}
        {/*/>*/}
        <Route
          path="/services/:id/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FaqPage />
            </ProtectedRoute>
          }
        />
        {/*<Route path="/signin" element={<SigninPage />} />*/}
        <Route path="/signin" element={<SignInPage2 />} />
        {/*<Route path="/signin-sms" element={<SigninPage smsVerification />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
