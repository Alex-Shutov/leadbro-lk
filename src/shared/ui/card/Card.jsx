import React from "react";
import cn from "classnames";

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
};
