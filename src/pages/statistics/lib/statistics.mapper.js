// pages/statistics/lib/mappers.js

// const getPeriodLabel = (period) => {
//   switch (period) {
//     case "days":
//       return "Визиты";
//     case "weeks":
//       return "Визиты";
//     case "months":
//       return "Визиты";
//     default:
//       return "Данные";
//   }
// };

export const mapVisitsData = (apiData, dateRange, period) => {
  // Check if we have valid data

  if (!apiData || !apiData.data || apiData.data.length === 0) {
    return {
      value: 0,
      change: 0,
      comparedTo: dateRange.start,
      series: [{ name: "Визиты", data: [] }],
      categories: [],
    };
  }

  // Extract the visit counts
  const visitCounts = apiData.data.map((item) =>
    item.metrics ? item.metrics[0] : 0,
  );

  // Get dates from dimensions
  const categories = apiData.data
    .map((item) => {
      if (item.dimensions && item.dimensions[0] && item.dimensions[0].name) {
        // Convert YYYY-MM-DD to DD.MM
        const dateParts = item.dimensions[0].name.split("-");
        if (dateParts.length === 3) {
          return `${dateParts[2]}.${dateParts[1]}`;
        }
      }
      return "";
    })
    .filter((date) => date !== "");

  // Calculate total and change
  const latestValue = visitCounts[visitCounts.length - 1] || 0;
  const previousValue =
    visitCounts.length > 1 ? visitCounts[visitCounts.length - 2] : 0;
  const change =
    previousValue !== 0
      ? ((latestValue - previousValue) / previousValue) * 100
      : 0;

  return {
    value: apiData?.totals?.[0] ?? "-",
    change: parseFloat(change.toFixed(1)),
    comparedTo: dateRange.start,
    series: [
      {
        name: "Визиты",
        data: visitCounts,
      },
    ],
    categories: categories,
  };
};

export const mapRejectionsData = (apiData, dateRange) => {
  if (!apiData || !apiData.data || apiData.data.length === 0) {
    return {
      value: 0,
      change: 0,
      comparedTo: dateRange.start,
      series: [{ name: "% отказов", data: [] }],
      categories: [],
    };
  }

  // Извлечь проценты отказов
  const bounceRates = apiData.data.map((item) =>
    item.metrics ? parseFloat(item.metrics[0].toFixed(2)) : 0,
  );

  const categories = apiData.data
    .map((item) => {
      if (item.dimensions && item.dimensions[0] && item.dimensions[0].name) {
        // Преобразование YYYY-MM-DD в DD.MM
        const dateParts = item.dimensions[0].name.split("-");
        if (dateParts.length === 3) {
          return `${dateParts[2]}.${dateParts[1]}`;
        }
      }
      return "";
    })
    .filter((date) => date !== "");

  // Рассчитать последнее значение и изменение
  const latestValue = bounceRates[bounceRates.length - 1] || 0;
  const previousValue =
    bounceRates.length > 1 ? bounceRates[bounceRates.length - 2] : 0;
  const change =
    previousValue !== 0
      ? ((latestValue - previousValue) / previousValue) * 100
      : 0;

  return {
    value: parseFloat(apiData?.totals?.[0].toFixed(2)),
    change: parseFloat(change.toFixed(1)),
    comparedTo: dateRange.start,
    series: [
      {
        name: "% отказов",
        data: bounceRates,
      },
    ],
    categories: categories,
  };
};
export const mapPositionsData = (apiData) => {
  const positionsData = apiData.result || {};

  // Map series data for different position ranges
  const top3Data = [];
  const top10Data = [];
  const top30Data = [];

  const dates = Object.keys(positionsData).sort();

  // Process data for each date
  dates.forEach((date) => {
    const dateData = positionsData[date];
    top3Data.push(dateData.top_3 || 0);
    top10Data.push(dateData.top_10 || 0);
    top30Data.push(dateData.top_30 || 0);
  });

  // Format categories (dates)
  const categories = dates.map((date) => {
    const parts = date.split("-");
    return `${parts[2]}.${parts[1]}`;
  });

  // Get stats for position ranges
  const stats = [
    {
      title: "Топ 1-3",
      count: positionsData[dates[dates.length - 1]]?.top_3 || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.top_3_percent || 0) * 10,
        ) / 10,
      color: "gray",
    },
    {
      title: "Топ 1-10",
      count: positionsData[dates[dates.length - 1]]?.top_10 || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.top_10_percent || 0) * 10,
        ) / 10,
      color: "orange",
    },
    {
      title: "Топ 1-30",
      count: positionsData[dates[dates.length - 1]]?.top_30 || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.top_30_percent || 0) * 10,
        ) / 10,
      color: "purple",
    },
    {
      title: "Топ 1-50",
      count: positionsData[dates[dates.length - 1]]?.top_50 || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.top_50_percent || 0) * 10,
        ) / 10,
      color: "green",
    },
    {
      title: "Все запросы",
      count: positionsData[dates[dates.length - 1]]?.total || 0,
      percentage: 100,
      color: "default",
    },
    {
      title: "WS10",
      count: positionsData[dates[dates.length - 1]]?.ws10 || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.ws10_percent || 0) * 10,
        ) / 10,
      color: "yellow",
    },
    {
      title: "PTraf",
      count: positionsData[dates[dates.length - 1]]?.ptraf || 0,
      percentage:
        Math.round(
          (positionsData[dates[dates.length - 1]]?.ptraf_percent || 0) * 10,
        ) / 10,
      color: "blue",
    },
  ];

  return {
    series: [
      {
        name: "Daily",
        data: top3Data,
      },
      {
        name: "Weekly",
        data: top10Data,
      },
      {
        name: "Monthly",
        data: top30Data,
      },
    ],
    categories,
    stats,
  };
};

export const mapTopVisorPositionsData = (
  chartData,
  summaryData,
  keywordsData,
  params,
) => {
  // If no data is available, return empty structure
  if (!chartData || !summaryData || !keywordsData) {
    return {
      series: [],
      categories: [],
      stats: [
        { title: "Топ 1-3", count: 0, percentage: 0, color: "gray" },
        { title: "Топ 1-10", count: 0, percentage: 0, color: "orange" },
        { title: "Топ 1-30", count: 0, percentage: 0, color: "purple" },
        { title: "Топ 1-50", count: 0, percentage: 0, color: "green" },
        { title: "Все запросы", count: 0, percentage: 0, color: "default" },
        { title: "WS10", count: 0, percentage: 0, color: "yellow" },
        { title: "PTraf", count: 0, percentage: 0, color: "blue" },
      ],
    };
  }

  try {
    // 1. Process chart data
    const chartResult = chartData.result || {};
    const chartItems = chartResult.items || [];
    const chartDates = [];
    const chartValues = {
      top3: [],
      top10: [],
      top30: [],
      top50: [],
      top100: [],
    };

    // Format dates and extract position data by date
    chartItems.forEach((item) => {
      const dateStr = item.date;

      // Reformat date from YYYY-MM-DD to DD.MM
      const dateParts = dateStr.split("-");
      const formattedDate = `${dateParts[2]}.${dateParts[1]}`;

      if (!chartDates.includes(formattedDate)) {
        chartDates.push(formattedDate);
      }

      // Extract position counts from the data
      // TopVisor API returns data in the format: { top_3: 5, top_10: 15, ... }
      chartValues.top3.push(item.top_3 || 0);
      chartValues.top10.push(item.top_10 || 0);
      chartValues.top30.push(item.top_30 || 0);
      chartValues.top50.push(item.top_50 || 0);
      chartValues.top100.push(item.top_100 || 0);
    });

    // 2. Process summary data
    const summaryResult = summaryData.result || {};
    const positionSummary = summaryResult.tops || {};

    // 3. Process keywords data to get total count and additional metrics
    const keywords = keywordsData.result?.keywords || [];
    const totalKeywords = keywords.length;

    // Process WS10 and PTraf data from keywords
    let ws10Count = 0;
    let ptrafCount = 0;
    keywords.forEach((keyword) => {
      // Assuming these fields exist in the API response - adjust as needed
      if (keyword.wordstat && parseInt(keyword.wordstat, 10) >= 10) {
        ws10Count++;
      }

      // Check if keyword has potential traffic (you might need to adjust this based on actual API response)
      if (
        keyword.potential_traffic &&
        parseInt(keyword.potential_traffic, 10) > 0
      ) {
        ptrafCount++;
      }
    });

    // Get position counts from summary data
    const top3Count = positionSummary.top_3 || 0;
    const top10Count = positionSummary.top_10 || 0;
    const top30Count = positionSummary.top_30 || 0;
    const top50Count = positionSummary.top_50 || 0;

    // Prepare chart series data
    const series = [
      {
        name: "Топ 1-3",
        data: chartValues.top3,
      },
      {
        name: "Топ 1-10",
        data: chartValues.top10,
      },
      {
        name: "Топ 1-30",
        data: chartValues.top30,
      },
      {
        name: "Топ 1-50",
        data: chartValues.top50,
      },
    ];

    // Prepare stats data
    const stats = [
      {
        title: "Топ 1-3",
        count: top3Count,
        percentage:
          totalKeywords > 0 ? Math.round((top3Count / totalKeywords) * 100) : 0,
        color: "gray",
      },
      {
        title: "Топ 1-10",
        count: top10Count,
        percentage:
          totalKeywords > 0
            ? Math.round((top10Count / totalKeywords) * 100)
            : 0,
        color: "orange",
      },
      {
        title: "Топ 1-30",
        count: top30Count,
        percentage:
          totalKeywords > 0
            ? Math.round((top30Count / totalKeywords) * 100)
            : 0,
        color: "purple",
      },
      {
        title: "Топ 1-50",
        count: top50Count,
        percentage:
          totalKeywords > 0
            ? Math.round((top50Count / totalKeywords) * 100)
            : 0,
        color: "green",
      },
      {
        title: "Все запросы",
        count: totalKeywords,
        percentage: 100,
        color: "default",
      },
      {
        title: "WS10",
        count: ws10Count,
        percentage:
          totalKeywords > 0 ? Math.round((ws10Count / totalKeywords) * 100) : 0,
        color: "yellow",
      },
      {
        title: "PTraf",
        count: ptrafCount,
        percentage:
          totalKeywords > 0
            ? Math.round((ptrafCount / totalKeywords) * 100)
            : 0,
        color: "blue",
      },
    ];

    return {
      series,
      categories: chartDates,
      stats,
    };
  } catch (error) {
    console.error("Error mapping TopVisor data:", error);
    return {
      series: [],
      categories: [],
      stats: [
        { title: "Топ 1-3", count: 0, percentage: 0, color: "gray" },
        { title: "Топ 1-10", count: 0, percentage: 0, color: "orange" },
        { title: "Топ 1-30", count: 0, percentage: 0, color: "purple" },
        { title: "Топ 1-50", count: 0, percentage: 0, color: "green" },
        { title: "Все запросы", count: 0, percentage: 0, color: "default" },
        { title: "WS10", count: 0, percentage: 0, color: "yellow" },
        { title: "PTraf", count: 0, percentage: 0, color: "blue" },
      ],
    };
  }
};

export const mapKeywordsData = (apiData, regionsData, groupsData) => {
  const keywords = apiData.result?.keywords || [];
  const regions = regionsData.result?.regions || [];
  const groups = groupsData.result?.groups || [];

  // Map regions/cities
  const cities = regions.map((region) => region.name);

  // Map keyword groups
  const keywordGroups = groups.map((group) => group.name);

  // Map keywords data
  const mappedKeywords = keywords.map((keyword) => {
    const positions = keyword.history || [];
    const lastPosition = keyword.position || 0;
    const previousPosition = positions.length > 0 ? positions[0].position : 0;

    // Calculate position change
    const positionChange = previousPosition - lastPosition;
    const isPositive = positionChange > 0;

    return {
      id: keyword.id,
      keyword: keyword.name,
      city: keyword.region_name,
      searchEngine: keyword.searcher === "yandex" ? "Y" : "G",
      change: {
        value: Math.abs(positionChange),
        positive: isPositive,
      },
      positions: positions.map((pos) => {
        // Determine highlight based on position
        let highlight = null;
        if (pos.position <= 3) highlight = "green";
        else if (pos.position <= 10) highlight = "yellow";

        return {
          date: pos.date.split("-").slice(1).reverse().join("."),
          value: pos.position,
          highlight,
        };
      }),
    };
  });

  return {
    keywords: mappedKeywords,
    cities,
    groups: keywordGroups,
  };
};
export const mapYandexMetrikaData = (apiData, seriesName, dateRange) => {
  if (!apiData || !apiData.data || apiData.data.length === 0) {
    return {
      value: 0,
      change: 0,
      comparedTo: dateRange?.start,
      series: [{ name: seriesName || "Данные", data: [] }],
      categories: [],
    };
  }

  // Извлекаем значения метрик
  const values = apiData.data.map((item) =>
    item.metrics && item.metrics.length > 0
      ? parseFloat(item.metrics[0].toFixed(2))
      : 0,
  );

  // Форматируем категории (даты) для оси X
  const categories = apiData.data
    .map((item) => {
      if (item.dimensions && item.dimensions[0] && item.dimensions[0].name) {
        // Преобразование YYYY-MM-DD в DD.MM
        const dateParts = item.dimensions[0].name.split("-");
        if (dateParts.length === 3) {
          return `${dateParts[2]}.${dateParts[1]}`;
        }
      }
      return "";
    })
    .filter((date) => date !== "");

  // Рассчитываем изменение метрики
  const latestValue = values.length > 0 ? values[values.length - 1] : 0;
  const previousValue = values.length > 1 ? values[values.length - 2] : 0;
  const change =
    previousValue !== 0
      ? ((latestValue - previousValue) / previousValue) * 100
      : 0;

  // Общее значение из API (среднее или последнее значение)
  const totalValue =
    apiData.totals && apiData.totals.length > 0
      ? parseFloat(apiData.totals[0].toFixed(2))
      : 0;

  return {
    value: totalValue,
    change: parseFloat(change.toFixed(1)),
    comparedTo: dateRange?.start,
    series: [
      {
        name: seriesName || "Данные",
        data: values,
      },
    ],
    categories: categories,
  };
};

/**
 * Маппер для данных о целях из Яндекс.Метрики
 *
 * @param {Object} apiData - Сырые данные из API Яндекс.Метрики
 * @param {Object} goalsData - Данные о целях
 * @param {Object} dateRange - Диапазон дат
 * @param {string} selectedConversion - Выбранная конверсия
 * @returns {Object} - Данные в формате для UI
 */
export const mapGoalsData = (
  apiData,
  goalsData,
  dateRange,
  selectedConversion,
) => {
  // Базовая обработка данных
  const data = mapYandexMetrikaData(
    apiData,
    selectedConversion === "Показать все конверсии"
      ? "Конверсии"
      : selectedConversion,
    dateRange,
  );

  // Добавляем список доступных конверсий
  const conversions = [
    "Показать все конверсии",
    ...(goalsData?.goals?.map((goal) => goal.name) || []),
  ];

  return {
    ...data,
    conversions,
  };
};
