import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarDropdown } from "./SidebarDropdown";
import { useCompany } from "../../../pages/company";
import { Icon } from "../../../shared/ui/icon";
import { CardNav } from "../../header/ui/CardNav";

const serviceIcons = {
  seo: "goal",
  contextual: "goal",
  development: "dev",
  smm: "activity",
  advertisement: "promotion",
  context: "target",
  target: "target",
  support: "message",
  reputation: "star-stroke",
  design: "image",
  leadgen: "user",
  marketplace: "store",
  improvements: "setting",
  default: "bar-chart",
};

// Типы услуг, для которых не показываем "Статистика"
const noStatsServiceTypes = ["development", "improvements", "marketplace"];

// Функция для генерации страниц в зависимости от типа услуги
const getServicePages = (serviceType) => {
  // Базовые страницы для всех услуг
  const pages = [
    { text: "Задачи", to: `/tasks` },
    { text: "Документы", to: `/documents` },
  ];

  // Добавляем "Статистика" если это не тип из noStatsServiceTypes
  if (!noStatsServiceTypes.includes(serviceType)) {
    pages.unshift({ text: "Статистика", to: `/statistics` });
  }

  return pages;
};

// Функция для установки активной услуги в sessionStorage
const setActiveServiceInStorage = (serviceId) => {
  if (serviceId) {
    sessionStorage.setItem("serviceId", serviceId);
  }
};

// Функция для получения активной услуги из sessionStorage
const getActiveServiceFromStorage = () => {
  return sessionStorage.getItem("serviceId");
};

export const SidebarMenu = ({ isExpanded }) => {
  const { services, isLoading } = useCompany();
  const location = useLocation();
  const [activeService, setActiveService] = useState(
    getActiveServiceFromStorage(),
  );

  // Инициализация активной услуги при первой загрузке
  useEffect(() => {
    if (!isLoading && services && services.length > 0) {
      // Если нет активной услуги в sessionStorage, устанавливаем первую
      const storedServiceId = getActiveServiceFromStorage();
      if (!storedServiceId) {
        const firstServiceId = services[0].id;
        setActiveServiceInStorage(firstServiceId);
        setActiveService(firstServiceId);
      }
    }
  }, [services, isLoading]);

  // Обработчик нажатия на услугу
  const handleServiceClick = (serviceId) => {
    setActiveServiceInStorage(serviceId);
    setActiveService(serviceId);
  };

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
        const pages = getServicePages(service.type);
        const isActive = Number(activeService) === Number(service.id);

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
              onClick={() => handleServiceClick(service.id)}
            />

            <Link
              className={`sidebar__item ${index === 0 ? "seo-pc" : ""} ${isActive ? "active" : ""}`}
              style={{ marginTop: index === 0 ? "25px" : "0" }}
              to={pages.length > 0 ? pages[0].to : "#"}
              onClick={() => handleServiceClick(service.id)}
            >
              <Icon className={"icon"} name={icon} viewBox={"0 0 24 24"} />
              <span className={"name"}>{service.name}</span>
            </Link>

            {isActive && (
              <CardNav
                isInsideSidebar={true}
                serviceType={service.type}
                pages={pages}
                isActive={isActive}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
