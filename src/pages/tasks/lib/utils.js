import { format, isThisYear, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function formatDate(inputDate) {
  try {
    const date = parseISO(inputDate);
    if (isNaN(date.getTime())) return "Некорректная дата";

    const dateFormat = isThisYear(date) ? "EEE, d MMMM" : "EEE, d MMMM yyyy";
    return format(date, dateFormat, { locale: ru });
  } catch {
    return "Некорректная дата";
  }
}
