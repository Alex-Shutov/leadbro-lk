// shared/ui/toggle/Toggle.jsx
import React from "react";
import cn from "classnames";
import { Icon } from "../icon";

export const Toggle = ({
  isOn,
  onChange,
  options = [],
  className = "",
  inputClassName = "",
  innerClassName = "",
  boxClassName = "",
  disabled = false,
  iconSize = 16, // Добавляем параметр для размера иконки
}) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const offOption = options.find((opt) => !opt.value) || options[0];
  const onOption = options.find((opt) => opt.value) || options[1];

  const renderIcon = (option) => {
    if (!option.icon) return null;

    if (typeof option.icon === "string") {
      // Используем компонент Icon для строковых иконок
      return <Icon className={"icon"} name={option.icon} size={iconSize} />;
    }

    // Если icon уже является React-элементом (например, SVG), просто возвращаем его
    return option.icon;
  };

  return (
    <label className={cn(className, { disabled })}>
      <input
        className={cn(inputClassName)}
        type="checkbox"
        checked={isOn}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={cn(innerClassName)}>
        <span className={cn(boxClassName, { active: !isOn })}>
          {renderIcon(offOption)}
          {offOption.label}
        </span>

        <span className={cn(boxClassName, { active: isOn })}>
          {renderIcon(onOption)}
          {onOption.label}
        </span>
      </span>
    </label>
  );
};
