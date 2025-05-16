import React from "react";
import cn from "classnames";

export const RequestsRow = ({ request }) => {
  return (
    <div className="requests__table-body-row">
      <div className="requests__table-body-item">
        <div>{request.query}</div>
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
      <div className="requests__table-body-item">{request.city}</div>
      <div className="requests__table-body-item">{request.searchEngine}</div>
      <div className="requests__table-body-item">
        <div className="requests__table-positions">
          {request.positions.map((position, index) => (
            <div
              key={index}
              className={cn({
                green: position.trend === "up" && position.status === "good",
                red: position.trend === "down" || position.status === "bad",
                "position-green": position.status === "good",
                "position-yellow": position.status === "average",
              })}
            >
              {position.value}
              {position.trend !== "neutral" && (
                <svg
                  width="9"
                  height="12"
                  viewBox="0 0 9 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 0L8.39711 6.75H0.602886L4.5 0Z"
                    fill={position.trend === "up" ? "#26842A" : "#FF6A55"}
                    style={{
                      transform:
                        position.trend === "down" ? "rotate(180deg)" : "none",
                    }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
