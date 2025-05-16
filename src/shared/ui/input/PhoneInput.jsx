import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "jquery-mask-plugin";

export const PhoneInput = ({
  value,
  onChange,
  className,
  placeholder = "+7 999-999-99-99",
  id = "phone-input",
  ...props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      $(inputRef.current).mask("+7 999-999-99-99", {
        completed: function () {
          if (onChange) {
            onChange({
              target: {
                value: this.val(),
              },
            });
          }
        },
      });
    }
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="tel"
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      {...props}
    />
  );
};
