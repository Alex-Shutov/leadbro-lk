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
  colors = ["#2A85FF", "#B5E4CA", "#B1E5FC"],
  isLoading = false,
  skeletonOpacity = 0.5,
}) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isLoading && series && categories && containerRef.current) {
      // Sort categories and corresponding data points
      let sortedCategories = [...categories];
      let sortedSeries = JSON.parse(JSON.stringify(series));

      // Convert date strings to actual Date objects for proper sorting
      const dateObjects = sortedCategories.map((cat) => {
        // Handle different date formats - if it's DD.MM or DD.MM.YYYY
        const parts = cat.split(".");
        if (parts.length === 2) {
          // Assume current year if only DD.MM format
          const currentYear = new Date().getFullYear();
          return new Date(
            currentYear,
            parseInt(parts[1]) - 1,
            parseInt(parts[0]),
          );
        } else if (parts.length === 3) {
          // DD.MM.YYYY format
          return new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0]),
          );
        } else if (cat.includes("/")) {
          // Handle MM/DD/YYYY or DD/MM/YYYY format if used
          const slashParts = cat.split("/");
          if (slashParts.length === 3) {
            return new Date(
              parseInt(slashParts[2]),
              parseInt(slashParts[0]) - 1,
              parseInt(slashParts[1]),
            );
          }
        }

        // If it's in a date format like "18.04" or "27.04"
        const matches = cat.match(/(\d+)\.(\d+)/);
        if (matches) {
          const day = parseInt(matches[1]);
          const month = parseInt(matches[2]) - 1; // JS months are 0-indexed
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, month, day);
        }

        return new Date(); // Fallback for invalid formats
      });

      // Create an array of indices to track the original positions
      const indices = dateObjects.map((_, index) => index);

      // Sort the indices based on the date objects
      indices.sort((a, b) => dateObjects[a] - dateObjects[b]);

      // Reorder categories based on sorted indices
      sortedCategories = indices.map((i) => categories[i]);

      // Reorder data points in each series to match sorted categories
      sortedSeries = sortedSeries.map((s) => {
        const newData = indices.map((i) => s.data[i]);
        return { ...s, data: newData };
      });

      const options = {
        grid: {
          strokeDashArray: 0,
          padding: {
            top: -20,
            right: 0,
            bottom: 0,
            left: 10,
          },
        },
        legend: {
          show: false,
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

      if (chartRef.current) {
        chartRef.current.updateOptions(options);
      } else {
        const chartElement = document.querySelector(`#${id}`);
        if (chartElement) {
          chartRef.current = new ApexCharts(chartElement, options);
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
  }, [id, type, series, categories, height, colors, isLoading]);

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
