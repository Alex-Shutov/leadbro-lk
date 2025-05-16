import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";

export const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Выберите...",
  className = "",
  disabled = false,
  wide = false,
  small = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);

  useOutsideClick(selectRef, () => setIsOpen(false));

  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    setSelectedOption(selected || null);
  }, [value, options]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={cn("select nice-select", className, {
        open: isOpen,
        disabled: disabled,
        wide: wide,
        small: small,
      })}
      onClick={handleToggle}
    >
      <span className="current">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <ul className="list">
        {options.map((option) => (
          <li
            key={option.value}
            className={cn("option", {
              selected: selectedOption?.value === option?.value,
              focus: selectedOption?.value === option?.value,
            })}
            data-value={option?.value}
            onClick={() => handleSelect(option)}
          >
            {option?.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
