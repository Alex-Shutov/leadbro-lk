import React, {useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import './CustomDatePicker.css'
import {Icon} from "../../../shared/ui/icon";
registerLocale("ru", ru);

export const CustomDatePicker = ({
                                     startDate,
                                     endDate,
                                     onDateChange,
                                     onApply,
                                     onReset,
                                    onClose
                                 }) => {
    console.log(startDate, endDate, 'endDate');
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [hoverDate, setHoverDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(startDate || new Date());
    const calendarRef = useRef(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = (date) => {
        if (!date) return;

        if (!localStartDate || (localStartDate && localEndDate)) {
            setLocalStartDate(date);
            setLocalEndDate(null);
        } else {
            if (date < localStartDate) {
                setLocalEndDate(localStartDate);
                setLocalStartDate(date);
            } else {
                setLocalEndDate(date);
            }
        }
    };

    const handleMouseEnter = (date) => {
        setHoverDate(date);
    };

    const handleMouseLeave = () => {
        setHoverDate(null);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return `${String(date.getDate()).padStart(2, "0")}.${String(
            date.getMonth() + 1
        ).padStart(2, "0")}.${date.getFullYear()}`;
    };

    const handleApply = () => {
        onApply({
            start: formatDate(localStartDate),
            end: formatDate(localEndDate || localStartDate),
        });
        setIsCalendarOpen(false);
    };

    // Функция для точного сравнения дат
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    // Полностью кастомный рендеринг дня
    const renderDayContents = (day, date) => {
        if (!date) return day;

        let className = "day-content";

        // Проверка для выбранных дат
        if (localStartDate && localEndDate) {
            if (isSameDay(date, localStartDate) && isSameDay(date, localEndDate)) {
                className += " selected-day single-day";
            } else if (isSameDay(date, localStartDate)) {
                className += " selected-day start-day";
            } else if (isSameDay(date, localEndDate)) {
                className += " selected-day end-day";
            } else if (date > localStartDate && date < localEndDate) {
                className += " in-range-day";
            }
        } else if (localStartDate && !localEndDate && hoverDate) {
            // Предпросмотр при наведении
            const hoverStart = hoverDate < localStartDate ? hoverDate : localStartDate;
            const hoverEnd = hoverDate > localStartDate ? hoverDate : localStartDate;

            if (isSameDay(date, hoverStart) && isSameDay(date, hoverEnd)) {
                className += " hover-selected-day hover-single-day";
            } else if (isSameDay(date, hoverStart)) {
                className += " hover-selected-day hover-start-day";
            } else if (isSameDay(date, hoverEnd)) {
                className += " hover-selected-day hover-end-day";
            } else if (date > hoverStart && date < hoverEnd) {
                className += " hover-in-range-day";
            }
        } else if (localStartDate && isSameDay(date, localStartDate)) {
            className += " selected-day";
        }

        return (
            <div
                className={className}
                onMouseEnter={() => handleMouseEnter(date)}
            >
                {day}
            </div>
        );
    };

    // Обработка изменения месяца
    const handleMonthChange = (date) => {
        setCurrentMonth(date);
    };

    const getDayClassName = (date) => {
        if (!date) return "";

        const time = date.getTime();
        const startTime = localStartDate?.getTime();
        const endTime = localEndDate?.getTime();
        const hoverTime = hoverDate?.getTime();

        let classes = [];

        // Обработка реального выбора
        if (startTime && endTime) {
            if (time === startTime && time === endTime) {
                classes.push("selected-day", "single-day");
            } else if (time === startTime) {
                classes.push("selected-day", "start-day");
            } else if (time === endTime) {
                classes.push("selected-day", "end-day");
            } else if (time > startTime && time < endTime) {
                classes.push("in-range-day");
            }
        } else if (startTime && !endTime && hoverTime) {
            // Обработка предпросмотра при наведении
            const hoverStart = Math.min(startTime, hoverTime);
            const hoverEnd = Math.max(startTime, hoverTime);

            if (time === hoverStart && time === hoverEnd) {
                classes.push("hover-selected-day", "hover-single-day");
            } else if (time === hoverStart) {
                classes.push("hover-selected-day", "hover-start-day");
            } else if (time === hoverEnd) {
                classes.push("hover-selected-day", "hover-end-day");
            } else if (time > hoverStart && time < hoverEnd) {
                classes.push("hover-in-range-day");
            }
        } else if (startTime && time === startTime) {
            classes.push("selected-day");
        }

        return classes.join(" ");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen((prev)=>!prev)
               onClose && onClose()
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarRef]);

    const formatDisplayDate = (date) => {
        if (!date) return "";
        return `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${date.getFullYear()}`;
    };

    return (
        <>
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
            { isCalendarOpen && <div ref={calendarRef}>
        <div className="calendar-popup">
            <div className="calendar-header">
                <button
                    className="prev-month"
                    onClick={() => {
                        const newDate = new Date(currentMonth);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setCurrentMonth(newDate);
                    }}
                >
                    &lt;
                </button>
                <div className="current-month">
                    {new Intl.DateTimeFormat("ru-RU", {
                        month: "long",
                        year: "numeric",
                    }).format(currentMonth)}
                </div>
                <button
                    className="next-month"
                    onClick={() => {
                        const newDate = new Date(currentMonth);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setCurrentMonth(newDate);
                    }}
                >
                    &gt;
                </button>
            </div>

            <div onMouseLeave={handleMouseLeave} className="datepicker-wrapper">
                <DatePicker
                    selected={localStartDate}
                    onChange={handleDateChange}
                    onMonthChange={handleMonthChange}
                    inline
                    locale="ru"
                    showMonthDropdown={false}
                    showYearDropdown={false}
                    monthsShown={1}
                    fixedHeight
                    disabledKeyboardNavigation
                    openToDate={currentMonth}
                    renderCustomHeader={() => <div style={{ display: "none" }} />}
                    renderDayContents={renderDayContents}
                    // Отключаем встроенную логику выделения дат
                    highlightDates={[]}
                    startDate={null}
                    endDate={null}
                    dayClassName={getDayClassName}
                />
            </div>

            <div className="calendar-footer">

                <button className="apply-button" onClick={handleApply}>
                    Применить
                </button>
            </div>
        </div>
        </div>}
        </>
    );
};