import { format, subDays, subWeeks, subMonths } from "date-fns";

export const formatDateForYandex = (dateStr) => {
  // Assuming dateStr is in DD.MM.YYYY format
  if (!dateStr) return "";
  const parts = dateStr.split(".");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
