import React, { useState } from "react";

export const BurgerButton = ({ onClick }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setSidebarVisible(!sidebarVisible);
    onClick();
  };
  return (
    <button
      className={`header__burger ${sidebarVisible ? "active" : ""}`}
      onClick={toggleSidebar}
    />
  );
};
