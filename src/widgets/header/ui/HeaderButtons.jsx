import React from "react";
import { Link } from "react-router-dom";

export const HeaderButtons = () => {
  return (
    <div className="header__btns">
      <Link className="header__link" to="sign-in.html">
        Sign in
      </Link>
      <Link className="button header__button" to="sign-up.html">
        Sign up
      </Link>
    </div>
  );
};
