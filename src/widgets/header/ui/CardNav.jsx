import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "../../../shared/ui/icon";
import { noStatsServiceTypes } from "../../../core/lib/utils";

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

  // Если компонент внутри сайдбара и не активен, не отображаем его
  if (isInsideSidebar && !isActive) {
    return null;
  }
  console.log(navPages, "navPages", serviceType);
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
