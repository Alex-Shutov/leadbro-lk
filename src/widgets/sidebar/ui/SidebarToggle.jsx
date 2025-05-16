import React from "react";
import { Toggle } from "../../../shared/ui/toggle/Toggle";
import { useTheme } from "../../../core/hooks/useTheme";

export const SidebarToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Toggle
      isOn={isDark}
      onChange={toggleTheme}
      className="theme js-theme"
      inputClassName="theme__input"
      innerClassName="theme__inner"
      boxClassName="theme__box"
      iconSize={24}
      options={[
        {
          value: false,
          label: "Светлая",
          icon: "sun",
        },
        {
          value: true,
          label: "Темная",
          icon: "moon",
        },
      ]}
    />
  );
};
