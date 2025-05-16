import React from "react";
import { useTheme } from "../../../core/hooks/useTheme";
import "./Skeleton.css";

export const SkeletonLoader = ({
  height = "100%",
  width = "100%",
  borderRadius = "8px",
  opacity = 0.5,
  className = "",
}) => {
  const { isDark } = useTheme();

  const baseColor = isDark ? "rgb(39,43,48)" : "rgba(244, 244, 244, 0.5)";
  const highlightColor = isDark ? "rgb(49,55,60)" : "rgba(224, 224, 224, 0.5)";

  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        height,
        width,
        borderRadius,
        opacity,
        background: `linear-gradient(90deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
      }}
    />
  );
};
