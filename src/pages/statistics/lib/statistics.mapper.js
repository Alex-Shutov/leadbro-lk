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
export const mapPositionsData = (positionsData) => {
  if (!positionsData || !positionsData.result) {
    return {
      series: [],
      categories: [],
      stats: [],
      topDynamics: {},
    };
  }

  const data = positionsData.result;

  // Получаем массив дат из API
  const dates = data.dates || [];

  // Форматируем даты для отображения в формате DD.MM.YYYY
  const formattedDates = dates.map((date) => {
    const parts = date.split("-");
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return date;
  });

  // Получаем данные топов
  const tops = data.tops || [{}, {}];

  // Получаем динамику топов
  const topsDynamics = data.tops_dynamics || {};

  // Корректное маппинг данных для каждого диапазона топов
  const mappedTopData = mapTopRanges(tops);

  // Преобразуем данные для графика
  const series = [
    {
      name: "Топ 1-3",
      data: mappedTopData.top1_3,
    },
    {
      name: "Топ 1-10",
      data: mappedTopData.top1_10,
    },
    {
      name: "Топ 11-30",
      data: mappedTopData.top11_30,
    },
    {
      name: "Топ 31-50",
      data: mappedTopData.top31_50,
    },
    {
      name: "Топ 51-100",
      data: mappedTopData.top51_100,
    },
    {
      name: "Топ 101+",
      data: mappedTopData.top101_plus,
    },
  ];

  // Получаем последние данные для статистики
  const latestTops = tops[tops.length - 1] || {};

  // Считаем общее количество ключевых слов
  const totalKeywords = Object.values(latestTops).reduce(
    (sum, val) => sum + (val || 0),
    0,
  );

  // Форматируем данные для статистики
  const stats = [
    {
      title: "Топ 1-3",
      count: latestTops["1_3"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["1_3"] || 0) / totalKeywords) * 100)
          : 0,
      color: "gray",
    },
    {
      title: "Топ 1-10",
      count: latestTops["1_10"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["1_10"] || 0) / totalKeywords) * 100)
          : 0,
      color: "orange",
    },
    {
      title: "Топ 11-30",
      count: latestTops["11_30"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["11_30"] || 0) / totalKeywords) * 100)
          : 0,
      color: "purple",
    },
    {
      title: "Топ 31-50",
      count: latestTops["31_50"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["31_50"] || 0) / totalKeywords) * 100)
          : 0,
      color: "green",
    },
    {
      title: "Топ 51-100",
      count: latestTops["51_100"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["51_100"] || 0) / totalKeywords) * 100)
          : 0,
      color: "blue",
    },
    {
      title: "Топ 101+",
      count: latestTops["101_10000"] || 0,
      percentage:
        totalKeywords > 0
          ? Math.round(((latestTops["101_10000"] || 0) / totalKeywords) * 100)
          : 0,
      color: "yellow",
    },
    // {
    //   title: "Все запросы",
    //   count: totalKeywords,
    //   percentage: 100,
    //   color: "default"
    // }
  ];

  return {
    series,
    categories: formattedDates,
    stats,
    topDynamics: topsDynamics,
  };
};

// Вспомогательная функция для корректного маппинга данных топов
const mapTopRanges = (tops) => {
  // Проверяем наличие данных
  if (!tops || tops.length === 0) {
    return {
      top1_3: [],
      top1_10: [],
      top11_30: [],
      top31_50: [],
      top51_100: [],
      top101_plus: [],
    };
  }

  // Инициализируем массивы для каждого диапазона топов
  const top1_3 = [];
  const top1_10 = [];
  const top11_30 = [];
  const top31_50 = [];
  const top51_100 = [];
  const top101_plus = [];

  // Обрабатываем каждый набор данных топов
  tops.forEach((top) => {
    // Для Топ 1-3 берем значение "1_3" или вычисляем из "1_10", если "1_3" не указан
    top1_3.push(
      top["1_3"] !== undefined ? top["1_3"] : Math.round(top["1_10"] / 3),
    );

    // Для остальных топов берем соответствующие значения
    top1_10.push(top["1_10"] || 0);
    top11_30.push(top["11_30"] || 0);
    top31_50.push(top["31_50"] || 0);
    top51_100.push(top["51_100"] || 0);
    top101_plus.push(top["101_10000"] || 0);
  });

  return {
    top1_3,
    top1_10,
    top11_30,
    top31_50,
    top51_100,
    top101_plus,
  };
};

// Add this to src/pages/statistics/lib/statistics.mapper.js

export const mapSummaryChartData = (apiData, projectId) => {
  // Check if we have valid data
  if (
    !apiData ||
    !apiData.result ||
    !apiData.result.seriesByProjectsId ||
    !apiData.result.seriesByProjectsId[projectId]
  ) {
    return {
      series: [],
      categories: [],
      stats: [],
      topDynamics: {},
    };
  }

  const projectData = apiData.result.seriesByProjectsId[projectId];
  const dates = apiData.result.dates || [];

  // Format dates (convert from YYYY-MM-DD to DD.MM)
  const formattedDates = dates.map((date) => {
    const parts = date.split("-");
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}`;
    }
    return date;
  });

  // Create series data from tops
  const tops = projectData.tops || {};

  // Create series data for each top category
  const series = [
    {
      name: "Топ 1-3",
      data: tops["1_3"] || [],
    },
    {
      name: "Топ 1-10",
      data: tops["1_10"] || [],
    },
    {
      name: "Топ 11-30",
      data: tops["11_30"] || [],
    },
    {
      name: "Топ 31-50",
      data: tops["31_50"] || [],
    },
    {
      name: "Топ 51-100",
      data: tops["51_100"] || [],
    },
    {
      name: "Топ 101+",
      data: tops["101_10000"] || [],
    },
  ];

  // Get the most recent values for stats
  const latestIndex =
    tops["all"] && tops["all"].length > 0 ? tops["all"].length - 1 : 0;
  const totalKeywords = tops["all"] ? tops["all"][latestIndex] || 0 : 0;

  // Prepare stats for the UI
  const stats = [
    {
      title: "Топ 1-3",
      count: tops["1_3"] ? tops["1_3"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["1_3"] ? tops["1_3"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "gray",
    },
    {
      title: "Топ 1-10",
      count: tops["1_10"] ? tops["1_10"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["1_10"] ? tops["1_10"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "orange",
    },
    {
      title: "Топ 11-30",
      count: tops["11_30"] ? tops["11_30"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["11_30"] ? tops["11_30"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "purple",
    },
    {
      title: "Топ 31-50",
      count: tops["31_50"] ? tops["31_50"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["31_50"] ? tops["31_50"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "green",
    },
    {
      title: "Топ 51-100",
      count: tops["51_100"] ? tops["51_100"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["51_100"] ? tops["51_100"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "blue",
    },
    {
      title: "Топ 101+",
      count: tops["101_10000"] ? tops["101_10000"][latestIndex] || 0 : 0,
      percentage: totalKeywords
        ? Math.round(
            ((tops["101_10000"] ? tops["101_10000"][latestIndex] || 0 : 0) /
              totalKeywords) *
              100,
          )
        : 0,
      color: "yellow",
    },
  ];

  // Calculate top dynamics (percentage change from first to last date)
  const topDynamics = {};
  if (tops) {
    Object.keys(tops).forEach((topKey) => {
      if (topKey !== "all" && tops[topKey] && tops[topKey].length >= 2) {
        const firstValue = tops[topKey][0] || 0;
        const lastValue = tops[topKey][tops[topKey].length - 1] || 0;

        if (firstValue > 0) {
          topDynamics[topKey] = Math.round(
            ((lastValue - firstValue) / firstValue) * 100,
          );
        } else {
          topDynamics[topKey] = lastValue > 0 ? 100 : 0;
        }
      }
    });
  }

  return {
    series,
    categories: formattedDates,
    stats,
    topDynamics,
    visibility: projectData.visibility || [],
  };
};

// Add this helper function if it doesn't exist
export const parseDateFromYandex = (dateStr) => {
  if (!dateStr) return new Date();

  // If it's in DD.MM.YYYY format, convert to YYYY-MM-DD first
  if (dateStr.includes(".")) {
    const parts = dateStr.split(".");
    if (parts.length === 3) {
      dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  // Parse from YYYY-MM-DD format
  return new Date(dateStr);
};

export const mapTopVisorProjectData = (projectData) => {
  if (!projectData || !projectData.searchers) {
    return {
      id: null,
      searchers: [],
      regions: [],
    };
  }

  // Extract the project ID
  const projectId = projectData.id;

  // Map searchers
  const searchers = projectData.searchers.map((searcher) => ({
    id: searcher.id,
    key: searcher.key,
    name: searcher.name,
    enabled: searcher.enabled === 1,
  }));

  // Get regions from the first searcher (if available)
  const regions =
    searchers.length > 0 && projectData.searchers[0].regions
      ? projectData.searchers[0].regions.map((region) => ({
          id: region.id,
          key: region.key,
          name: region.name,
          type: region.type,
          countryCode: region.countryCode,
        }))
      : [];

  return {
    id: projectId,
    searchers,
    regions,
  };
};

export const mapTopVisorPositionsData = (
  chartData,
  summaryData,
  keywordsData,
  params,
  selectedSearcher,
  selectedRegion,
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
    // Find the specific searcher and region in the data if provided
    let searcherData = null;
    let regionData = null;

    if (summaryData && summaryData.searchers && selectedSearcher) {
      searcherData = summaryData.searchers.find(
        (s) => s.key === selectedSearcher.key || s.id === selectedSearcher.id,
      );

      if (searcherData && searcherData.regions && selectedRegion) {
        regionData = searcherData.regions.find(
          (r) => r.key === selectedRegion.key || r.id === selectedRegion.id,
        );
      }
    }

    // If we couldn't find specific data, use the overall data
    const positionData =
      regionData?.positions_summary ||
      searcherData?.positions_summary ||
      summaryData.positions_summary ||
      {};

    // Extract dates for the chart
    const chartDates = positionData.dates || [];

    // Format dates from YYYY-MM-DD to DD.MM
    const formattedDates = chartDates.map((date) => {
      const parts = date.split("-");
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}`;
      }
      return date;
    });

    // Create series data from tops
    const tops = positionData.tops || [{}, {}];

    // We need to transform the data format from the API to what our chart expects
    const series = [
      {
        name: "Топ 1-3",
        data: tops.map((top) => top["1_10"] || 0),
      },
      {
        name: "Топ 1-10",
        data: tops.map((top) => top["11_30"] || 0),
      },
      {
        name: "Топ 1-30",
        data: tops.map((top) => top["31_50"] || 0),
      },
    ];

    // Prepare stats for the UI
    const allKeywords =
      (positionData.tops &&
        positionData.tops[0] &&
        Object.values(positionData.tops[0]).reduce(
          (sum, val) => sum + val,
          0,
        )) ||
      0;

    const latestTops = tops[tops.length - 1] || {};

    const stats = [
      {
        title: "Топ 1-3",
        count: latestTops["1_10"] || 0,
        percentage: allKeywords
          ? Math.round(((latestTops["1_10"] || 0) / allKeywords) * 100)
          : 0,
        color: "gray",
      },
      {
        title: "Топ 1-10",
        count: latestTops["11_30"] || 0,
        percentage: allKeywords
          ? Math.round(((latestTops["11_30"] || 0) / allKeywords) * 100)
          : 0,
        color: "orange",
      },
      {
        title: "Топ 1-30",
        count: latestTops["31_50"] || 0,
        percentage: allKeywords
          ? Math.round(((latestTops["31_50"] || 0) / allKeywords) * 100)
          : 0,
        color: "purple",
      },
      {
        title: "Топ 1-50",
        count: latestTops["51_100"] || 0,
        percentage: allKeywords
          ? Math.round(((latestTops["51_100"] || 0) / allKeywords) * 100)
          : 0,
        color: "green",
      },
      {
        title: "Все запросы",
        count: allKeywords,
        percentage: 100,
        color: "default",
      },
    ];

    // Add WS10 and PTraf stats if available
    if (keywordsData && keywordsData.keywords) {
      const ws10Count = keywordsData.keywords.filter(
        (kw) => kw.wordstat && parseInt(kw.wordstat) >= 10,
      ).length;
      const ptrafCount = keywordsData.keywords.filter(
        (kw) => kw.potential_traffic && parseInt(kw.potential_traffic) > 0,
      ).length;

      stats.push(
        {
          title: "WS10",
          count: ws10Count,
          percentage: allKeywords
            ? Math.round((ws10Count / allKeywords) * 100)
            : 0,
          color: "yellow",
        },
        {
          title: "PTraf",
          count: ptrafCount,
          percentage: allKeywords
            ? Math.round((ptrafCount / allKeywords) * 100)
            : 0,
          color: "blue",
        },
      );
    }

    return {
      series,
      categories: formattedDates,
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
    selectedConversion || "Конверсии",
    dateRange,
  );

  // Добавляем список доступных конверсий
  const conversions = [...(goalsData?.goals?.map((goal) => goal.name) || [])];

  return {
    ...data,
    conversions,
  };
};

// src/pages/statistics/lib/keywords.mapper.js

/**
 * Maps TopVisor API keyword position data to the format needed by the UI
 * @param {Object} apiData - The raw API response from TopVisor
 * @returns {Object} - Formatted keywords data for UI
 */
export const mapKeywordsData = (apiData) => {
  // Check if valid data exists
  if (!apiData || !apiData.result || !apiData.result.keywords) {
    return {
      keywords: [],
    };
  }

  const { keywords, headers } = apiData.result;

  // Extract all dates from the API data and sort them (newest first for display)
  const dates = [...(headers.dates || [])].sort(
    (a, b) => new Date(b) - new Date(a),
  );

  // Extract region information for city names
  let defaultCity = "Екатеринбург";
  let defaultSearchEngine = "Y";

  // Try to extract city and search engine from project data if available
  if (headers.projects && headers.projects.length > 0) {
    const project = headers.projects[0];

    // Extract regions from searchers
    if (project.searchers && project.searchers.length > 0) {
      const searcher = project.searchers[0];
      defaultSearchEngine =
        searcher.name === "Yandex"
          ? "Y"
          : searcher.name === "Google"
            ? "G"
            : searcher.name;

      if (searcher.regions && searcher.regions.length > 0) {
        defaultCity = searcher.regions[0].name;
      }
    }
  }

  // Map keywords data
  const mappedKeywords = keywords.map((keyword, keywordIndex) => {
    // Get position data
    const positionsData = keyword.positionsData || {};
    const positions = [];

    // Map each date to a position entry (in order newest to oldest for display)
    dates.forEach((date, dateIndex) => {
      // Find the position key for this date
      const positionKeys = Object.keys(positionsData);
      const positionKey = positionKeys.find((key) => key.startsWith(date));
      const positionData = positionKey ? positionsData[positionKey] : null;

      // Get position value, handle "--" as null
      const positionStr =
        positionData && positionData.position !== "--"
          ? positionData.position
          : "--";

      const value = positionStr !== "--" ? parseInt(positionStr, 10) : "--";

      // Determine position highlight based on TopVisor color scheme
      let highlight = null;
      let positionClass = "";

      if (value !== "--") {
        if (value >= 1 && value <= 3) {
          highlight = "top-1-3";
          positionClass = "position-top-1-3";
        } else if (value >= 4 && value <= 10) {
          highlight = "top-4-10";
          positionClass = "position-top-4-10";
        } else if (value >= 11 && value <= 30) {
          highlight = "top-11-30";
          positionClass = "position-top-11-30";
        } else if (value >= 31 && value <= 50) {
          highlight = "top-31-50";
          positionClass = "position-top-31-50";
        } else if (value >= 51 && value <= 100) {
          highlight = "top-51-100";
          positionClass = "position-top-51-100";
        }
      }

      // Calculate position difference with next date (chronologically)
      let diff = null;
      if (dateIndex < dates.length - 1) {
        const nextDate = dates[dateIndex + 1]; // Next date chronologically (older)
        const nextDateKey = Object.keys(positionsData).find((key) =>
          key.startsWith(nextDate),
        );
        const nextPositionData = nextDateKey
          ? positionsData[nextDateKey]
          : null;
        const nextPositionStr =
          nextPositionData && nextPositionData.position !== "--"
            ? nextPositionData.position
            : "--";

        const nextValue =
          nextPositionStr !== "--" ? parseInt(nextPositionStr, 10) : null;

        // Calculate diff: current position compared to previous (older) position
        if (value !== "--" && nextValue !== null) {
          const diffValue = nextValue - value; // If current is better (lower), diffValue will be positive
          if (diffValue !== 0) {
            diff = {
              upper: diffValue > 0, // Position improved if current value is lower than previous
              value: Math.abs(diffValue),
            };
          }
        }
      }

      // Format date from YYYY-MM-DD to DD.MM
      const formattedDate = date.split("-").slice(1).reverse().join(".");

      positions.push({
        date: formattedDate,
        value: value,
        highlight,
        positionClass,
        diff,
      });
    });

    // Calculate overall change for display in the "Изм." column
    // Compare the newest position (first in array) with the oldest position that has data
    const validPositions = positions.filter((p) => p.value !== "--");

    let change = {
      value: 0,
      positive: true,
    };

    if (validPositions.length >= 2) {
      const newestPosition = validPositions[0]; // Newest date
      const oldestPosition = validPositions[validPositions.length - 1]; // Oldest date with data

      // In SEO, going from position 31 to 9 is positive (lower number is better)
      if (newestPosition.value !== oldestPosition.value) {
        const newestValue = newestPosition.value;
        const oldestValue = oldestPosition.value;
        const changeValue = oldestValue - newestValue; // Positive if improved (went from higher to lower number)

        change = {
          value: Math.abs(changeValue),
          positive: changeValue > 0, // Positive if position number decreased (better ranking)
        };
      }
    }

    // Get volume data if available
    const volumeField = Object.keys(keyword).find((key) =>
      key.startsWith("volume:"),
    );
    const volume = volumeField ? keyword[volumeField] : null;

    return {
      id: keywordIndex + 1,
      keyword: keyword.name,
      volume,
      city: defaultCity,
      searchEngine: defaultSearchEngine,
      change,
      positions,
    };
  });

  return {
    keywords: mappedKeywords,
  };
};
