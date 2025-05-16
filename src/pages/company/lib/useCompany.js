import { useEffect } from "react";
import { useCompanyStore } from "../state/company.state";
import { useAuthStore } from "../../signin/state/signin.store";

export const useCompany = () => {
  const { company, manager, services, isLoading, error, setCompany } =
    useCompanyStore();

  return {
    company: company,
    manager,
    services,
    isLoading,
    error,
  };
};
