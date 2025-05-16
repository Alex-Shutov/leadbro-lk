import React from "react";
import cn from "classnames";

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className,
  ...props
}) => {
  return (
    <button
      className={cn({
        button: variant === "primary",
        "button-stroke": variant === "stroke",
        "button-square-stroke": variant === "square-stroke",
        "button-small": size === "small",
        [className || ""]: Boolean(className),
      })}
      {...props}
    >
      {children}
    </button>
  );
};
