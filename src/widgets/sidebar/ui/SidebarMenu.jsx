import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarDropdown } from "./SidebarDropdown";
import { useCompany } from "../../../pages/company";
import { Icon } from "../../../shared/ui/icon";
import { CardNav } from "../../header/ui/CardNav";
import {
  getActiveServiceFromStorage,
  noStatsServiceTypes,
  setActiveServiceInStorage,
  setActiveServiceTypeInStorage,
} from "../../../core/lib/utils";

const serviceIcons = {
  seo: { name: "seo", viewBox: "0 0 560 560", size: 24 },
  development: {
    name: "dev",
    viewBox: "0 0 24 24 ",
    size: 24,
    style: { color: "#857e7e" },
  },
  advertisement: {
    name: "ads",
    viewBox: "0 0 2200 2200 ",
    size: 24,
    style: { color: "#857e7e" },
  },
  context: {
    name: "context",
    viewBox: "0 0 48 48",
    size: 20,
    style: { color: "#857e7e" },
  },
  target: { name: "goal", viewBox: "0 0 24 24", size: 24 },
  support: { name: "help", viewBox: "0 0 24 24", size: 24 },
  reputation: { name: "star-stroke", viewBox: "0 0 24 24", size: 24 },
  design: { name: "design", viewBox: "0 0 24 24", size: 24 },
  leadgen: { name: "user", viewBox: "0 0 24 24", size: 24 },
  marketplace: { name: "store", viewBox: "0 0 24 24", size: 24 },
  improvements: { name: "setting", viewBox: "0 0 24 24", size: 24 },
  default: { name: "bar-chart", viewBox: "0 0 24 24", size: 24 },
};

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
        const firstServiceType = services[0].type;
        setActiveServiceInStorage(firstServiceId);
        setActiveServiceTypeInStorage(firstServiceType);
        setActiveService(firstServiceId);
      }
    }
  }, [services, isLoading]);

  // Обработчик нажатия на услугу
  const handleServiceClick = (service) => {
    setActiveServiceInStorage(service.id);
    setActiveServiceTypeInStorage(service.type);
    setActiveService(service.id);
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
        const iconConfig = serviceIcons[service.type] || serviceIcons.default;
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
              onClick={() => handleServiceClick(service)}
            />

            <Link
              className={`sidebar__item ${index === 0 ? "seo-pc" : ""} ${isActive ? "active" : ""}`}
              style={{ marginTop: index === 0 ? "25px" : "0" }}
              to={pages.length > 0 ? pages[0].to : "#"}
              onClick={() => handleServiceClick(service)}
            >
              <Icon
                className={"icon"}
                name={icon}
                viewBox={"0 0 24 24"}
                size={24}
                {...iconConfig}
              />
              <span className={"name"}>{service.name}</span>
            </Link>

            {/*{isActive && (*/}
            {/*  <CardNav*/}
            {/*    isInsideSidebar={true}*/}
            {/*    serviceType={service.type}*/}
            {/*    pages={pages}*/}
            {/*    isActive={isActive}*/}
            {/*  />*/}
            {/*)}*/}
          </React.Fragment>
        );
      })}
    </div>
  );
};
