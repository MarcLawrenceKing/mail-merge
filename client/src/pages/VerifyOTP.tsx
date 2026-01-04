import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { clearVerifyEmail, getVerifyEmail } from "../utils/authStorage";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const email = getVerifyEmail();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    // this is response from backend (success or failed)
    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "OTP verification failed", "danger");

      // backend flag when user has too many wrong attempts
      if (data.locked) {
        clearVerifyEmail();
        sessionStorage.clear();
        navigate("/verify", { replace: true });
      }

      return;
    }

    // if OTP is correct, create otp_token
    sessionStorage.setItem("otp_token", data.token);
    navigate("/verify/otp/app-password");

  } catch {
    showToast("Server error. Please try again.", "danger");
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    if (!email) {
      // show toast here
      showToast("Invalid access. Please enter your email first.", "danger");
      // replace:true so that user cannot go "back" to the VerifyOTP page w/out an email
      navigate("/verify", { replace: true });
    }
  }, [email, navigate]);

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm p-4" style={{ maxWidth: "520px", width: "100%" }}>
        
        <h3 className="fw-bold mb-4 text-center">
          Verify Google Account
        </h3>

        <p className="text-muted text-center mb-4">
          Please check your email address for the a one-time password (OTP).
        </p>

        <div className="mb-3">
          <label htmlFor="otp" className="form-label">
            OTP
          </label>
          <input
            id="otp"
            type="text"
            className="form-control"
            placeholder="e.g. 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={!otp || loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

      </div>
    </div>
  );
};

export default VerifyOTP;