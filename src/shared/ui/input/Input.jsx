import React from "react";
import cn from "classnames";

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className={cn("form__field", className)}>
      {label && <div className="form__label">{label}</div>}
      <div className="form__wrap">
        <input className="form__input" {...props} />
        {error && <div className="form__error">{error}</div>}
      </div>
    </div>
  );
};
