import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import "react-loading-skeleton/dist/skeleton.css";
import "./chart.css";
import { SkeletonLoader } from "../loader";

export const Chart = ({
                        id,
                        type = "line",
                        series,
                        categories,
                        height = "300px",
                        colors = ["#2A85FF", "#B5E4CA", "#B1E5FC", "#83BF6E", "#FF6A55", "#8E59FF"],
                        isLoading = false,
                        skeletonOpacity = 0.5,
                        topDynamics = {},
                        options = {} // Принимаем кастомные options от родительского компонента
                      }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isLoading && series && categories && containerRef.current) {
      // Сортируем категории и соответствующие точки данных
      let sortedCategories = [...categories];
      let sortedSeries = JSON.parse(JSON.stringify(series));

      // Преобразуем строки даты в объекты Date для правильной сортировки
      const dateObjects = sortedCategories.map((cat) => {
        // Обрабатываем разные форматы даты - DD.MM или DD.MM.YYYY
        const parts = cat.split(".");
        if (parts.length === 2) {
          // Предполагаем текущий год, если формат только DD.MM
          const currentYear = new Date().getFullYear();
          return new Date(
              currentYear,
              parseInt(parts[1]) - 1,
              parseInt(parts[0]),
          );
        } else if (parts.length === 3) {
          // Формат DD.MM.YYYY
          return new Date(
              parseInt(parts[2]),
              parseInt(parts[1]) - 1,
              parseInt(parts[0]),
          );
        } else if (cat.includes("/")) {
          // Обрабатываем MM/DD/YYYY или DD/MM/YYYY форматы, если используются
          const slashParts = cat.split("/");
          if (slashParts.length === 3) {
            return new Date(
                parseInt(slashParts[2]),
                parseInt(slashParts[0]) - 1,
                parseInt(slashParts[1]),
            );
          }
        }

        // Если формат даты типа "18.04" или "27.04"
        const matches = cat.match(/(\d+)\.(\d+)/);
        if (matches) {
          const day = parseInt(matches[1]);
          const month = parseInt(matches[2]) - 1; // JS месяцы начинаются с 0
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, month, day);
        }

        return new Date(); // Запасной вариант для некорректных форматов
      });

      // Создаем массив индексов для отслеживания исходных позиций
      const indices = dateObjects.map((_, index) => index);

      // Сортируем индексы на основе объектов Date
      indices.sort((a, b) => dateObjects[a] - dateObjects[b]);

      // Переупорядочиваем категории на основе отсортированных индексов
      sortedCategories = indices.map((i) => categories[i]);

      // Переупорядочиваем точки данных в каждой серии соответственно отсортированным категориям
      sortedSeries = sortedSeries.map((s) => {
        const newData = indices.map((i) => s.data[i]);
        return { ...s, data: newData };
      });

      // Настраиваем tooltip для отображения динамики топов
      const customTooltip = {
        enabled: true,
        shared: true,
        intersect: false,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const seriesName = w.globals.seriesNames[seriesIndex];
          const value = series[seriesIndex][dataPointIndex];
          const category = w.globals.categoryLabels[dataPointIndex];

          // Получаем динамику для текущего топа (если есть)
          const topKey = seriesName.replace("Топ ", "").replace("-", "_");
          const dynamicValue = topDynamics[topKey] || 0;

          // Определяем цвет для динамики
          const dynamicColor = dynamicValue > 0 ? "#26842A" :
              dynamicValue < 0 ? "#FF6A55" : "#6F767E";

          // Создаем HTML для tooltip
          return `
            <div class="apexcharts-tooltip-title" style="padding: 8px 10px; font-weight: bold; margin-bottom: 5px;">
              ${category}
            </div>
            <div class="apexcharts-tooltip-series-group" style="padding: 8px 10px; display: flex; flex-direction: column;">
              <div style="color: ${w.globals.colors[seriesIndex]}; font-weight: bold; margin-bottom: 5px;">
                ${seriesName}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Значение: ${value}</span>
                <span style="color: ${dynamicColor}; font-weight: bold; margin-left: 10px;">
                  ${dynamicValue > 0 ? '+' : ''}${dynamicValue}%
                </span>
              </div>
            </div>
          `;
        }
      };

      // Определяем базовые опции графика
      const defaultOptions = {
        grid: {
          strokeDashArray: 0,
          padding: {
            top: -20,
            right: 0,
            bottom: 0,
            left: 10,
          },
        },

        colors,
        series: sortedSeries,
        chart: {
          height: "100%",
          type,
          toolbar: {
            show: false,
          },
          fontFamily: "Inter, sans-serif",
          animations: {
            enabled: true,
          },
          redrawOnParentResize: true,
          redrawOnWindowResize: true,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 4,
        },
        xaxis: {
          type: "category",
          categories: sortedCategories,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        tooltip: customTooltip,
        markers: {
          size: 5,
          hover: {
            size: 7
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: "100%",
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: "8px",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: "8px",
                  },
                },
              },
            },
          },
        ],
      };

      // Объединяем базовые опции с кастомными опциями
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        // Обеспечиваем сохранение базовых параметров, которые перезатираются в опциях верхнего уровня
        chart: {
          ...defaultOptions.chart,
          ...options.chart,
          type, // Гарантируем, что тип графика соответствует параметру type
        },
        // Гарантируем, что series и colors всегда применяются из параметров компонента
        series: sortedSeries,
        colors: colors,
        xaxis: {
          ...defaultOptions.xaxis,
          ...options.xaxis,
          categories: sortedCategories, // Гарантируем использование отсортированных категорий
        },
        // Убедимся, что легенда всегда видима, если не указано явно
        legend: {
          ...defaultOptions.legend,
          ...options.legend,
          show: false
        }
      };

      if (chartRef.current) {
        chartRef.current.updateOptions(mergedOptions);
      } else {
        const chartElement = document.querySelector(`#${id}`);
        if (chartElement) {
          chartRef.current = new ApexCharts(chartElement, mergedOptions);
          chartRef.current.render();
        }
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [id, type, series, categories, height, colors, isLoading, topDynamics, options]);

  return (
      <div
          ref={containerRef}
          className="chart-container"
          style={{
            height,
            width: "100%",
            position: "relative",
            minHeight: "200px",
          }}
      >
        {isLoading ? (
            <SkeletonLoader height="100%" width="100%" opacity={skeletonOpacity} />
        ) : (
            <div id={id} style={{ height: "100%", width: "100%" }} />
        )}
      </div>
  );
};