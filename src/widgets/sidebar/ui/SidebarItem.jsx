import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

export const SidebarItem = ({ to, icon, text, isActive, children }) => {
  return (
    <div className={cn("sidebar__item", { active: isActive })}>
      <Link className="sidebar__head" to={to}>
        <div className="sidebar__icon">{icon}</div>
        <div className="sidebar__text">{text}</div>
      </Link>
      {children && <div className="sidebar__body">{children}</div>}
    </div>
  );
};
