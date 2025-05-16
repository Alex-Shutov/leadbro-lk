// widgets/sidebar/ui/Sidebar.jsx
import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { Select } from "../../../shared/ui/select/Select";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarUser } from "./SidebarUser";
import { SidebarFooter } from "./SidebarFooter";
import { useTouchDevice } from "../../../core/hooks/useTouchDevice";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";
import { useTheme } from "../../../core/hooks/useTheme";
import { useCompany } from "../../../pages/company";
import SidebarLogos from "./SidebarLogos";
import { SidebarToggle } from "./SidebarToggle";
import { Button } from "../../../shared/ui/button";
import { Icon } from "../../../shared/ui/icon";

const footerLinks = [
  { text: "Оставить отзыв", to: "/feedback", icon: "message" },
  { text: "Вопрос / Ответ", to: "/faq", icon: "help" },
];

export const Sidebar = ({ isVisible, setIsVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { company, isLoading } = useCompany();
  const [selectedValue, setSelectedValue] = useState("");
  const sidebarRef = useRef(null);

  const theme = useTheme();
  useTouchDevice();
  useOutsideClick(sidebarRef, () => setIsVisible(false));

  // Устанавливаем значение сайта из данных компании
  useEffect(() => {
    if (company && company.website) {
      setSelectedValue(company.website);
    }
  }, [company]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    document.body.classList.toggle("no-scroll");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    // Логика переключения между сайтами компании
  };

  // Опции для селекта сайтов
  const siteOptions = company
    ? [
        { value: company.website, label: company.website },
        // Другие сайты компании
      ]
    : [{ value: "loading", label: "Загрузка..." }];

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn("sidebar", {
          visible: isVisible,
          active: isExpanded,
        })}
      >
        <Button
          variant={"off"}
          className={"sidebar__close "}
          onClick={() => setIsVisible(!isVisible)}
        >
          <Icon className={"icon icon-close"} name="close" />
        </Button>
        <SidebarLogos />

        {/*<Select*/}
        {/*  className="select"*/}
        {/*  value={selectedValue}*/}
        {/*  onChange={handleSelectChange}*/}
        {/*  options={siteOptions}*/}
        {/*  disabled={isLoading}*/}
        {/*/>*/}

        <SidebarMenu isExpanded={isExpanded} />

        <SidebarUser
          contentClassName="header__notification"
          avatarClassName="header__avatar"
          detailsClassName="header__details"
          loadingComponent={
            <div className="header__notification">
              <div className="header__details">
                <div className="header__title">Загрузка...</div>
              </div>
            </div>
          }
        />

        <SidebarFooter theme={theme} links={footerLinks} />
      </div>

      {isVisible && (
        <div className="sidebar__overlay" onClick={toggleVisibility} />
      )}
    </>
  );
};
