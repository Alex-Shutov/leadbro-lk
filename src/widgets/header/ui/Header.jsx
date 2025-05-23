import React from "react";
import { Link, useParams } from "react-router-dom";
import { BurgerButton } from "./BurgerButton";
import { CardNav } from "./CardNav";
import { HeaderControl } from "./HeaderControl";
import { HeaderButtons } from "./HeaderButtons";
import { useTouchDevice } from "../../../core/hooks/useTouchDevice";
import { useHeaderLogic } from "../../../core/hooks/useHeaderLogic";
import { useLocation } from "react-router-dom";
import { getActiveServiceTypeFromStorage } from "../../../core/lib/utils";

export const Header = ({ isVisible, setIsVisible }) => {
  useTouchDevice();
  const { activeItem, toggleItem, headerRef } = useHeaderLogic();
  const location = useLocation();
  const serviceType = getActiveServiceTypeFromStorage();
  const isServicePage = location.pathname.startsWith("/services/");
  // const { id: serviceId } = isServicePage ? useParams() : { id: null };
  let { id: serviceId } = useParams();
  serviceId = isServicePage ? serviceId : { id: null };

  return (
    <header className="header" data-id="#header" ref={headerRef}>
      <BurgerButton onClick={() => setIsVisible(!isVisible)} />

      {/* Условный рендеринг CardNav в зависимости от страницы */}
      {/*{isServicePage ? (*/}
      {/*  <></>*/}
      {/*) : (*/}
      {/*  // <CardNav serviceId={serviceId} isServiceContext={true} />*/}
      {/*  // <CardNav />*/}
      {/*)}*/}
      <CardNav serviceType={serviceType} />
      <div className="header-mobile-logo">
        <Link className="sidebar__logo header-mobile-logo" to="/">
          <img className="some-icon" src="img/custom/logo.svg" alt="Core" />
          <img
            className="some-icon-dark"
            src="img/custom/logo-dark.svg"
            alt="Core"
          />
        </Link>
      </div>

      <HeaderControl
        notificationsActive={activeItem === "notifications"}
        toggleNotifications={(e) => toggleItem("notifications", e)}
      />

      <HeaderButtons />
    </header>
  );
};
