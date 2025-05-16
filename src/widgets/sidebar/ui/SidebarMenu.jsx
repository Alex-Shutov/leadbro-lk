import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { SidebarDropdown } from "./SidebarDropdown";
import { useCompany } from "../../../pages/company";
import { Icon } from "../../../shared/ui/icon";
import { CardNav } from "../../header/ui/CardNav";

const serviceIcons = {
  seo: "bar-chart",
  contextual: "goal",
  development: "dev",
  smm: "activity",
  default: "bar-chart",
};

// Функция для генерации путей с учетом ID услуги
const getServicePages = (serviceId) => ({
  seo: [
    { text: "Статистика", to: `/services/${serviceId}/statistics` },
    { text: "Отчеты", to: `/services/${serviceId}/reports` },
    { text: "Задачи по услуге", to: `/services/${serviceId}/tasks` },
    { text: "Документы", to: `/services/${serviceId}/documents` },
  ],
  contextual: [
    { text: "Кампании", to: `/services/${serviceId}/campaigns` },
    { text: "Аналитика", to: `/services/${serviceId}/analytics` },
    { text: "Бюджет", to: `/services/${serviceId}/budget` },
  ],
  development: [
    { text: "Проекты", to: `/services/${serviceId}/projects` },
    { text: "Задачи", to: `/services/${serviceId}/dev-tasks` },
    { text: "Тикеты", to: `/services/${serviceId}/tickets` },
  ],
  default: [{ text: "Задачи по услуге", to: `/services/${serviceId}/tasks` }],
});

export const SidebarMenu = ({ isExpanded }) => {
  const { services, isLoading } = useCompany();
  const location = useLocation();
  const { id: currentServiceId } = useParams(); // Получаем ID услуги из URL
  const [activeService, setActiveService] = useState(currentServiceId);

  // Функция для определения активной услуги
  const getActiveService = () => {
    if (!services) return null;

    // Если есть ID в URL, используем его
    if (currentServiceId) {
      return currentServiceId;
    }

    // Иначе ищем по пути
    for (const service of services) {
      const pages =
        getServicePages(service.id)[service.type] ||
        getServicePages(service.id).default;
      const isActive = pages.some((page) =>
        location.pathname.startsWith(page.to),
      );

      if (isActive) {
        return service.id;
      }
    }

    return null;
  };

  // Обновляем активную услугу при изменении пути или списка услуг
  React.useEffect(() => {
    setActiveService(getActiveService());
  }, [location.pathname, services, currentServiceId]);

  if (isLoading) {
    return <div className="sidebar__menu-loading">Загрузка...</div>;
  }

  if (!services || services.length === 0) {
    return <div className="sidebar__menu sidebar__menu--empty"></div>;
  }

  return (
    <div className="sidebar__menu">
      {services.map((service, index) => {
        const icon = serviceIcons[service.type] || serviceIcons.default;
        const pages =
          getServicePages(service.id)[service.type] ||
          getServicePages(service.id).default;
        const isActive = activeService === service.id;

        return (
          <React.Fragment key={service.id || index}>
            <SidebarDropdown
              title={service.name}
              icon={icon}
              items={pages}
              isExpanded={isExpanded}
              isMobile={true}
              isActive={isActive}
              style={{ marginTop: index === 0 ? "25px" : "0" }}
              className={`seo-mobile ${isActive ? "active" : ""}`}
            />

            <Link
              className={`sidebar__item ${index === 0 ? "seo-pc" : ""} ${isActive ? "active" : ""}`}
              style={{ marginTop: index === 0 ? "25px" : "0" }}
              to={pages[0].to}
              onClick={() => setActiveService(service.id)}
            >
              <Icon className={"icon"} name={"goal"} viewBox={"0 0 24 24"} />
              {service.name}
            </Link>

            {/* Передаем ID услуги в CardNav */}
            <CardNav
              isInsideSidebar={true}
              serviceId={service.id}
              pages={pages}
              isActive={isActive}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
