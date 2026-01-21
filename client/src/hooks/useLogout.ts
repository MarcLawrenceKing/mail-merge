import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    // Clear all session storage
    sessionStorage.clear();
    localStorage.clear();

    // Navigate to default route
    navigate("/", { replace: true });
  }, [navigate]);

  return logout;
};
