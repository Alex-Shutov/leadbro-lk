import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";

export const PeriodSelector = ({
  period,
  onPeriodChange,
  dateRange,
  onDateRangeChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  // Parse date strings to Date objects
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split(".");
    if (parts.length !== 3) return new Date();
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  // Format Date objects to DD.MM.YYYY strings
  const formatDate = (date) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  };

  const [startDate, setStartDate] = useState(() => parseDate(dateRange.start));
  const [endDate, setEndDate] = useState(() => parseDate(dateRange.end));

  // Update dates when dateRange prop changes
  useEffect(() => {
    setStartDate(parseDate(dateRange.start));
    setEndDate(parseDate(dateRange.end));
  }, [dateRange]);

  // Handle date changes
  const handleDateChange = ([start, end]) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Apply date changes
  const applyDateChanges = () => {
    onDateRangeChange({
      start: formatDate(startDate),
      end: formatDate(endDate),
    });
    setIsCalendarOpen(false);
  };

  // Reset dates
  const resetDates = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    setStartDate(weekAgo);
    setEndDate(today);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <div className="shop__control">
      <div className="shop__nav shop__filter-mobile">
        <div
          className="calendar__head js-calendar-head"
          onClick={() => setIsCalendarOpen(true)}
        >
          <svg className="icon icon-calendar">
            <use xlinkHref="#icon-calendar"></use>
          </svg>
          <div className="calendar__details">Выбрать период</div>
        </div>
      </div>
      <div className="shop__nav shop__nav-links period-dl">
        <div className="shop-links__wrap">
          <a
            className={`shop__link ${period === "days" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPeriodChange("days");
            }}
          >
            Дни
          </a>
          <a
            className={`shop__link js-tabs-link ${period === "weeks" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPeriodChange("weeks");
            }}
          >
            Недели
          </a>
          <a
            className={`shop__link js-tabs-link ${period === "months" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPeriodChange("months");
            }}
          >
            Месяцы
          </a>
        </div>
        <div
          className={`calendar js-calendar ${isCalendarOpen ? "open" : ""}`}
          ref={calendarRef}
        >
          <div className="calendar__list">
            {/*    <div className="calendar__item calendar__item_date js-calendar-item">*/}
            {/*      <div*/}
            {/*        className="calendar__head js-calendar-head"*/}
            {/*        onClick={() => setIsCalendarOpen(!isCalendarOpen)}*/}
            {/*      >*/}
            {/*        <div className="calendar__head-wrap">*/}
            {/*          <svg className="icon icon-calendar">*/}
            {/*            <use xlinkHref="#icon-calendar"></use>*/}
            {/*          </svg>*/}
            {/*          <div className="calendar__details">*/}
            {/*            <input*/}
            {/*              className="calendar__value js-date-range"*/}
            {/*              type="text"*/}
            {/*              value={`${dateRange.start} – ${dateRange.end}`}*/}
            {/*              readOnly*/}
            {/*            />*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*      <div className="calendar__body js-calendar-body">*/}
            {/*        <div className="calendar__container js-date-container">*/}
            {/*          <DatePicker*/}
            {/*            selected={startDate}*/}
            {/*            onChange={handleDateChange}*/}
            {/*            startDate={startDate}*/}
            {/*            endDate={endDate}*/}
            {/*            selectsRange*/}
            {/*            inline*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*        <div className="calendar__foot">*/}
            {/*          <button*/}
            {/*            className="button-stroke button-small calendar__button js-date-clear"*/}
            {/*            onClick={resetDates}*/}
            {/*          >*/}
            {/*            Сбросить*/}
            {/*          </button>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <a*/}
            {/*      className="button-stroke users__button confirm-period-btn"*/}
            {/*      href="#"*/}
            {/*      onClick={(e) => {*/}
            {/*        e.preventDefault();*/}
            {/*        applyDateChanges();*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      Применить*/}
            {/*    </a>*/}
            {/*    <button*/}
            {/*      className="button-stroke users__button close-period-btn"*/}
            {/*      onClick={() => setIsCalendarOpen(false)}*/}
            {/*    >*/}
            {/*      Закрыть*/}
            {/*    </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
