import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../api/auth";

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

// - implemented useRef to prevent unlimited toast loop bug
// - If an effect must run only once per mount and should survive re-renders → useRef
export const useOtpGuard = (options?: UseOtpGuardOptions) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const redirectPath = options?.redirectTo ?? "/verify";

  // 🔒 Prevent multiple executions
  const hasHandledRef = useRef(false);

  useEffect(() => {
    // 🛑 Already handled → do nothing
    if (hasHandledRef.current) return;

    const token = sessionStorage.getItem("otp_token");

    const fail = (message: string) => {
      hasHandledRef.current = true; // lock it
      sessionStorage.removeItem("otp_token");
      showToast(message, "danger");
      navigate(redirectPath, { replace: true });
    };

    if (!token) {
      fail("Invalid access. Please verify your email first.");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/otp-guard-check`, {
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
