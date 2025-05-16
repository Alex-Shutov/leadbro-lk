import React from "react";
import cn from "classnames";

export const Search = ({ isActive, onToggle }) => {
  return (
    <>
      <div className="header__item header__item_search">
        <button
          className={cn("header__head header__search", { active: isActive })}
          onClick={onToggle}
        >
          <svg
            className="icon icon-search"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0492 16.2157 16.9098L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4.5C6.29086 4.5 4.5 6.29086 4.5 8.5C4.5 10.7091 6.29086 12.5 8.5 12.5C10.7091 12.5 12.5 10.7091 12.5 8.5C12.5 6.29086 10.7091 4.5 8.5 4.5Z"></path>
          </svg>
        </button>
      </div>
      <div
        className={cn("search js-search", {
          active: isActive,
          visible: isActive,
        })}
      >
        <div className="search__wrap">
          <input className="search__input" type="text" placeholder="Поиск" />
          <button className="search__close" onClick={onToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M15.5 5L5 15.5M5 5l10.5 10.5"
                stroke="#777e91"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
