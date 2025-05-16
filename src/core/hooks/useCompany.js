import React from "react";
import { useAuthStore } from "../../pages/signin/state/signin.store";

const UseCompany = () => {
  const { user } = useAuthStore();
  return { id: user.id };
};

export default UseCompany;
