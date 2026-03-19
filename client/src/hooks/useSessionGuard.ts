import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../api/auth";

interface UseSessionGuardOptions {
  redirectTo?: string;
}

export const useSessionGuard = (options?: UseSessionGuardOptions) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const hasHandledRef = useRef(false);

  const redirectPath = options?.redirectTo ?? "/verify";

  useEffect(() => {
    if (hasHandledRef.current) return;

    const token = sessionStorage.getItem("otp_token");

    const fail = (message: string) => {
      hasHandledRef.current = true;
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
        const res = await fetch(`${API_URL}/api/auth/session-guard-check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          fail(data.message || "Session expired. Please verify OTP and OAuth.");
        }
      } catch {
        fail("Unable to verify session. Please try again.");
      }
    };

    validateToken();
  }, [navigate, redirectPath, showToast]);
};
