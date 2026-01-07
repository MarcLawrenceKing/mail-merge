import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

interface UseOtpGuardOptions {
  redirectTo?: string;
}

// this custom hook protects a frontend page from sessions without the correct tokens

// - initializes important variables such as useNavigate and useToast, and the redirectPath incase the session is invalid
// - has a useEffect that:
// -- gets the token from sessionStorage
// -- returns to /verify if there is no token
// -- fetches the backend API that checks the jwt of the session, 
// - if session expired, showToast and remove the otp_token from the sessionStorage
export const useOtpGuard = (options?: UseOtpGuardOptions) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const redirectPath = options?.redirectTo ?? "/verify";

  useEffect(() => {
    const token = sessionStorage.getItem("otp_token");

    if (!token) {
      showToast("Invalid access. Please verify your email first.", "danger");
      navigate(redirectPath, { replace: true });
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch("/api/auth/otp-guard-check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(
            data.message || "Session expired. Please verify again.",
            "danger"
          );
          sessionStorage.removeItem("otp_token");
          navigate(redirectPath, { replace: true });
          return;
        }

      } catch {
        showToast("Unable to verify session. Please try again.", "danger");
        navigate(redirectPath, { replace: true });
      }
    };

    validateToken();
  }, [navigate, showToast, redirectPath]);
};
