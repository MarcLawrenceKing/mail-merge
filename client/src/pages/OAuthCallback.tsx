import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return;
    hasHandledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const message = params.get("message");

    if (token) {
      sessionStorage.setItem("otp_token", token);
      showToast("Google OAuth verified successfully.", "success");
      navigate("/send-email", { replace: true });
      return;
    }

    let fallbackMessage =
      message ||
      (error
        ? "OAuth verification failed. Please try again."
        : "OAuth callback is missing required data.");

    if (error === "email_mismatch") {
      fallbackMessage =
        "OTP and Google OAuth accounts must be the same. Please sign in with the same Gmail address used for OTP.";
    }

    showToast(fallbackMessage, "danger");
    navigate("/verify/otp/app-password", { replace: true });
  }, [navigate, showToast]);

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm p-4 text-center" style={{ maxWidth: "520px", width: "100%" }}>
        <h3 className="fw-bold mb-3">Completing Google OAuth</h3>
        <p className="text-muted mb-0">Please wait while we verify your account...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
