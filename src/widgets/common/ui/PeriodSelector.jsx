import React, { useState, useRef, useEffect } from "react";
import { CustomDatePicker } from "./CustomDatePicker";
import "./PeriodSelector.css";
import { Icon } from "../../../shared/ui/icon";

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

  // Format Date objects to display format
  const formatDisplayDate = (date) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const [startDate, setStartDate] = useState(() => parseDate(dateRange.start));
  const [endDate, setEndDate] = useState(() => parseDate(dateRange.end));

  // Update dates when dateRange prop changes
  useEffect(() => {
    setStartDate(parseDate(dateRange.start));
    setEndDate(parseDate(dateRange.end));
  }, [dateRange]);

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
                className={`shop__link js-tabs-link ${
                    period === "weeks" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPeriodChange("weeks");
                }}
            >
              Недели
            </a>
            <a
                className={`shop__link js-tabs-link ${
                    period === "months" ? "active" : ""
                }`}
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
              className={`calendar__head js-calendar-head ${
                  isCalendarOpen ? "active" : ""
              }`}
              onClick={() => setIsCalendarOpen(true)}
          >
            <Icon name={"calendar"} size={24} />
            <span className="calendar__details">
            {formatDisplayDate(startDate)} - {formatDisplayDate(endDate || startDate)}
          </span>
          </div>

          {isCalendarOpen && (
              <div ref={calendarRef}>
                <CustomDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={(dates) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    onApply={(dates) => {
                      onDateRangeChange({
                        start: dates.start,
                        end: dates.end,
                      });
                      setIsCalendarOpen(false);
                    }}
                    onReset={resetDates}
                />
              </div>
          )}
        </div>
      </div>
  );
};