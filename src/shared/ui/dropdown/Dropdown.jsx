import React, { useState, useRef } from "react";
import cn from "classnames";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";

export const Dropdown = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  className = "",
  contentClassName = "",
  closeOnSelect = true,
  initialOpen = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const dropdownRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = (e) => {
    e?.stopPropagation();

    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  useOutsideClick(dropdownRef, () => {
    if (isControlled) {
      onToggle?.(false);
    } else {
      setInternalIsOpen(false);
    }
  });

  const handleItemClick = () => {
    if (closeOnSelect) {
      if (isControlled) {
        onToggle?.(false);
      } else {
        setInternalIsOpen(false);
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(className, {
        active: isOpen,
      })}
    >
      <div onClick={handleToggle}>
        {typeof trigger === "function" ? trigger({ isOpen }) : trigger}
      </div>

      {isOpen && (
        <div className={cn(contentClassName)} onClick={handleItemClick}>
          {typeof children === "function"
            ? children({
                close: () =>
                  isControlled ? onToggle?.(false) : setInternalIsOpen(false),
              })
            : children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  className = "",
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    e?.stopPropagation();
    onClick?.(e);
  };

  return (
    <div className={cn(className)} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};
