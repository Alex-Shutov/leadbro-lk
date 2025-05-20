import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "../../../shared/ui/icon";

const noStatsServiceTypes = ["development", "improvements", "marketplace"];

export const CardNav = ({
  isInsideSidebar = false,
  serviceType = null,
  pages = null,
  isActive = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Формируем набор страниц в зависимости от типа услуги
  const navPages =
    pages ||
    (() => {
      const servicePages = [
        { text: "Задачи", to: "/tasks" },
        { text: "Документы", to: "/documents" },
      ];

      if (!noStatsServiceTypes.includes(serviceType)) {
        servicePages.unshift({ text: "Статистика", to: "/statistics" });
      }

      return servicePages;
    })();

  // Массив путей, где нужно показывать кнопку "Назад"
  const specialPaths = ["tasks", "reports"]; // Можно добавлять другие

  // Проверяем, находимся ли мы на специальной странице
  const shouldShowBackButton =
    !isInsideSidebar &&
    specialPaths.some((path) => location.pathname.includes(path));

  // Обработчик для кнопки "Назад"
  const handleGoBack = () => {
    navigate(-1);
  };

  // Если компонент внутри сайдбара и не активен, не отображаем его
  if (isInsideSidebar && !isActive) {
    return null;
  }

  return (
    <div className="card__nav">
      {navPages.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={`card__link ${
            location.pathname === link.to ||
            (link.to !== "/" && location.pathname.startsWith(link.to))
              ? "active"
              : ""
          }`}
        >
          {link.text}
        </Link>
      ))}
    </div>
  );
};
