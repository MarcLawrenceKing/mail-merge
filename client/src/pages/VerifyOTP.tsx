import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { getVerifyEmail } from "../utils/authStorage";
import { sendOtp, verifyOtp } from "../api/auth";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const email = getVerifyEmail();
  const [otp, setOtp] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { showToast } = useToast();

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);

    if (!email) {
      showToast("Email is required", "danger");
      return;
    }
    try {
      // helper function
      await sendOtp(email); 
      showToast("OTP sent to your email", "success");

    } catch (err: any) {
      showToast(err.message || "Unable to send OTP", "danger");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

  try {

    if (!email) {
      showToast("Email is missing", "danger");
      return;
    }
    const data = await verifyOtp(email, otp);

    // store token and navigate
    sessionStorage.setItem("otp_token", data.token);
    navigate("/verify/otp/app-password");

  } catch (err: any) {
    showToast(err.message || "Server error. Please try again.", "danger");
  } finally {
    setSubmitLoading(false);
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
          disabled={!otp || submitLoading}
        >
          {submitLoading ? "Sending..." : "Submit"}
        </button>

        <p className="text-muted text-center mt-4 mb-2">Did not receive OTP?</p>
        <button
          className="btn btn-outline-secondary w-100"
          onClick={handleResendOtp}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

      </div>
    </div>
  );
};

export default VerifyOTP;