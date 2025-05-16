import React from "react";
import { Notifications } from "./Notifications";
import { Logout } from "../../../shared/ui/button/Logout";
import { useAuthStore } from "../../../pages/signin/state/signin.store";
import { useNavigate } from "react-router-dom";

export const HeaderControl = ({ notificationsActive, toggleNotifications }) => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    authStore.logout();
    navigate("/signin");
  };
  return (
    <div className="header__control">
      <Notifications
        isActive={notificationsActive}
        onToggle={toggleNotifications}
      />
      <Logout onClick={handleLogout} />
    </div>
  );
};
