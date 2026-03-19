import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOtpGuard } from "../hooks/useOtpGuard";
import { useLogout } from "../hooks/useLogout";
import { clearVerifyEmail } from "../utils/authStorage";
import { useToast } from "../context/ToastContext";
import { getGoogleOAuthAuthUrl } from "../api/auth";
import { getEmailFromOtpToken } from "../utils/jwt";

const LastSetup = () => {
  useOtpGuard(); // checks the session JWT
  clearVerifyEmail(); // clears the email being verified in VerifyOTP
  const navigate = useNavigate();
  const logout = useLogout();
  const { showToast } = useToast();
  const [oauthLoading, setOauthLoading] = useState(false);
  const otpEmail = getEmailFromOtpToken();

  const handleProceedWithOAuth = async () => {
    const token = sessionStorage.getItem("otp_token");
    if (!token) {
      showToast("Session expired. Please verify OTP again.", "danger");
      navigate("/verify", { replace: true });
      return;
    }

    try {
      setOauthLoading(true);
      const authUrl = await getGoogleOAuthAuthUrl(token, window.location.origin);
      window.location.href = authUrl;
    } catch (err: any) {
      showToast(err.message || "Unable to start Google OAuth.", "danger");
    } finally {
      setOauthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "520px", width: "100%" }}
      >
        <h3 className="fw-bold mb-4 text-center">
          Connect Gmail Securely
        </h3>

        <p className="text-muted">
          You are verified with OTP. The next recommended step is signing in with
          your Google account using <strong>OAuth</strong>.
        </p>

        <p className="text-muted">
          OAuth lets you authorize this app directly from Google, so you do not
          need to create and paste an app password manually.
        </p>

        <p className="text-muted">
          Sign in with this same email in Google OAuth:{" "}
          <strong>{otpEmail || "your verified email"}</strong>.
        </p>

        <p className="text-muted mb-4">
          If you prefer not to continue right now, you can logout and return
          later.
        </p>

        <button
          className="btn btn-primary w-100"
          onClick={handleProceedWithOAuth}
          disabled={oauthLoading}
        >
          {oauthLoading ? "Redirecting..." : "Proceed with OAuth"}
        </button>

        <button
          className="btn btn-outline-secondary w-100 mt-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LastSetup;
