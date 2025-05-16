import React from "react";

export const Logout = ({ onClick }) => {
  return (
    <img
      onClick={onClick}
      style={{ padding: "0rem 0.5rem", cursor: "pointer" }}
      src={"/img/custom/power.svg"}
    />
  );
};
