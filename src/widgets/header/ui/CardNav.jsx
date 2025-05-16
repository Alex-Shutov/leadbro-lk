import React from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Icon } from "../../../shared/ui/icon";

export const CardNav = ({
  isInsideSidebar = false,
  serviceId = null,
  isServiceContext = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Если serviceId не передан, пробуем получить из URL
  const currentServiceId = serviceId || params.id;

  // Общие ссылки (когда не в контексте услуги)
  const generalLinks = [
    { text: "Статистика", to: "/" },
    { text: "Документы", to: "/documents" },
  ];

  // Ссылки для страницы услуги
  const serviceLinks = [
    // { text: "Обзор", to: `/services/${currentServiceId}` },
    // { text: "Статистика", to: `/services/${currentServiceId}/statistics` },
    { text: "Задачи", to: `/services/${currentServiceId}/tasks` },
    // { text: "Документы", to: `/services/${currentServiceId}/documents` },
  ];

  // Определяем, какие ссылки показывать
  const linksToShow = isServiceContext ? serviceLinks : generalLinks;

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

  // if (isInsideSidebar) {
  //   return null;
  // }

  return (
    <div className="card__nav">
      {shouldShowBackButton && (
        <button onClick={handleGoBack} className="card__link card__link--back">
          <Icon name="arrow-left" size={16} />
          Назад
        </button>
      )}

      {linksToShow.map((link, index) => (
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
