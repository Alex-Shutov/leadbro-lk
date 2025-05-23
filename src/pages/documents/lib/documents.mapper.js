export const mapDocumentsFromApi = (apiDocs) => {
  return apiDocs.map((doc, index) => {
    // Определяем тип документа на основе номера или других полей
    // В вашем примере нет явного поля для типа, поэтому можно использовать номер или другие признаки
    let type = "Документ";
    if (doc.data.number && doc.data.number.includes("-")) {
      type = "Акт";
    } else if (
      doc.data.payment_reason &&
      doc.data.payment_reason.includes("отчет")
    ) {
      type = "Отчет";
    }

    // Форматируем дату из "2025-05-27" в "27.05.2025"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    };

    // Определяем класс в зависимости от статуса
    let className = "";
    if (doc.data.status === "canceled") {
      className = "_red";
    } else {
      className = "_green";
    }

    // Форматируем сумму (в исходных данных суммы нет, поэтому ставим заглушку)
    // Если сумма есть в данных, нужно заменить на реальное значение
    const sum = "44 000, 00 ₽";

    return {
      id: doc.data.id || index,
      type: type,
      date: formatDate(doc.data.creation_date || doc.data.payment_date),
      number: doc.data.number || "без номера",
      sum: sum,
      status: doc.data.status === "canceled" ? "Не оплачено" : "Оплачено",
      className: className,
    };
  });
};
