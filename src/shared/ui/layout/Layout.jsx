import React, { useState } from "react";
import { Header } from "../../../widgets/header";
import { Sidebar } from "../../../widgets/sidebar";

export const Layout = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="page">
      <Header isVisible={isVisible} setIsVisible={setIsVisible} />
      <Sidebar isVisible={isVisible} setIsVisible={setIsVisible} />

      <div className="page__wrapper">
        <div className="page__content">{children}</div>
      </div>
    </div>
  );
};
