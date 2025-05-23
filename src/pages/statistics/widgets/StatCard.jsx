import React from "react";

export const StatCard = ({
  title,
  value,
  change,
  comparedTo,
  children,
  onInfoClick,
}) => {
  const isPositive = change > 0;
  //TODO Замена svg на Icon
  return (
    <div className="total card info-modal-wrap">
      <div className="card__head">
        <div className="title-blue card__title" style={{ padding: 0 }}>
          {title}
        </div>
        {onInfoClick && (
          <button
            className="button-square-stroke button-small filters__head info-modal-btn"
            onClick={onInfoClick}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 13.3335C10.9454 13.3335 13.3333 10.9457 13.3333 8.00016C13.3333 5.05464 10.9454 2.66683 7.99992 2.66683C5.0544 2.66683 2.66659 5.05464 2.66659 8.00016C2.66659 10.9457 5.0544 13.3335 7.99992 13.3335ZM7.99992 14.6668C11.6818 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6818 1.3335 7.99992 1.3335C4.31802 1.3335 1.33325 4.31826 1.33325 8.00016C1.33325 11.6821 4.31802 14.6668 7.99992 14.6668Z"
                fill="#6F767E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99992 6.6665C8.36811 6.6665 8.66659 6.96498 8.66659 7.33317V10.6671C8.66659 11.0353 8.36811 11.3338 7.99992 11.3338C7.63173 11.3338 7.33325 11.0353 7.33325 10.6671V7.33317C7.33325 6.96498 7.63173 6.6665 7.99992 6.6665Z"
                fill="#6F767E"
              />
              <circle cx="7.99992" cy="5.33317" r="0.666667" fill="#6F767E" />
            </svg>
          </button>
        )}
      </div>
      {value && (
        <div className="total__details info-modal-block">
          <div className="h4 total__title">{value ?? "--"}</div>
          {change !== undefined && change !== null && (
            <div className="total__line">
              <div
                className={`balance background ${isPositive ? "positive" : "negative"}`}
              >
                <svg
                  className={`icon icon-arrow-${isPositive ? "top" : "bottom"}`}
                >
                  <use
                    xlinkHref={`#icon-arrow-${isPositive ? "top" : "bottom"}`}
                  ></use>
                </svg>
                {Math.abs(change)}%
              </div>
              по сравнению с {comparedTo}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
