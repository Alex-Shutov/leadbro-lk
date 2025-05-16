import React, { useState } from "react";

export const CheckboxSelect = ({
  title = "0 группы запросов",
  options = [],
  selected = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`checkbox__select ${isOpen ? "_active" : ""}`}>
      <div
        className="checkbox__select-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#6F767E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="checkbox__select-body">
        {options.map((option, index) => (
          <div className="checkbox__select-item" key={index}>
            <label className="checkbox">
              <input
                className="checkbox__input"
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <span className="checkbox__inner">
                <span className="checkbox__tick"></span>
              </span>
              <p>{option}</p>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
