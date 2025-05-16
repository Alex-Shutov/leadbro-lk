import React from "react";
import { Link } from "react-router-dom";

const SidebarLogos = () => {
  return (
    <>
      <Link className="sidebar__logo" to="/">
        <img className="some-icon" src="img/logo.svg" alt="Core" />
        <img className="some-icon-dark" src="img/logo-dark.svg" alt="Core" />
      </Link>
      <Link className="sidebar__logo sidebar__logo-small" to="/">
        <img className="some-icon" src="img/logo-small.svg" alt="Core" />
        <img
          className="some-icon-dark"
          src="img/logo-small-dark.svg"
          alt="Core"
        />
      </Link>
    </>
  );
};

export default SidebarLogos;
