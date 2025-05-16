import React from "react";
import { RequestsRow } from "./RequestsRow";

export const RequestsTable = ({
  requests = [],
  dates = ["25.01", "26.01", "27.01"],
}) => {
  return (
    <div className="requests">
      <div className="requests__titles">
        <h2>Последние запросы</h2>
        <button className="requests__titles-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9.75V13.5L10 14.75"
              stroke="#1A1D1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.88787 19C4.87639 17.4976 4.26163 15.7288 4.15596 13.8917C4.0503 12.0547 4.45653 10.2249 5.32153 8.63733C6.18654 7.04978 7.4719 5.77324 9.03473 4.95086C10.5976 4.12848 12.3584 3.79614 14.1059 4.00146C15.8534 4.20677 17.5018 4.93837 18.8236 6.10065C20.1454 7.26293 21.0792 8.79991 21.5017 10.4949C21.9242 12.1899 21.8146 13.9685 21.1847 15.593C20.5549 17.2176 19.437 18.6161 18 19.6"
              stroke="#1A1D1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C11.4477 20 11 19.5523 11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20Z"
              fill="#1A1D1F"
            />
          </svg>
          История запросов
        </button>
      </div>
      <div className="requests__table">
        <div className="requests__table-title">
          <div className="requests__table-title-item">Запрос</div>
          <div className="requests__table-title-item">Город</div>
          <div className="requests__table-title-item">Поисковик</div>
          <div className="requests__table-title-item">
            <div>Поз</div>
            {dates.map((date, index) => (
              <div key={index}>{date}</div>
            ))}
          </div>
        </div>
        <div className="requests__table-body">
          {requests.map((request) => (
            <RequestsRow key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};
