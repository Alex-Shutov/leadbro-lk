import { format, subDays, subWeeks, subMonths } from "date-fns";

export const formatDateForYandex = (dateStr) => {
  // Assuming dateStr is in DD.MM.YYYY format
  if (!dateStr) return "";
  const parts = dateStr.split(".");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export const parseDateFromYandex = (dateString) => {
  if (!dateString) return new Date();

  const parts = dateString.split('.');
  if (parts.length !== 3) return new Date();

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

export const getCurrentDateFormatted = () => {
  return format(new Date(), "dd.MM.yyyy");
};

export const getDayAgoFormatted = () => {
  return format(subDays(new Date(), 1), "dd.MM.yyyy");
};

export const getWeekAgoFormatted = () => {
  return format(subWeeks(new Date(), 1), "dd.MM.yyyy");
};

export const getMonthAgoFormatted = () => {
  return format(subMonths(new Date(), 1), "dd.MM.yyyy");
};
