import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "zustand";
import { useAuthStore } from "../../../pages/signin/state/signin.store";

export const UserMenu = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="header__item header__item_user">
      <a className="header__head" href="/">
        <img
          className="header__pic"
          src={user?.avatar || "img/content/avatar.jpg"}
          alt="Avatar"
        />
      </a>
      <div className="header__body">
        <div className="header__name">{user?.name || "Гость"}</div>
        <div className="header__email">{user?.email || "guest@leadbro.ru"}</div>
        <div className="header__nav">
          <Link className="header__link" to="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 5a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-2.5 7a1.5 1.5 0 0 0-1.5 1.5v1a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5h-13zm-3 1.5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3v-1z"
                fill="#777e91"
              ></path>
            </svg>
            Профиль
          </Link>
          <Link className="header__link" to="/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.574 1.677A.75.75 0 0 1 8 1.5h4a.75.75 0 0 1 .425.13l3.996 2.785a.75.75 0 0 1 .079 1.177l-3.991 3.309a.75.75 0 0 1-.755.148l-3.992-1.51a.75.75 0 0 1-.504-.713V2.25a.75.75 0 0 1 .316-.573zm5.258 3.26L11 4.15V6.52l2.691 1.018 2.3-1.905-3.16-2.696z"
                fill="#777e91"
              ></path>
              <path
                d="M5.667 3.419A1.947 1.947 0 0 0 6.8 3a.75.75 0 0 0 0-1.5c-.978 0-1.9.352-2.618.966a.75.75 0 1 0 .974 1.14c.152-.13.33-.216.51-.187zm1.52 11.218c-.18.028-.359-.059-.51-.188a.75.75 0 0 0-.974 1.14 3.945 3.945 0 0 0 2.618.966.75.75 0 0 0 0-1.5c-.433 0-.825-.14-1.135-.418zm7.52-6.784a1.522 1.522 0 0 1 0 .294.75.75 0 0 0 1.5 0c0-.339-.026-.677-.078-1.01a.75.75 0 0 0-1.485.213c.04.165.062.334.063.503zM4.316 7.9c.028-.18.169-.283.31-.335a.75.75 0 0 0-.504-1.41c-.883.316-1.616.96-2.045 1.799a.75.75 0 0 0 1.331.688c.097-.188.225-.35.386-.466a1.31 1.31 0 0 1 .522-.275zm-.413 4.363c-.14-.051-.28-.155-.309-.335a1.31 1.31 0 0 0-.522-.274c-.16-.117-.288-.28-.386-.467a.75.75 0 0 0-1.331.688c.429.84 1.162 1.483 2.045 1.799a.75.75 0 0 0 .504-1.41zM14.92 7.49c.4.065.088.176.087.31a.75.75 0 0 0 1.5 0 1.947 1.947 0 0 0-.187-.766.75.75 0 1 0-1.342.669c-.034.068-.052.14-.058.213-.006-.073-.023-.145-.057-.213a.75.75 0 1 0-1.342-.669 1.947 1.947 0 0 0-.188.766.75.75 0 0 0 1.5 0c0-.134.046-.245.087-.31z"
                fill="#777e91"
              ></path>
              <path
                fillRule="evenodd"
                d="M8.664 14.738a.75.75 0 0 1 .17-.964l3.992-3.309a.75.75 0 0 1 .754-.148l3.992 1.51a.75.75 0 0 1 .504.712v4.578a.75.75 0 0 1-.316.573l-3.996 2.785a.75.75 0 0 1-.852 0l-3.996-2.785a.75.75 0 0 1-.316-.573v-1.342a.75.75 0 0 1 .17-.655l3.09-3.09a.75.75 0 0 1 1.061 1.06l-2.757 2.758v.439l3.246 2.264 3.246-2.264v-3.537l-3.246-1.228-3.246 2.69v.173a.75.75 0 0 1-1.5 0v-.648z"
                fill="#777e91"
              ></path>
            </svg>
            Настройки
          </Link>
          <button className="header__link" onClick={logout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.75 2.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5z"
                fill="#777e91"
              ></path>
              <path
                fillRule="evenodd"
                d="M8.713 3.217a6.25 6.25 0 1 0 7.538 9.851.75.75 0 0 1 1.125.992 7.751 7.751 0 1 1-4.528-11.675.75.75 0 0 1-.135 1.392c-1.363-.13-2.746.128-3.954.765a.75.75 0 1 1-.693-1.329 9.255 9.255 0 0 1 .647.005z"
                fill="#777e91"
              ></path>
            </svg>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};
