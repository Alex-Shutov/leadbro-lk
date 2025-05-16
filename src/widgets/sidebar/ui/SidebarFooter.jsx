// SidebarFooter.js
import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { Toggle } from "../../../shared/ui/toggle/Toggle";
import { SidebarToggle } from "./SidebarToggle";
import { Icon } from "../../../shared/ui/icon";

export const SidebarFooter = ({
  theme = {},
  links = [],
  className = "",
  border = false,
}) => {
  const { isDark, toggleTheme } = theme;

  return (
    <div
      className={cn("sidebar__foot", className, {
        "sidebar__foot--border": border,
      })}
    >
      {links.map((link, index) => (
        <Link key={index} to={link.to} className="sidebar__help">
          <Icon className={"icon"} name={link.icon} />
          {link.text}
        </Link>
      ))}

      <SidebarToggle />
    </div>
  );
};
